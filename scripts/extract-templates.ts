/**
 * Extract Templates Script
 *
 * Reads Rust code from programs/ directory and generates TypeScript
 * template files for the wizard to use.
 *
 * The generated TypeScript includes:
 * - Base file contents
 * - Extension injection rules (what code to inject where)
 * - Extension metadata (conflicts, config fields, etc.)
 *
 * Usage: pnpm extract-templates
 */

import * as fs from "fs";
import * as path from "path";
import * as toml from "toml";
import {
  parseMarkerComments,
  groupInjections,
  type ExtensionInjections,
  type LibInjection,
  type InstructionInjection,
} from "./lib/marker-parser";

const PROGRAMS_DIR = path.join(process.cwd(), "..", "programs");
const OUTPUT_DIR = path.join(
  process.cwd(),
  "..",
  "apps",
  "web",
  "lib",
  "codegen",
  "generated"
);

// =============================================================================
// Validation
// =============================================================================

interface ValidationError {
  field: string;
  message: string;
}

function validateTemplate(
  template: ProgramTemplate,
  programDir: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate program section
  if (!template.program) {
    errors.push({ field: "program", message: "Missing [program] section" });
  } else {
    if (!template.program.id) {
      errors.push({ field: "program.id", message: "Missing program id" });
    }
    if (!template.program.name) {
      errors.push({ field: "program.name", message: "Missing program name" });
    }
    if (!template.program.description) {
      errors.push({
        field: "program.description",
        message: "Missing program description",
      });
    }
    if (!template.program.version) {
      errors.push({
        field: "program.version",
        message: "Missing program version",
      });
    }
  }

  // Validate base section
  if (!template.base) {
    errors.push({ field: "base", message: "Missing [base] section" });
  } else {
    // Check lib file exists
    if (!template.base.lib) {
      errors.push({ field: "base.lib", message: "Missing base.lib" });
    } else {
      const libPath = path.join(programDir, template.base.lib);
      if (!fs.existsSync(libPath)) {
        errors.push({
          field: "base.lib",
          message: `File not found: ${template.base.lib}`,
        });
      }
    }

    // Check instruction files exist
    if (!template.base.instructions || template.base.instructions.length === 0) {
      errors.push({
        field: "base.instructions",
        message: "Missing base.instructions (need at least one)",
      });
    } else {
      const instrIds = new Set<string>();
      for (const instr of template.base.instructions) {
        if (!instr.id) {
          errors.push({
            field: "base.instructions",
            message: "Instruction missing id",
          });
        } else if (instrIds.has(instr.id)) {
          errors.push({
            field: `base.instructions.${instr.id}`,
            message: `Duplicate instruction id: ${instr.id}`,
          });
        } else {
          instrIds.add(instr.id);
        }

        if (!instr.file) {
          errors.push({
            field: `base.instructions.${instr.id}`,
            message: "Instruction missing file",
          });
        } else {
          const instrPath = path.join(programDir, instr.file);
          if (!fs.existsSync(instrPath)) {
            errors.push({
              field: `base.instructions.${instr.id}`,
              message: `File not found: ${instr.file}`,
            });
          }
        }
      }
    }

    // Check other base files exist
    if (template.base.other) {
      for (const file of template.base.other) {
        const filePath = path.join(programDir, file);
        if (!fs.existsSync(filePath)) {
          errors.push({
            field: "base.other",
            message: `File not found: ${file}`,
          });
        }
      }
    }
  }

  // Validate extensions
  if (template.extensions) {
    const extIds = Object.keys(template.extensions);

    for (const [extId, ext] of Object.entries(template.extensions)) {
      const prefix = `extensions.${extId}`;

      if (!ext.name) {
        errors.push({ field: `${prefix}.name`, message: "Missing name" });
      }
      if (!ext.description) {
        errors.push({
          field: `${prefix}.description`,
          message: "Missing description",
        });
      }
      if (ext.default === undefined) {
        errors.push({
          field: `${prefix}.default`,
          message: "Missing default (true/false)",
        });
      }

      // Check extension files exist
      if (!ext.files || ext.files.length === 0) {
        errors.push({
          field: `${prefix}.files`,
          message: "Missing files array",
        });
      } else {
        for (const file of ext.files) {
          const filePath = path.join(programDir, file);
          if (!fs.existsSync(filePath)) {
            errors.push({
              field: `${prefix}.files`,
              message: `File not found: ${file}`,
            });
          }
        }
      }

      // Validate conflicts_with references existing extensions
      if (ext.conflicts_with) {
        for (const conflictId of ext.conflicts_with) {
          if (!extIds.includes(conflictId)) {
            errors.push({
              field: `${prefix}.conflicts_with`,
              message: `Unknown extension: ${conflictId}`,
            });
          }
        }
      }

      // Validate config fields
      if (ext.config) {
        for (const [fieldId, field] of Object.entries(ext.config)) {
          if (!field.type || !["number", "string", "boolean"].includes(field.type)) {
            errors.push({
              field: `${prefix}.config.${fieldId}.type`,
              message: `Invalid type: ${field.type} (must be number, string, or boolean)`,
            });
          }
          if (!field.name) {
            errors.push({
              field: `${prefix}.config.${fieldId}.name`,
              message: "Missing name",
            });
          }
        }
      }

      // Validate inject targets reference existing instructions
      if (ext.inject) {
        const validTargets = ["lib", ...(template.base?.instructions?.map((i) => i.id) ?? [])];
        for (const target of Object.keys(ext.inject)) {
          if (!validTargets.includes(target)) {
            errors.push({
              field: `${prefix}.inject.${target}`,
              message: `Unknown injection target: ${target} (valid: ${validTargets.join(", ")})`,
            });
          }
        }
      }
    }

    // Check conflict symmetry
    for (const [extId, ext] of Object.entries(template.extensions)) {
      if (ext.conflicts_with) {
        for (const conflictId of ext.conflicts_with) {
          const conflictExt = template.extensions[conflictId];
          if (conflictExt && !conflictExt.conflicts_with?.includes(extId)) {
            errors.push({
              field: `extensions.${conflictId}.conflicts_with`,
              message: `Asymmetric conflict: ${extId} conflicts with ${conflictId}, but not vice versa`,
            });
          }
        }
      }
    }
  }

  return errors;
}

// =============================================================================
// Types for the template.toml format
// =============================================================================
// Note: LibInjection, InstructionInjection, ExtensionInjections are imported from marker-parser

interface ConfigField {
  type: string;
  name: string;
  description?: string;
  default?: number | string | boolean;
  min?: number;
  max?: number;
}

interface Extension {
  name: string;
  description: string;
  default: boolean;
  locked?: boolean;
  conflicts_with?: string[];
  files: string[];
  config?: Record<string, ConfigField>;
  inject?: ExtensionInjections;
}

interface InstructionDef {
  id: string;
  file: string;
}

interface ProgramTemplate {
  program: {
    id: string;
    name: string;
    description: string;
    version: string;
  };
  base: {
    lib: string;
    instructions: InstructionDef[];
    other: string[];
  };
  extensions: Record<string, Extension>;
}

// =============================================================================
// File Reading
// =============================================================================

function readTemplate(programDir: string): ProgramTemplate {
  const templatePath = path.join(programDir, "template.toml");
  const content = fs.readFileSync(templatePath, "utf-8");
  return toml.parse(content) as ProgramTemplate;
}

function readRustFile(programDir: string, filePath: string): string {
  const fullPath = path.join(programDir, filePath);
  return fs.readFileSync(fullPath, "utf-8");
}

function escapeForTemplate(content: string): string {
  // Escape backticks and ${} for template literals
  return content.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

// Marker comment parsing is now in ./lib/marker-parser.ts

/**
 * Extract injections from all extension files and merge with template.toml config.
 * Marker comments in Rust files take precedence over template.toml inject sections.
 */
function extractInjectionsFromFiles(
  programDir: string,
  ext: Extension
): ExtensionInjections {
  // Parse all extension files for marker comments
  const allParsed = ext.files.flatMap((file) => {
    const content = readRustFile(programDir, file);
    return parseMarkerComments(content);
  });

  // Group the parsed injections
  const injections = groupInjections(allParsed);

  // Fall back to template.toml inject sections if no markers found
  if (ext.inject) {
    for (const [target, tomlInj] of Object.entries(ext.inject)) {
      if (!tomlInj) continue;

      if (target === "lib") {
        if (!injections.lib) {
          injections.lib = tomlInj as LibInjection;
        } else {
          // Merge: marker comments take precedence
          const libInj = tomlInj as LibInjection;
          if (!injections.lib.modules && libInj.modules) {
            injections.lib.modules = libInj.modules;
          }
          if (!injections.lib.instructions && libInj.instructions) {
            injections.lib.instructions = libInj.instructions;
          }
        }
      } else {
        if (!injections[target]) {
          injections[target] = tomlInj;
        } else {
          // Merge: marker comments take precedence
          const instrInj = injections[target] as InstructionInjection;
          const tomlInstrInj = tomlInj as InstructionInjection;
          if (!instrInj.imports && tomlInstrInj.imports)
            instrInj.imports = tomlInstrInj.imports;
          if (!instrInj.args && tomlInstrInj.args)
            instrInj.args = tomlInstrInj.args;
          if (!instrInj.body && tomlInstrInj.body)
            instrInj.body = tomlInstrInj.body;
          if (!instrInj.accounts && tomlInstrInj.accounts)
            instrInj.accounts = tomlInstrInj.accounts;
        }
      }
    }
  }

  return injections;
}

// =============================================================================
// TypeScript Generation
// =============================================================================

function generateTypeScriptTemplate(
  programId: string,
  template: ProgramTemplate,
  programDir: string
): string {
  // Read base lib.rs
  const libContent = escapeForTemplate(
    readRustFile(programDir, template.base.lib)
  );

  // Read instruction files
  const instructions: Record<string, string> = {};
  for (const instr of template.base.instructions) {
    instructions[instr.id] = escapeForTemplate(
      readRustFile(programDir, instr.file)
    );
  }

  // Read other base files
  const otherFiles: Record<string, string> = {};
  for (const file of template.base.other) {
    const fileName = path.basename(file);
    otherFiles[fileName] = escapeForTemplate(readRustFile(programDir, file));
  }

  // Read extension files and extract injections from marker comments
  const extensionFileContents: Record<string, Record<string, string>> = {};
  const extensionInjections: Record<string, ExtensionInjections> = {};
  
  for (const [extId, ext] of Object.entries(template.extensions)) {
    extensionFileContents[extId] = {};
    for (const file of ext.files) {
      const fileName = path.basename(file);
      extensionFileContents[extId][fileName] = escapeForTemplate(
        readRustFile(programDir, file)
      );
    }
    // Extract injections from marker comments (with fallback to template.toml)
    extensionInjections[extId] = extractInjectionsFromFiles(programDir, ext);
  }

  // Generate TypeScript
  return `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * Generated from: programs/${programId}/
 * Run "pnpm extract-templates" to regenerate.
 *
 * This file contains:
 * - Base file templates
 * - Extension injection rules
 * - Extension metadata
 */

// =============================================================================
// Program Info
// =============================================================================

export const programInfo = {
  id: "${template.program.id}",
  name: "${template.program.name}",
  description: "${template.program.description}",
  version: "${template.program.version}",
} as const;

// =============================================================================
// Base Files (always included)
// =============================================================================

export const baseFiles = {
  lib: \`${libContent}\`,
  instructions: {
${Object.entries(instructions)
  .map(([id, content]) => `    "${id}": \`${content}\`,`)
  .join("\n")}
  },
  other: {
${Object.entries(otherFiles)
  .map(([name, content]) => `    "${name}": \`${content}\`,`)
  .join("\n")}
  },
} as const;

// =============================================================================
// Extension Definitions with Injection Rules
// =============================================================================

export interface LibInjection {
  modules?: string;
  instructions?: string;
}

export interface InstructionInjection {
  imports?: string;
  args?: string[];
  body?: string;
  accounts?: string;
}

export interface Extension {
  name: string;
  description: string;
  default: boolean;
  locked: boolean;
  conflictsWith: string[];
  config?: Record<string, {
    type: string;
    name: string;
    description?: string;
    default?: number | string | boolean;
    min?: number;
    max?: number;
  }>;
  inject: {
    lib?: LibInjection;
    [instructionId: string]: LibInjection | InstructionInjection | undefined;
  };
  files: Record<string, string>;
}

export const extensions: Record<string, Extension> = {
${Object.entries(template.extensions)
  .map(([id, ext]) => {
    const inject = extensionInjections[id] ?? {};
    return `  "${id}": {
    name: "${ext.name}",
    description: "${ext.description}",
    default: ${ext.default},
    locked: ${ext.locked ?? false},
    conflictsWith: ${JSON.stringify(ext.conflicts_with ?? [])},
    config: ${ext.config ? JSON.stringify(ext.config, null, 4).replace(/\n/g, "\n    ") : "undefined"},
    inject: {
      lib: ${
        inject.lib
          ? `{
        modules: ${inject.lib.modules ? `\`${escapeForTemplate(inject.lib.modules)}\`` : "undefined"},
        instructions: ${inject.lib.instructions ? `\`${escapeForTemplate(inject.lib.instructions)}\`` : "undefined"},
      }`
          : "undefined"
      },
${Object.entries(inject)
  .filter(([key]) => key !== "lib")
  .map(([instrId, inj]) => {
    const injection = inj as InstructionInjection;
    return `      "${instrId}": {
        imports: ${injection.imports ? `\`${escapeForTemplate(injection.imports)}\`` : "undefined"},
        args: ${injection.args ? JSON.stringify(injection.args) : "undefined"},
        body: ${injection.body ? `\`${escapeForTemplate(injection.body)}\`` : "undefined"},
        accounts: ${injection.accounts ? `\`${escapeForTemplate(injection.accounts)}\`` : "undefined"},
      },`;
  })
  .join("\n")}
    },
    files: {
${Object.entries(extensionFileContents[id] ?? {})
  .map(([name, content]) => `      "${name}": \`${content}\`,`)
  .join("\n")}
    },
  },`;
  })
  .join("\n")}
};

export type ExtensionId = keyof typeof extensions;

// =============================================================================
// Code Assembly Functions
// =============================================================================

/**
 * Strips all @wizard marker comments from the code.
 * Handles both block markers (// @wizard:inject... // @wizard:end) and inline markers.
 */
function stripMarkerComments(code: string): string {
  // Remove block markers: // @wizard:inject.X.Y ... // @wizard:end
  let result = code.replace(/^[ \\t]*\\/\\/ @wizard:inject\\.[^\\n]*\\n(.*?)^[ \\t]*\\/\\/ @wizard:end\\n?/gms, '');
  // Remove inline markers: // @wizard:inject.X.args ...
  result = result.replace(/^[ \\t]*\\/\\/ @wizard:inject\\.[^\\n]*\\n?/gm, '');
  // Clean up any resulting double blank lines
  result = result.replace(/\\n{3,}/g, '\\n\\n');
  return result;
}

/**
 * Assembles lib.rs with enabled extensions injected.
 * @param enabledExtensions - List of enabled extension IDs
 * @param programName - The program name in snake_case (e.g., "my_token")
 */
export function assembleLib(enabledExtensions: ExtensionId[], programName?: string): string {
  let code: string = baseFiles.lib;

  // Replace program module name if provided
  if (programName) {
    code = code.replace(/pub mod token_mint/, \`pub mod \${programName}\`);
  }

  // Collect all module declarations and instructions to inject
  const modules: string[] = [];
  const instructions: string[] = [];

  for (const extId of enabledExtensions) {
    const ext = extensions[extId];
    if (ext?.inject?.lib) {
      if (ext.inject.lib.modules) {
        modules.push(ext.inject.lib.modules);
      }
      if (ext.inject.lib.instructions) {
        instructions.push(ext.inject.lib.instructions);
      }
    }
  }

  // Inject modules after the last "pub mod" line
  if (modules.length > 0) {
    const moduleLines = modules.join("\\n");
    // Find the last "pub mod" line and inject after it
    code = code.replace(
      /(pub mod error;)/,
      \`$1\\n\\n// Extension modules\\n\${moduleLines}\`
    );
  }

  // Inject instructions before the closing brace of the program module
  if (instructions.length > 0) {
    const instrCode = instructions.join("\\n");
    // Find the create_mint function's closing and add instructions after it
    code = code.replace(
      /(instructions::create_mint::handler\\([^)]+\\)\\s*})/,
      \`$1\\n\${instrCode}\`
    );
  }

  // Strip any remaining marker comments
  code = stripMarkerComments(code);

  return code;
}

/**
 * Assembles an instruction file with enabled extensions injected.
 */
export function assembleInstruction(
  instructionId: string,
  enabledExtensions: ExtensionId[],
  extensionConfigs?: Record<string, Record<string, unknown>>
): string {
  const baseCode = baseFiles.instructions[instructionId as keyof typeof baseFiles.instructions];
  if (!baseCode) {
    throw new Error(\`Unknown instruction: \${instructionId}\`);
  }

  let code: string = baseCode;

  // Collect injections
  const imports: string[] = [];
  const args: string[] = [];
  const bodyParts: string[] = [];
  const accounts: string[] = [];

  for (const extId of enabledExtensions) {
    const ext = extensions[extId];
    const injection = ext?.inject?.[instructionId] as InstructionInjection | undefined;
    if (injection) {
      if (injection.imports) imports.push(injection.imports);
      if (injection.args) args.push(...injection.args);
      if (injection.body) bodyParts.push(injection.body);
      if (injection.accounts) accounts.push(injection.accounts);
    }
  }

  // Inject imports after the last "use" statement
  if (imports.length > 0) {
    const importCode = imports.join("\\n");
    code = code.replace(
      /(use anchor_spl::token_2022::Token2022;)/,
      \`$1\\n\\n// Extension imports\\n\${importCode}\`
    );
  }

  // Inject args into function signature and #[instruction] macro
  if (args.length > 0) {
    const argsStr = args.join(",\\n    ");
    // Add to function signature
    code = code.replace(
      /decimals: u8,\\n\\) -> Result<\\(\\)>/,
      \`decimals: u8,\\n    // Extension arguments\\n    \${argsStr},\\n) -> Result<()>\`
    );
    // Add to #[instruction] macro
    const instrArgs = args.map(a => a.split(":")[0].trim()).join(", ");
    code = code.replace(
      /(#\\[instruction\\([^)]+)(\\)\\])/,
      \`$1, \${instrArgs}$2\`
    );
  }

  // Inject body code before Ok(())
  if (bodyParts.length > 0) {
    const bodyCode = bodyParts.join("\\n\\n");
    code = code.replace(
      /(\\n\\s*Ok\\(\\(\\)\\)\\n})/,
      \`\\n\${bodyCode}\\n\\n    Ok(())\\n}\`
    );
  }

  // Inject accounts before the closing brace of the Accounts struct
  if (accounts.length > 0) {
    const accountsCode = accounts.join("\\n\\n");
    code = code.replace(
      /(pub system_program: Program<'info, System>,\\n})/,
      \`pub system_program: Program<'info, System>,\\n\\n    // Extension accounts\\n\${accountsCode}\\n}\`
    );
  }

  // Strip any remaining marker comments
  code = stripMarkerComments(code);

  return code;
}
`;
}

// =============================================================================
// Main
// =============================================================================

function main() {
  const args = process.argv.slice(2);
  const validateOnly = args.includes("--validate");

  console.log("Extracting templates from programs/...\n");

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Find all program directories
  const programDirs = fs.readdirSync(PROGRAMS_DIR).filter((name) => {
    const dir = path.join(PROGRAMS_DIR, name);
    return (
      fs.statSync(dir).isDirectory() &&
      fs.existsSync(path.join(dir, "template.toml"))
    );
  });

  if (programDirs.length === 0) {
    console.log("No programs found with template.toml");
    return;
  }

  let hasErrors = false;
  const generatedPrograms: string[] = [];

  for (const programId of programDirs) {
    const programDir = path.join(PROGRAMS_DIR, programId);
    console.log(`Processing: ${programId}`);

    try {
      const template = readTemplate(programDir);

      // Validate template
      const errors = validateTemplate(template, programDir);
      if (errors.length > 0) {
        hasErrors = true;
        console.error(`   Validation errors in ${programId}:`);
        for (const err of errors) {
          console.error(`     - [${err.field}] ${err.message}`);
        }
        console.log("");
        continue;
      }

      console.log("   Validation passed");

      if (validateOnly) {
        console.log("");
        continue;
      }

      const tsContent = generateTypeScriptTemplate(
        programId,
        template,
        programDir
      );

      const outputPath = path.join(OUTPUT_DIR, `${programId}.ts`);
      fs.writeFileSync(outputPath, tsContent);
      console.log(`   Generated: ${outputPath}\n`);
      generatedPrograms.push(programId);
    } catch (error) {
      hasErrors = true;
      console.error(`   Error processing ${programId}:`, error);
    }
  }

  if (validateOnly) {
    if (hasErrors) {
      console.log("\nValidation failed!");
      process.exit(1);
    } else {
      console.log("\nAll templates valid!");
      process.exit(0);
    }
  }

  if (generatedPrograms.length === 0) {
    console.error("\nNo templates generated due to errors.");
    process.exit(1);
  }

  // Generate index file
  const indexContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Run "pnpm extract-templates" to regenerate.
 */

${generatedPrograms.map((id) => `export * from "./${id}";`).join("\n")}

export const programIds = ${JSON.stringify(generatedPrograms)} as const;
export type ProgramId = (typeof programIds)[number];
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), indexContent);
  console.log("Generated index.ts");

  if (hasErrors) {
    console.log("\nDone with warnings (some programs had errors).");
    process.exit(1);
  } else {
    console.log("\nDone!");
  }
}

main();
