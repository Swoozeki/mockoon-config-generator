/**
 * Generate the final Mockoon configuration
 */
import {
  GlobalConfig,
  FolderConfig,
  RouteConfig,
  DatabucketConfig,
  MockoonConfig,
  FolderChild,
} from "../types";

/**
 * Process routes to ensure response bodies are in the correct format
 * @param routes The routes array to process
 * @returns The processed routes array
 */
function processRoutes(routes: RouteConfig[]): RouteConfig[] {
  return routes.map((route) => {
    // Create a deep copy of the route to avoid modifying the original
    const processedRoute = { ...route };

    // Process each response in the route
    if (processedRoute.responses) {
      processedRoute.responses = processedRoute.responses.map((response) => {
        // Create a deep copy of the response
        const processedResponse = { ...response };

        // If the body is an object (not a string), convert it to a JSON string
        if (
          processedResponse.body &&
          typeof processedResponse.body === "object" &&
          processedResponse.bodyType === "INLINE"
        ) {
          processedResponse.body = JSON.stringify(processedResponse.body);
        }

        return processedResponse;
      });
    }

    return processedRoute;
  });
}

/**
 * Combines all processed components into a single Mockoon config
 * @param globalConfig The global configuration object
 * @param folders The folders array
 * @param routes The routes array
 * @param databuckets The databuckets array
 * @returns The final Mockoon configuration
 */
export function generateConfig(
  globalConfig: GlobalConfig,
  folders: FolderConfig[],
  routes: RouteConfig[],
  databuckets: DatabucketConfig[]
): MockoonConfig {
  // Create root children array (references to top-level folders)
  const rootChildren: FolderChild[] = folders.map((folder) => ({
    type: "folder",
    uuid: folder.uuid,
  }));

  // Process routes to ensure response bodies are in the correct format
  const processedRoutes = processRoutes(routes);

  // Combine all components into the final config
  const config = {
    ...globalConfig,
    folders,
    routes: processedRoutes,
    data: databuckets,
    rootChildren,
  };

  return config;
}
