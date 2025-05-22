/**
 * Global configuration for the Mockoon environment
 */
export default {
  uuid: "133659f5-634e-4385-bf7c-0279f626d386",
  lastMigration: 35,
  name: "My Super Awesome Mockoon API",
  endpointPrefix: "",
  latency: 0,
  port: 3000,
  hostname: "",
  proxyMode: true,
  proxyHost: "https://api.sandbox-koho.ca",
  proxyRemovePrefix: false,
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
};
