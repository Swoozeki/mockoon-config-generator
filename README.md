# Mockoon Config Generator

A tool to generate Mockoon configuration files from TypeScript files.

## Overview

This tool allows you to define your Mockoon API mock configuration using TypeScript files, which are then compiled and combined into a single Mockoon configuration file. This approach provides several benefits:

- **Type safety**: Define your mock API with TypeScript's type checking
- **Modularity**: Split your configuration into multiple files for better organization
- **Version control**: Easier to track changes in your mock API configuration
- **Reusability**: Share common configurations across different endpoints

## Directory Structure

```
configs/
  global.ts             # Environment-level settings
  features/
    feature-name/       # Each subdirectory becomes a folder in Mockoon
      folder.ts         # (Optional) Configuration for the folder
      endpoint-name.ts  # Each file becomes a route within that folder
  data/
    data-name.ts        # Each file becomes a databucket entry
  config.json           # The final generated file
```

## Installation

```bash
# Install globally
npm install -g mockoon-config-generator

# Or install locally in your project
npm install --save-dev mockoon-config-generator
```

## Usage

```bash
# Generate config using default paths (./configs -> ./configs/config.json)
mockoon-config-generator

# Or specify custom paths
mockoon-config-generator generate ./my-configs ./output/mockoon-config.json

# Help command to see all available options
mockoon-config-generator --help
```

You can also use the npm scripts if you've installed the package locally:

```bash
# Generate config once
npm run generate

# Run with custom paths
npm run generate -- ./my-configs ./output/mockoon-config.json

# Build the TypeScript code
npm run build
```

### Workflow

For the most reliable workflow:

1. Make changes to your TypeScript configuration files
2. Run `npm run generate` to rebuild the config
3. Verify the changes in the generated config.json file

## Configuration Files

### Global Configuration (global.ts)

```typescript
export default {
  uuid: "133659f5-634e-4385-bf7c-0279f626d386", // Required
  name: "My API",
  port: 3001,
  // ... other Mockoon environment settings
};
```

### Folder Configuration (features/feature-name/folder.ts)

```typescript
export default {
  uuid: "184807bf-4acd-4891-bada-4b47a5d8f560", // Required
  name: "Feature Name",
  children: [], // Will be populated automatically
};
```

### Route Configuration (features/feature-name/endpoint-name.ts)

```typescript
export default {
  uuid: "e17b35bc-24b7-4e6e-a4d9-a08278d7bd98", // Required
  type: "http",
  documentation: "Endpoint description",
  method: "get",
  endpoint: "api/endpoint",
  responses: [
    {
      uuid: "5440c285-3482-48a3-b266-32b03ab5f269", // Required
      body: "{}",
      statusCode: 200,
      // ... other response settings
    },
  ],
};
```

### Databucket Configuration (data/data-name.ts)

```typescript
export default {
  uuid: "91062199-b9b6-48a4-80c2-dcf5f6287d80", // Required
  id: "users",
  name: "Users",
  value: `[
    {"id": 1, "name": "User 1"},
    {"id": 2, "name": "User 2"}
  ]`,
};
```

## Requirements

- Node.js 14 or higher
- TypeScript 4.5 or higher

## License

MIT
