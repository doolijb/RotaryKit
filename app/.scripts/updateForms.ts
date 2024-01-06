import fs from "fs"
import path from "path"
import { exit } from "process"
import { promisify } from "util"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { pathToFileURL } from "url"
import tsconfigpaths from "tsconfig-paths"

const readDir = promisify(fs.readdir)
const writeFile = promisify(fs.writeFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


// const tsconfig = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tsconfig.json"), "utf8"))
// const baseUrl = path.join(__dirname, "..", tsconfig.compilerOptions.baseUrl)
// const cleanup = tsconfigpaths.register({
//   baseUrl,
//   paths: tsconfig.compilerOptions.paths,
// })

const formDefinitionsDir = path.join(__dirname, "..", "lib", "shared", "validation", "forms")

function generateSchema(form) {
    const schema = {
      type: "object",
      properties: {},
      required: [],
    }
  
    Object.entries(form).forEach(([fieldName, field]) => {

        let fieldTypes = undefined

        Object.entries(field).forEach(([validatorName, {validator}]) => {
            if (validatorName === "required") {
                schema.required.push(fieldName)
            }
            const validatorFunction = field.validator.test.toString()
            const validatorTypes = validatorFunction.match(/ValidatorTestParams<.*?,\s*(.*?)>/)[1].split("|").map(type => type.trim())
            if (!validatorTypes) {
                throw new Error(`Could not determine data type for the ${validatorName} validator.`)
            }
            if (fieldTypes === undefined) {
                fieldTypes = []
            }
        })

        if (fieldTypes === undefined) {
            fieldTypes = ["unknown"]
        }

        if (fieldTypes.length === 0) {
            throw new Error(`Could not determine type for field ${fieldName}`)
        }
    
        schema.properties[fieldName] = { 
        type: fieldTypes.length === 1 ? fieldTypes[0] : fieldTypes,
        // description: field.description,
        }
    })
    return schema
  }

  async function generateSchemaForFormDefinitions(dir) {
    const files = await readDir(dir, { withFileTypes: true })
    let count = 0
  
    for (const file of files) {
      if (count > 0) {
        exit
      }
      count++
      
      const filePath = path.join(dir, file.name)
      console.log("filePath", filePath)
      if (file.isDirectory()) {
        await generateSchemaForFormDefinitions(filePath)
      } else if (file.isFile() && file.name !== "index.ts" && !file.name.includes(".test") && path.extname(file.name) === ".ts") {
        const FormSchema = (await import(pathToFileURL(filePath).href)).default
        console.log("formDefinition", formDefinition)
        const schema = generateSchema(formDefinition) // use generateSchema(form)
        formDefinition._schema = schema
  
        const fileContent = `export default ${JSON.stringify(formDefinition, null, 2)}`
        await writeFile(filePath, fileContent)
      }
    }
  }

generateSchemaForFormDefinitions(formDefinitionsDir)
  .catch(console.error)//.finally(cleanup)