#!/usr/bin/env node
/**
 * Command-line interface for the Mockoon config generator
 */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { main } from "./main";

// Export types for package users
export * from "./types";

// Parse command line arguments
yargs(hideBin(process.argv))
  .command(
    "generate [configDir] [outputPath]",
    "Generate Mockoon config",
    (yargs) => {
      return yargs
        .positional("configDir", {
          describe: "Directory containing config files",
          default: "./configs",
          type: "string",
        })
        .positional("outputPath", {
          describe: "Output path for the generated config",
          default: "./configs/config.json",
          type: "string",
        });
    },
    (argv) => {
      main(argv.configDir as string, argv.outputPath as string);
    }
  )
  .command(
    "$0",
    "Default command",
    () => {},
    (argv) => {
      // If no command is specified, run the generate command with default options
      main("./configs", "./configs/config.json");
    }
  )
  .help().argv;
