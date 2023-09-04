/**
 * Script to generate the tsconfig.json file from the aliases.yaml file.
 * Preserves the existing tsconfig.json file, but updates the paths property.
 */

import fs from "fs"
import yaml from "js-yaml"

// Read the aliases from the YAML file
const aliases = yaml.load(fs.readFileSync("aliases.yaml", "utf-8"))

// Read the existing tsconfig.json
const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf-8"))

// Update the paths property
tsconfig.compilerOptions.paths = Object.fromEntries(
	Object.entries(aliases).map(([alias, path]) => [alias, [path]])
)

// Write the updated configuration back to tsconfig.json
fs.writeFileSync("tsconfig.json", JSON.stringify(tsconfig, null, 2))

console.log("Updated tsconfig.json")
