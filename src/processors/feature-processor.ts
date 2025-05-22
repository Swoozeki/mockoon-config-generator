/**
 * Process feature files to create routes
 */
import * as fs from "fs-extra";
import * as path from "path";

/**
 * Interface for the result of processing features
 */
interface FeatureProcessingResult {
  folders: any[];
  routes: any[];
}

/**
 * Processes the feature files
 * @param compiledDir The directory containing the compiled JavaScript files
 * @returns An object containing the folders and routes
 */
export async function processFeatures(
  compiledDir: string
): Promise<FeatureProcessingResult> {
  const featuresDir = path.join(compiledDir, "features");
  const folders: any[] = [];
  const routes: any[] = [];

  // Check if features directory exists
  if (!fs.existsSync(featuresDir)) {
    return { folders, routes };
  }

  // Get all subdirectories in the features directory
  const featureDirs = fs
    .readdirSync(featuresDir)
    .filter((item) => fs.statSync(path.join(featuresDir, item)).isDirectory());

  // Process each feature directory
  for (const featureDir of featureDirs) {
    const featurePath = path.join(featuresDir, featureDir);

    // Create folder object
    const folderConfigPath = path.join(featurePath, "folder.js");
    let folder: any;

    if (fs.existsSync(folderConfigPath)) {
      // If folder.js exists, use it for folder configuration
      folder = require(folderConfigPath).default || require(folderConfigPath);
    } else {
      // Otherwise, create a basic folder object with the directory name
      folder = {
        name: featureDir
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()), // Convert kebab-case to Title Case
        children: [],
      };
    }

    // Validate that folder UUID is provided
    if (!folder.uuid) {
      throw new Error(`Missing UUID in folder config for ${featureDir}`);
    }

    // Get all JavaScript files in the feature directory (excluding folder.js)
    const featureFiles = fs
      .readdirSync(featurePath)
      .filter((file) => file.endsWith(".js") && file !== "folder.js");

    // Process each feature file
    for (const featureFile of featureFiles) {
      const filePath = path.join(featurePath, featureFile);

      // Load the route configuration
      const routeConfig = require(filePath).default || require(filePath);

      // Validate that route UUID is provided
      if (!routeConfig.uuid) {
        throw new Error(
          `Missing UUID in route config for ${featureDir}/${featureFile}`
        );
      }

      // Validate that all responses have UUIDs
      if (routeConfig.responses) {
        for (const response of routeConfig.responses) {
          if (!response.uuid) {
            throw new Error(
              `Missing UUID in response for route ${featureDir}/${featureFile}`
            );
          }
        }
      }

      // Add route reference to folder's children
      folder.children.push({
        type: "route",
        uuid: routeConfig.uuid,
      });

      // Add route to routes array
      routes.push(routeConfig);
    }

    // Add folder to folders array
    folders.push(folder);
  }

  return { folders, routes };
}
