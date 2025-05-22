# Mockoon Config Generator

A tool to generate Mockoon configuration files from TypeScript files.

## Overview

This tool allows you to define your Mockoon API mock configuration using TypeScript files, which are then compiled and combined into a single Mockoon configuration file. This approach provides several benefits:

- **Type safety**: Define your mock API with TypeScript's type checking and custom interfaces
- **Modularity**: Split your configuration into multiple files for better organization
- **Version control**: Easier to track changes in your mock API configuration
- **Reusability**: Share common configurations across different endpoints
- **Type definitions**: Full TypeScript definitions for all configuration objects

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

If config directory is empty or doesn't exist, it'll automatically generate example

```bash
# Generate config using default paths (./configs -> ./configs/config.json)
mockoon-config-generator

# Or specify custom paths
mockoon-config-generator generate ./my-configs ./output/mockoon-config.json

# Help command to see all available options
mockoon-config-generator --help
```

### Workflow

For the most reliable workflow:

1. Make changes to your TypeScript configuration files
2. Run `npm run generate` to rebuild the config
3. Verify the changes in the generated config.json file

## TypeScript Definitions

The package includes full TypeScript definitions for all configuration objects. You can import these types in your configuration files:

```typescript
// When using the installed npm package
import {
  GlobalConfig,
  FolderConfig,
  RouteConfig,
  ResponseConfig,
  DatabucketConfig,
  // Additional available types
  LogicalOperators,
  BodyTypes,
  Methods,
  RouteType,
  ResponseMode,
  StreamingMode,
  ResponseRule,
  Callback,
  Environments,
} from "mockoon-config-generator";
```

### Available Types

The package provides comprehensive type definitions for Mockoon configuration:

- **Core Configuration Types**

  - `GlobalConfig`: Environment-level settings
  - `FolderConfig`: Folder structure and metadata
  - `RouteConfig`: API endpoint configuration
  - `ResponseConfig`: Response configuration for routes
  - `DatabucketConfig`: Data storage configuration

- **Route and Response Types**

  - `RouteType`: HTTP, CRUD, or WebSocket routes (`"http" | "crud" | "ws"`)
  - `Methods`: Supported HTTP methods (get, post, put, etc.)
  - `BodyTypes`: Response body types (`"INLINE" | "FILE" | "DATABUCKET"`)
  - `ResponseMode`: Response selection modes (`"RANDOM" | "SEQUENTIAL" | "DISABLE_RULES" | "FALLBACK"`)
  - `StreamingMode`: WebSocket streaming modes (`"UNICAST" | "BROADCAST"`)

- **Rules and Headers**

  - `LogicalOperators`: Operators for combining rules (`"AND" | "OR"`)
  - `ResponseRule`: Rule configuration for conditional responses
  - `ResponseRuleOperators`: Available operators for rules (equals, regex, etc.)
  - `ResponseRuleTargets`: Targets for rules (body, query, header, etc.)
  - `HeaderConfig`: HTTP header configuration

- **Additional Types**
  - `Callback`: Configuration for callback requests
  - `TLSOptions`: TLS/HTTPS configuration
  - `Environments`: Collection of environment configurations

### Using Custom Interfaces for Response Bodies

You can specify the type of response body for a route using generics:

```typescript
import { RouteConfig } from "mockoon-config-generator";

// Define your custom interface
interface ProductResponse {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

// Use the interface as a generic type parameter
export default {
  // Route configuration...
  responses: [
    {
      // Response configuration...
      body: {
        id: "prod-123",
        name: "Product Name",
        price: 99.99,
        inStock: true,
      },
    },
  ],
} as RouteConfig<ProductResponse>;
```

This provides type checking for your response bodies and better IDE support.

## Requirements

- Node.js 14 or higher
- TypeScript 4.5 or higher

## License

MIT
