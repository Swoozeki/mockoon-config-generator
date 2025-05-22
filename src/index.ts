#!/usr/bin/env node
/**
 * Command-line interface for the Mockoon config generator
 */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as path from "path";
import { main } from "./main";

// Export types for package users
export * from "./types";

// Parse command line arguments
yargs(hideBin(process.argv))
  .option("baseDir", {
    alias: "b",
    describe: "Base directory for all files",
    default: "./mockoon-config",
    type: "string",
  })
  .command(
    "$0",
    "Generate Mockoon config",
    () => {},
    (argv) => {
      const baseDir = argv.baseDir as string;
      const configDir = path.join(baseDir, "src");
      const outputPath = path.join(baseDir, "dist", "config.json");

      main(configDir, outputPath, baseDir);
    }
  )
  .help().argv;
