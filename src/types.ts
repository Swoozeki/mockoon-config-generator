/**
 * TypeScript definitions for Mockoon configuration
 */

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
  cors: boolean;
  headers: HeaderConfig[];
  tlsOptions: TLSOptions;
}

/**
 * Header configuration
 */
export interface HeaderConfig {
  key: string;
  value: string;
}

/**
 * TLS options configuration
 */
export interface TLSOptions {
  enabled: boolean;
  type: "CERT" | "PFX";
  pfxPath: string;
  certPath: string;
  keyPath: string;
  caPath: string;
  passphrase: string;
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
 * Child item in a folder (can be a route or another folder)
 */
export interface FolderChild {
  type: "route" | "folder";
  uuid: string;
}

/**
 * Response rule configuration
 */
export interface ResponseRule {
  target: string;
  modifier: string;
  value: string;
  invert: boolean;
  operator: "equals" | "regex" | "null" | "empty_array" | "not_empty";
}

/**
 * Response configuration
 */
export interface ResponseConfig<T = any> {
  uuid: string;
  body: T;
  latency: number;
  statusCode: number;
  label: string;
  headers: HeaderConfig[];
  bodyType: "INLINE" | "FILE" | "DATABUCKET";
  filePath: string;
  databucketID: string;
  sendFileAsBody: boolean;
  rules: ResponseRule[];
  rulesOperator: "OR" | "AND";
  disableTemplating: boolean;
  fallbackTo404: boolean;
  default: boolean;
}

/**
 * Route configuration
 */
export interface RouteConfig<T = any> {
  uuid: string;
  type: "http";
  documentation: string;
  method: "get" | "post" | "put" | "delete" | "patch" | "head" | "options";
  endpoint: string;
  responses: ResponseConfig<T>[];
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
  cors: boolean;
  headers: HeaderConfig[];
  tlsOptions: TLSOptions;
  folders: FolderConfig[];
  routes: RouteConfig[];
  data: DatabucketConfig[];
  rootChildren: FolderChild[];
}
