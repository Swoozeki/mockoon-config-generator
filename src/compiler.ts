/**
 * TypeScript compilation utilities
 */
import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs-extra";
import { glob } from "glob";

/**
 * Compiles TypeScript files to JavaScript
 * @param configDir The directory containing the TypeScript files
 * @returns The path to the compiled JavaScript files
 */
export async function compileTypeScript(
  configDir: string,
  baseDir: string
): Promise<string> {
  console.log("Starting TypeScript compilation...");

  // Clean up any previous temporary directory
  const outDir = path.join(baseDir, ".tmp");
  if (fs.existsSync(outDir)) {
    console.log("Cleaning up previous temporary directory...");
    await fs.remove(outDir);
  }

  // Create a fresh temporary output directory
  await fs.ensureDir(outDir);
  console.log(`Created temporary directory: ${outDir}`);

  // Read tsconfig.json if it exists, or use default options
  let compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    esModuleInterop: true,
    outDir: outDir,
    incremental: false, // Disable incremental compilation to force full rebuild
  };

  const tsconfigPath = path.join(configDir, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    console.log(`Found tsconfig.json at ${tsconfigPath}`);
    // Clear require cache to ensure we get the latest version
    delete require.cache[require.resolve(tsconfigPath)];
    const tsconfig = require(tsconfigPath);
    compilerOptions = { ...compilerOptions, ...tsconfig.compilerOptions };
    compilerOptions.outDir = outDir; // Override outDir to use our temp directory
  }

  // Find all TypeScript files
  const tsFiles = await glob(path.join(configDir, "**/*.ts"));
  console.log(`Found ${tsFiles.length} TypeScript files to compile`);

  if (tsFiles.length === 0) {
    throw new Error(`No TypeScript files found in ${configDir}`);
  }

  // Create program
  const program = ts.createProgram(tsFiles, compilerOptions);

  // Emit output
  const emitResult = program.emit();

  // Report any errors
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    console.error("TypeScript compilation errors:");
    allDiagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      if (diagnostic.file) {
        const { line, character } =
          diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
        console.error(
          `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        );
      } else {
        console.error(message);
      }
    });
    throw new Error("TypeScript compilation failed");
  }

  console.log("TypeScript compilation completed successfully");

  // Copy the directory structure to maintain the same paths
  // This ensures that imports between files work correctly
  const configDirBasename = path.basename(configDir);
  const tmpConfigDir = path.join(outDir, configDirBasename);

  // Create the directory if it doesn't exist
  await fs.ensureDir(tmpConfigDir);

  // Copy all compiled JS files to maintain the directory structure
  const jsFiles = await glob(path.join(outDir, "**/*.js"));
  console.log(
    `Copying ${jsFiles.length} compiled JavaScript files to maintain directory structure`
  );

  for (const file of jsFiles) {
    const relativePath = path.relative(outDir, file);
    const targetPath = path.join(tmpConfigDir, relativePath);
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copyFile(file, targetPath);
  }

  console.log(`Compilation output directory: ${tmpConfigDir}`);
  return tmpConfigDir;
}
