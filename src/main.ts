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
import { v4 as uuidv4 } from "uuid";

/**
 * Helper function to log messages with timestamps and separators
 * @param message The message to log
 * @param isStart Whether this is a start or end message
 * @param outputPath Optional output path to include in the log
 */
function logWithTimestamp(
  message: string,
  isStart = true,
  outputPath?: string
): void {
  console.log("=".repeat(50));
  console.log(`${message} at ${new Date().toLocaleTimeString()}`);
  if (outputPath) {
    console.log(`Output file: ${outputPath}`);
  }
  console.log("=".repeat(50));
}

/**
 * Common error handler for all functions
 * @param error The error that occurred
 * @param context The context in which the error occurred
 */
function handleError(error: unknown, context: string): never {
  if (error instanceof Error) {
    console.error(`Error ${context}:`, error.message);
  } else {
    console.error(`Error ${context}:`, error);
  }
  process.exit(1);
}

/**
 * Process and generate the Mockoon configuration
 * @param configDir The directory containing compiled config files
 * @param outputPath The path to write the generated config to
 */
async function processAndGenerateConfig(
  compiledDir: string,
  outputPath: string
): Promise<void> {
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
}

/**
 * Main function that orchestrates the config generation process
 * @param configDir The directory containing the config files
 * @param outputPath The path to write the generated config to
 */
export async function main(
  configDir: string,
  outputPath: string,
  baseDir: string
): Promise<void> {
  try {
    logWithTimestamp("Starting Mockoon config generation", true);
    console.log(`Base directory: ${baseDir}`);
    console.log(`Config directory: ${configDir}`);
    console.log(`Output path: ${outputPath}`);

    // Ensure base directory and output directory exist
    await fs.ensureDir(baseDir);
    await fs.ensureDir(path.dirname(outputPath));

    // Check if config directory exists
    if (!fs.existsSync(configDir)) {
      console.log(`Config directory ${configDir} does not exist.`);
      console.log("Generating example configuration...");
      await generateExampleConfig(configDir, outputPath, baseDir);
      return;
    }

    // Compile TypeScript to JavaScript
    console.log("Compiling TypeScript files...");
    const compiledDir = await compileTypeScript(configDir, baseDir);

    await processAndGenerateConfig(compiledDir, outputPath);

    logWithTimestamp(
      "Mockoon config generated successfully",
      false,
      outputPath
    );
  } catch (error) {
    handleError(error, "generating Mockoon config");
  }
}

/**
 * Generates an example configuration with a sample feature and endpoints
 * @param configDir The directory to create for example config files
 * @param outputPath The path to write the generated config to
 */
async function generateExampleConfig(
  configDir: string,
  outputPath: string,
  baseDir: string
): Promise<void> {
  try {
    // Create directory structure
    console.log(`Creating directory structure in ${baseDir}...`);

    // Ensure the src directory exists
    await fs.ensureDir(configDir);

    // Create feature and data directories inside src
    await fs.ensureDir(path.join(configDir, "features", "example-feature"));
    await fs.ensureDir(path.join(configDir, "data"));

    // Ensure the dist directory exists
    await fs.ensureDir(path.dirname(outputPath));

    // Generate folder config
    const folderConfig = {
      uuid: uuidv4(),
      name: "Example Feature",
      children: [],
    };

    // Write files
    console.log("Writing example configuration files...");

    // Global config
    await fs.writeFile(
      path.join(configDir, "global.ts"),
      `/**
 * Global configuration for the Mockoon environment
 */
import { GlobalConfig } from "mockoon-config-generator";

export default {
  uuid: "${uuidv4()}",
  lastMigration: 33,
  name: "Example API",
  endpointPrefix: "",
  latency: 0,
  port: 3000,
  hostname: "",
  proxyMode: false,
  proxyHost: "",
  proxyRemovePrefix: false,
  proxyReqHeaders: [
    {
      key: "",
      value: "",
    }
  ],
  proxyResHeaders: [
    {
      key: "",
      value: "",
    }
  ],
  cors: true,
  headers: [
    {
      key: "Content-Type",
      value: "application/json",
    },
    {
      key: "Access-Control-Allow-Origin",
      value: "*",
    },
    {
      key: "Access-Control-Allow-Methods",
      value: "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
    },
    {
      key: "Access-Control-Allow-Headers",
      value: "*",
    },
  ],
  tlsOptions: {
    enabled: false,
    type: "CERT",
    pfxPath: "",
    certPath: "",
    keyPath: "",
    caPath: "",
    passphrase: "",
  },
  callbacks: [],
} as GlobalConfig;
`
    );

    // Folder config
    await fs.writeFile(
      path.join(configDir, "features", "example-feature", "folder.ts"),
      `/**
 * Configuration for the Example Feature folder
 */
import { FolderConfig } from "mockoon-config-generator";

export default {
  uuid: "${folderConfig.uuid}",
  name: "Example Feature",
  children: [],
} as FolderConfig;
`
    );

    // GET route config
    await fs.writeFile(
      path.join(configDir, "features", "example-feature", "get.ts"),
      `/**
 * Configuration for the Get Example Data endpoint
 */
import { RouteConfig } from "mockoon-config-generator";

/**
 * Example response interface
 */
interface ExampleResponse {
  message: string;
}

export default {
  uuid: "${uuidv4()}",
  type: "http",
  documentation: "Get Example Data",
  method: "get",
  endpoint: "api/example",
  responses: [
    {
      uuid: "${uuidv4()}",
      body: { message: "This is an example response" },
      latency: 0,
      statusCode: 200,
      label: "Success",
      headers: [],
      bodyType: "INLINE",
      filePath: "",
      databucketID: "",
      sendFileAsBody: false,
      rules: [],
      rulesOperator: "OR",
      disableTemplating: false,
      fallbackTo404: false,
      default: true,
      crudKey: "id",
      callbacks: [],
    },
  ],
  responseMode: null,
  streamingMode: null,
  streamingInterval: 0,
} as RouteConfig<ExampleResponse>;
`
    );

    // POST route config
    await fs.writeFile(
      path.join(configDir, "features", "example-feature", "post.ts"),
      `/**
 * Configuration for the Create Example Data endpoint
 */
import { RouteConfig } from "mockoon-config-generator";

/**
 * Create response interface
 */
interface CreateResponse {
  id: string;
  success: boolean;
}

export default {
  uuid: "${uuidv4()}",
  type: "http",
  documentation: "Create Example Data",
  method: "post",
  endpoint: "api/example",
  responses: [
    {
      uuid: "${uuidv4()}",
      body: { id: "{{faker 'string.uuid'}}", success: true },
      latency: 0,
      statusCode: 201,
      label: "Created",
      headers: [],
      bodyType: "INLINE",
      filePath: "",
      databucketID: "",
      sendFileAsBody: false,
      rules: [],
      rulesOperator: "OR",
      disableTemplating: false,
      fallbackTo404: false,
      default: true,
      crudKey: "id",
      callbacks: [],
    },
  ],
  responseMode: null,
  streamingMode: null,
  streamingInterval: 0,
} as RouteConfig<CreateResponse>;
`
    );

    // Databucket config
    await fs.writeFile(
      path.join(configDir, "data", "users.ts"),
      `/**
 * Configuration for the Users databucket
 */
import { DatabucketConfig } from "mockoon-config-generator";

export default {
  uuid: "${uuidv4()}",
  id: "users",
  name: "Users",
  documentation: "",
  value: \`[
    {{#repeat 10}}
    {
      "id": "{{faker 'string.uuid'}}",
      "name": "{{faker 'person.fullName'}}",
      "email": "{{faker 'internet.email'}}",
      "createdAt": "{{faker 'date.recent'}}"
    }
    {{/repeat}}
  ]\`,
} as DatabucketConfig;
`
    );

    // Now run the normal process to generate the config
    console.log("Generating config from example files...");
    const compiledDir = await compileTypeScript(configDir, baseDir);

    await processAndGenerateConfig(compiledDir, outputPath);

    logWithTimestamp(
      "Example Mockoon config generated successfully",
      false,
      outputPath
    );
  } catch (error) {
    handleError(error, "generating example config");
  }
}
