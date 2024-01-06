import fs from "fs"
import path from "path"
import { promisify } from "util"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { pathToFileURL } from "url"
import type global from "../app.d.ts"
import { JSONSchema7 } from "json-schema-to-ts/lib/types/definitions"
import { utils } from "$validation"
import { readFile } from "node:fs/promises"
import chalk from "chalk"
import prettier from "prettier"
import { Project, SyntaxKind } from "ts-morph";

console.log(chalk.cyan("Updating form schemas..."))

const prettierOptions = await prettier.resolveConfig(".prettierrc")
const readDir = promisify(fs.readdir)
const writeFile = promisify(fs.writeFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const formDefinitionsDir = path.join(__dirname, "..", "lib", "shared", "validation", "forms")

function generateSchema(definition: FormValidatorDefinition): JSONSchema7 {

    const form: FormValidator = utils.formValidator(definition)

    const schema = {
      type: "object",
      properties: {},
      required: form.requiredFields || [] as string[],
    } satisfies JSONSchema7
  
    Object.entries(form.fields).forEach(([fieldName, field]) => {

        let fieldTypes: string[] | undefined = undefined

        Object.entries(field.validators).forEach(([validatorName, validator]) => {
            if (validatorName === "required") {
                schema.required!.push(fieldName)
            }
            const validatorTypes = validator.types.split("|")

            validatorTypes.forEach(type => {
                if (type.trim() !== type) {
                    throw new Error(`There is whitespace in the types string for the ${validatorName} validator.`)
                }
            })

            if (fieldTypes === undefined) {
                fieldTypes = validatorTypes
            }
            else {
                fieldTypes = fieldTypes.filter(type => validatorTypes.includes(type) || ["unknown", "any"].includes(type))
            }
        })

        if (fieldTypes! === undefined) {
            fieldTypes = ["unknown"]
        }

        if (fieldTypes.length === 0) {
            throw new Error(`Could not determine type for field ${fieldName}`)
        }

        schema.properties[fieldName] = { 
          type: fieldTypes
        }
    })
    return schema
  }

  async function generateSchemaForFormDefinitions(dir: string): Promise<void> {
    const files = await readDir(dir, { withFileTypes: true })
  
    for (const file of files) {
      
      const filePath = path.join(dir, file.name)
      if (file.isDirectory()) {
        await generateSchemaForFormDefinitions(filePath)
      } else if (file.isFile() && file.name !== "index.ts" && !file.name.includes(".test") && path.extname(file.name) === ".ts") {
        console.log(chalk.yellow(`Updating form schema for ${filePath}...`))
        
        let formDefinition: FormValidatorDefinition

        try {
          FormSchema = (await import(pathToFileURL(filePath).href)).default
        }
        catch (error) {
            console.log(chalk.red(`Error importing ${filePath}:`))
            console.log(chalk.red(error))
            continue
        }
        
        const schema = generateSchema(formDefinition)
      
        let formFileContent = await readFile(filePath, 'utf-8')

        // Create a new TypeScript project
        const project = new Project();

        // Add the file to the project
        const sourceFile = project.createSourceFile("temp.ts", formFileContent);

        // Find the _schema property
        const schemaProperty = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .find(property => property.getName() === "_schema");

        if (schemaProperty) {
          // Remove the _schema property
          schemaProperty.remove();
        }

        // Get the updated file content
        formFileContent = sourceFile.getFullText();

        // Insert the new _schema
        const insertPosition = formFileContent.lastIndexOf('}')
        const schemaString = `,\n  "_schema": ${JSON.stringify(schema, null, 2)}\n`
      
        // Generate the new file content
        // Format it with prettier
        let updatedFileContent = [
          formFileContent.slice(0, insertPosition),
          schemaString,
          formFileContent.slice(insertPosition)
        ].join('')
        const formDefinitionString = `export default ${JSON.stringify(formDefinition, null, 2)} as global.FormValidatorDefinition`
        updatedFileContent = updatedFileContent.replace(/export default .+ as FormValidatorDefinition/, formDefinitionString)
        updatedFileContent = prettier.format(updatedFileContent, { ...prettierOptions, parser: "typescript" })

        // Write the updated definition content back to the file
        await writeFile(filePath, updatedFileContent)
      }
    }
  }

generateSchemaForFormDefinitions(formDefinitionsDir)
  .catch(console.error)

console.log(chalk.green("Updating form schemas completed.\n"))