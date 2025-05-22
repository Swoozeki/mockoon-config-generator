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
2. Run one of the above `mockoon-config-generator` command to rebuild the config
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

## Explanation of configuration

This section provides detailed information about all configuration properties used in Mockoon.

<details>
<summary><strong>Environment Properties</strong></summary>

- **uuid**: Unique identifier for the environment
- **lastMigration**: Version number of the last migration applied to this environment
- **name**: Display name of the environment
- **port**: Port number the mock server listens on (default: 3000)
- **hostname**: Hostname the server binds to (empty string means all interfaces)
- **endpointPrefix**: Prefix added to all routes (e.g., "/api/v1")
- **latency**: Global response delay in milliseconds
- **folders**: Array of folders for organizing routes
- **routes**: Array of route definitions
- **rootChildren**: References to routes/folders at the root level
- **proxyMode**: Whether proxy mode is enabled
- **proxyRemovePrefix**: Whether to remove the endpoint prefix when proxying
- **proxyHost**: Target host for proxying requests
- **proxyReqHeaders**: Headers to add to proxied requests
- **proxyResHeaders**: Headers to add to proxied responses
- **tlsOptions**: TLS/HTTPS configuration
- **cors**: Whether CORS is enabled
- **headers**: Global headers added to all responses
- **data**: Array of data buckets
- **callbacks**: Array of callback definitions
</details>

<details>
<summary><strong>TLS Options Properties</strong></summary>

- **enabled**: Whether TLS/HTTPS is enabled
- **type**: Type of TLS configuration ('PFX' or 'CERT')
- **pfxPath**: Path to PFX/PKCS12 file
- **certPath**: Path to certificate file (for 'CERT' type)
- **keyPath**: Path to private key file (for 'CERT' type)
- **caPath**: Path to CA certificate file
- **passphrase**: Password for PFX file or private key
</details>

<details>
<summary><strong>Route Properties</strong></summary>

- **uuid**: Unique identifier for the route
- **type**: Type of route ('http', 'crud', or 'ws')
- **documentation**: Description/notes for the route
- **method**: HTTP method (get, post, put, etc.)
- **endpoint**: URL path pattern for the route
- **responses**: Array of possible responses
- **responseMode**: How to select responses (RANDOM, SEQUENTIAL, etc.)
- **streamingMode**: For WebSocket routes (UNICAST or BROADCAST)
- **streamingInterval**: Interval for streaming responses in milliseconds
</details>

<details>
<summary><strong>RouteResponse Properties</strong></summary>

- **uuid**: Unique identifier for the response
- **rules**: Array of rules to determine when to use this response
- **rulesOperator**: How to combine rules ('AND' or 'OR')
- **statusCode**: HTTP status code
- **label**: Display name for the response
- **headers**: Response-specific headers
- **body**: Response body content
- **latency**: Response-specific delay in milliseconds
- **bodyType**: How to serve the body (INLINE, FILE, or DATABUCKET)
- **filePath**: Path to file (for FILE bodyType)
- **databucketID**: ID of data bucket (for DATABUCKET bodyType)
- **sendFileAsBody**: Whether to send file content as body
- **disableTemplating**: Whether to disable templating for this response
- **fallbackTo404**: Whether to return 404 if rules don't match
- **default**: Whether this is the default response
- **crudKey**: ID field name for CRUD operations
- **callbacks**: Array of callbacks to trigger
</details>

<details>
<summary><strong>ResponseRule Properties</strong></summary>

- **target**: What to check (body, query, header, etc.)
- **modifier**: Path or key to check within the target
- **value**: Value to compare against
- **invert**: Whether to invert the match result
- **operator**: Comparison operator (equals, regex, etc.)
</details>

<details>
<summary><strong>Folder Properties</strong></summary>

- **uuid**: Unique identifier for the folder
- **name**: Display name of the folder
- **children**: Array of references to routes or subfolders
</details>

<details>
<summary><strong>DataBucket Properties</strong></summary>

- **uuid**: Unique identifier for the data bucket
- **id**: Short ID for referencing in templates
- **name**: Display name of the data bucket
- **documentation**: Description/notes for the data bucket
- **value**: Content of the data bucket (usually JSON)
</details>

<details>
<summary><strong>Callback Properties</strong></summary>

- **uuid**: Unique identifier for the callback
- **id**: Short ID for referencing
- **name**: Display name of the callback
- **documentation**: Description/notes for the callback
- **method**: HTTP method to use
- **uri**: URL to call
- **headers**: Headers to send with the callback
- **body**: Body content to send
- **bodyType**: How to serve the body (INLINE, FILE, or DATABUCKET)
- **filePath**: Path to file (for FILE bodyType)
- **databucketID**: ID of data bucket (for DATABUCKET bodyType)
- **sendFileAsBody**: Whether to send file content as body
</details>

## Requirements

- Node.js 14 or higher
- TypeScript 4.5 or higher

## License

MIT
