/**
 * TypeScript definitions for Mockoon configuration
 */

// Logical operators used in rules
export type LogicalOperators = "AND" | "OR";

// Types of bodies that can be used in responses
export type BodyTypes = "INLINE" | "FILE" | "DATABUCKET";

// Types of TLS options
export type TLSOptionsType = "PFX" | "CERT";

// HTTP methods supported
export enum Methods {
  all = "all",
  get = "get",
  post = "post",
  put = "put",
  patch = "patch",
  delete = "delete",
  head = "head",
  options = "options",
  propfind = "propfind",
  proppatch = "proppatch",
  move = "move",
  copy = "copy",
  mkcol = "mkcol",
  lock = "lock",
  unlock = "unlock",
}

// Route types
export type RouteType = "http" | "crud" | "ws";

// Response modes
export type ResponseMode =
  | "RANDOM"
  | "SEQUENTIAL"
  | "DISABLE_RULES"
  | "FALLBACK";

// Streaming modes for WebSocket routes
export type StreamingMode = "UNICAST" | "BROADCAST";

/**
 * Header configuration
 */
export interface HeaderConfig {
  key: string;
  value: string;
}

/**
 * Callback invocation
 */
export interface CallbackInvocation {
  uuid: string;
  latency: number;
}

/**
 * Response rule operators
 */
export type ResponseRuleOperators =
  | "equals"
  | "regex"
  | "regex_i"
  | "null"
  | "empty_array"
  | "array_includes"
  | "valid_json_schema";

/**
 * Response rule targets
 */
export type ResponseRuleTargets =
  | "body"
  | "query"
  | "header"
  | "cookie"
  | "params"
  | "path"
  | "method"
  | "request_number"
  | "global_var"
  | "data_bucket"
  | "templating";

/**
 * Response rule configuration
 */
export interface ResponseRule {
  target: ResponseRuleTargets;
  modifier: string;
  value: string;
  invert: boolean;
  operator: ResponseRuleOperators;
}

/**
 * TLS options configuration
 */
export interface TLSOptions {
  enabled: boolean;
  type: TLSOptionsType;
  pfxPath: string;
  certPath: string;
  keyPath: string;
  caPath: string;
  passphrase: string;
}

/**
 * Response configuration
 */
export interface ResponseConfig<T = any> {
  uuid: string;
  rules: ResponseRule[];
  rulesOperator: LogicalOperators;
  statusCode: number;
  label: string;
  headers: HeaderConfig[];
  body: T;
  latency: number;
  bodyType: BodyTypes;
  filePath: string;
  databucketID: string;
  sendFileAsBody: boolean;
  disableTemplating: boolean;
  fallbackTo404: boolean;
  // default is always true for CRUD routes first response
  default: boolean;
  crudKey?: string;
  callbacks?: CallbackInvocation[];
}

/**
 * Route configuration
 */
export interface RouteConfig<T = any> {
  uuid: string;
  type: RouteType;
  documentation: string;
  method: keyof typeof Methods | "";
  endpoint: string;
  responses: ResponseConfig<T>[];
  responseMode?: ResponseMode | null;
  // used in websocket routes
  streamingMode?: StreamingMode | null;
  streamingInterval?: number;
}

/**
 * Child item in a folder (can be a route or another folder)
 */
export interface FolderChild {
  type: "route" | "folder";
  uuid: string;
}

/**
 * Folder configuration
 */
export interface FolderConfig {
  uuid: string;
  name: string;
  children: FolderChild[];
}

/**
 * Databucket configuration
 */
export interface DatabucketConfig {
  uuid: string;
  id: string;
  name: string;
  documentation: string;
  value: string;
}

/**
 * Callback definition
 */
export interface Callback {
  uuid: string;
  id: string;
  name: string;
  documentation: string;
  method: keyof typeof Methods;
  uri: string;
  headers: HeaderConfig[];
  body?: string;
  filePath?: string;
  sendFileAsBody?: boolean;
  bodyType: BodyTypes;
  databucketID?: string;
}

/**
 * Global configuration for the Mockoon environment
 */
export interface GlobalConfig {
  uuid: string;
  lastMigration: number;
  name: string;
  endpointPrefix: string;
  latency: number;
  port: number;
  hostname: string;
  proxyMode: boolean;
  proxyHost?: string;
  proxyRemovePrefix?: boolean;
  proxyReqHeaders?: HeaderConfig[];
  proxyResHeaders?: HeaderConfig[];
  cors: boolean;
  headers: HeaderConfig[];
  tlsOptions: TLSOptions;
  callbacks?: Callback[];
}

/**
 * Complete Mockoon configuration
 */
export interface MockoonConfig {
  uuid: string;
  lastMigration: number;
  name: string;
  endpointPrefix: string;
  latency: number;
  port: number;
  hostname: string;
  proxyMode: boolean;
  proxyHost?: string;
  proxyRemovePrefix?: boolean;
  proxyReqHeaders?: HeaderConfig[];
  proxyResHeaders?: HeaderConfig[];
  cors: boolean;
  headers: HeaderConfig[];
  tlsOptions: TLSOptions;
  folders: FolderConfig[];
  routes: RouteConfig[];
  data: DatabucketConfig[];
  rootChildren: FolderChild[];
  callbacks?: Callback[];
}

/**
 * Collection of environments
 */
export type Environments = MockoonConfig[];
