/**
 * Main program flow for the Mockoon config generator
 */
import * as fs from "fs-extra";
import * as path from "path";
import { compileTypeScript } from "./compiler";
import { processGlobalConfig } from "./processors/global-processor";
import { processFeatures } from "./processors/feature-processor";
import { processData } from "./processors/data-processor";
import { generateConfig } from "./generators/config-generator";
import { validateUUID } from "./validators";

/**
 * Main function that orchestrates the config generation process
 * @param configDir The directory containing the config files
 * @param outputPath The path to write the generated config to
 */
export async function main(
  configDir: string,
  outputPath: string
): Promise<void> {
  try {
    console.log("=".repeat(50));
    console.log(
      `Starting Mockoon config generation at ${new Date().toLocaleTimeString()}`
    );
    console.log(`Config directory: ${configDir}`);
    console.log(`Output path: ${outputPath}`);
    console.log("=".repeat(50));

    // Compile TypeScript to JavaScript
    console.log("Compiling TypeScript files...");
    const compiledDir = await compileTypeScript(configDir);

    // Process global config
    console.log("Processing global config...");
    const globalConfig = await processGlobalConfig(compiledDir);

    // Process features
    console.log("Processing features...");
    const { folders, routes } = await processFeatures(compiledDir);

    // Process data
    console.log("Processing data...");
    const databuckets = await processData(compiledDir);

    // Validate UUIDs and their formats
    console.log("Validating UUIDs...");
    validateUUID(globalConfig, "globalConfig");
    validateUUID(folders, "folders");
    validateUUID(routes, "routes");
    validateUUID(databuckets, "databuckets");

    // Generate the final config
    console.log("Generating final config...");
    const config = generateConfig(globalConfig, folders, routes, databuckets);

    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    await fs.ensureDir(outputDir);

    // Write the config to the output file
    console.log(`Writing config to ${outputPath}...`);
    await fs.writeJson(outputPath, config, { spaces: 2 });

    // Verify the file was written correctly
    const fileStats = await fs.stat(outputPath);
    console.log(`Config file written successfully (${fileStats.size} bytes)`);

    // Clean up temporary directory
    console.log("Cleaning up temporary files...");
    await fs.remove(compiledDir);

    console.log("=".repeat(50));
    console.log(
      `Mockoon config generated successfully at ${new Date().toLocaleTimeString()}`
    );
    console.log(`Output file: ${outputPath}`);
    console.log("=".repeat(50));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error generating Mockoon config:", error.message);
    } else {
      console.error("Error generating Mockoon config:", error);
    }
    process.exit(1);
  }
}
