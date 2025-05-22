/**
 * Generate the final Mockoon configuration
 */

/**
 * Combines all processed components into a single Mockoon config
 * @param globalConfig The global configuration object
 * @param folders The folders array
 * @param routes The routes array
 * @param databuckets The databuckets array
 * @returns The final Mockoon configuration
 */
export function generateConfig(
  globalConfig: any,
  folders: any[],
  routes: any[],
  databuckets: any[]
): any {
  // Create root children array (references to top-level folders)
  const rootChildren = folders.map((folder) => ({
    type: "folder",
    uuid: folder.uuid,
  }));

  // Combine all components into the final config
  const config = {
    ...globalConfig,
    folders,
    routes,
    data: databuckets,
    rootChildren,
  };

  return config;
}
