/**
 * Process data files to create databuckets
 */
import * as fs from "fs-extra";
import * as path from "path";
import { DatabucketConfig } from "../types";

/**
 * Processes the data files
 * @param compiledDir The directory containing the compiled JavaScript files
 * @returns An array of databucket objects
 */
export async function processData(
  compiledDir: string
): Promise<DatabucketConfig[]> {
  // Use path.resolve to ensure we're using absolute paths
  const dataDir = path.resolve(compiledDir, "data");
  const databuckets: DatabucketConfig[] = [];

  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    return databuckets;
  }

  // Get all JavaScript files in the data directory
  const dataFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".js"));

  // Process each data file
  for (const dataFile of dataFiles) {
    const filePath = path.join(dataDir, dataFile);

    try {
      // Load the databucket configuration
      const databucketConfig = require(filePath).default || require(filePath);

      // Validate that databucket UUID is provided
      if (!databucketConfig.uuid) {
        throw new Error(`Missing UUID in databucket config for ${dataFile}`);
      }

      // Add databucket to databuckets array
      databuckets.push(databucketConfig);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error processing data file ${dataFile}: ${error.message}`
        );
      }
      throw error;
    }
  }

  return databuckets;
}
