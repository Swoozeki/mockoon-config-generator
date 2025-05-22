/**
 * Process global.js to extract environment-level settings
 */
import * as fs from "fs-extra";
import * as path from "path";
import { GlobalConfig } from "../types";

/**
 * Processes the global configuration file
 * @param compiledDir The directory containing the compiled JavaScript files
 * @returns The global configuration object
 */
export async function processGlobalConfig(
  compiledDir: string
): Promise<GlobalConfig> {
  const globalPath = path.resolve(compiledDir, "global.js");

  // Check if global.js exists
  if (!fs.existsSync(globalPath)) {
    throw new Error(`global.js not found at path: ${globalPath}`);
  }

  try {
    // Load the global config
    // We need to use dynamic import to load the compiled JavaScript file
    const globalConfig = require(globalPath).default || require(globalPath);

    // Validate that UUID is provided
    if (!globalConfig.uuid) {
      throw new Error("Missing UUID in global config");
    }

    return globalConfig;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error processing global config: ${error.message}`);
    }
    throw error;
  }
}
