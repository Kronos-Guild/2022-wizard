/**
 * Extract Templates Script
 * 
 * Reads Rust code from programs/ directory and generates TypeScript
 * template files for the wizard to use.
 * 
 * Usage: pnpm extract-templates
 */

import * as fs from "fs";
import * as path from "path";
import * as toml from "toml";

const PROGRAMS_DIR = path.join(process.cwd(), "..", "programs");
const OUTPUT_DIR = path.join(process.cwd(), "..", "apps", "web", "lib", "codegen", "generated");

interface ExtensionConfig {
  type: string;
  name: string;
  description?: string;
  default?: number | string | boolean;
  min?: number;
  max?: number;
}

interface Extension {
  id: string;
  name: string;
  description: string;
  default: boolean;
  locked?: boolean;
  conflicts_with?: string[];
  files: string[];
  config?: Record<string, ExtensionConfig>;
}

interface ProgramTemplate {
  program: {
    id: string;
    name: string;
    description: string;
    version: string;
  };
  base: {
    files: string[];
  };
  extensions: Record<string, Extension>;
}

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

function generateTypeScriptTemplate(programId: string, template: ProgramTemplate, programDir: string): string {
  const baseFiles: Record<string, string> = {};
  const extensionFiles: Record<string, Record<string, string>> = {};

  // Read base files
  for (const file of template.base.files) {
    const content = readRustFile(programDir, file);
    const fileName = path.basename(file);
    baseFiles[fileName] = escapeForTemplate(content);
  }

  // Read extension files
  for (const [extId, ext] of Object.entries(template.extensions)) {
    extensionFiles[extId] = {};
    for (const file of ext.files) {
      const content = readRustFile(programDir, file);
      const fileName = path.basename(file);
      extensionFiles[extId][fileName] = escapeForTemplate(content);
    }
  }

  // Generate TypeScript
  return `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * 
 * Generated from: programs/${programId}/
 * Run "pnpm extract-templates" to regenerate.
 */

export const programInfo = {
  id: "${template.program.id}",
  name: "${template.program.name}",
  description: "${template.program.description}",
  version: "${template.program.version}",
} as const;

export const baseFiles = {
${Object.entries(baseFiles)
  .map(([name, content]) => `  "${name}": \`${content}\`,`)
  .join("\n")}
} as const;

export const extensions = {
${Object.entries(template.extensions)
  .map(
    ([id, ext]) => `  "${id}": {
    id: "${ext.id}",
    name: "${ext.name}",
    description: "${ext.description}",
    default: ${ext.default},
    locked: ${ext.locked ?? false},
    conflictsWith: ${JSON.stringify(ext.conflicts_with ?? [])},
    config: ${ext.config ? JSON.stringify(ext.config, null, 4).replace(/\n/g, "\n    ") : "undefined"},
    files: {
${Object.entries(extensionFiles[id] ?? {})
  .map(([name, content]) => `      "${name}": \`${content}\`,`)
  .join("\n")}
    },
  },`
  )
  .join("\n")}
} as const;

export type ExtensionId = keyof typeof extensions;
`;
}

function main() {
  console.log("🔮 Extracting templates from programs/...\n");

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Find all program directories
  const programDirs = fs.readdirSync(PROGRAMS_DIR).filter((name) => {
    const dir = path.join(PROGRAMS_DIR, name);
    return fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, "template.toml"));
  });

  if (programDirs.length === 0) {
    console.log("No programs found with template.toml");
    return;
  }

  for (const programId of programDirs) {
    const programDir = path.join(PROGRAMS_DIR, programId);
    console.log(`📦 Processing: ${programId}`);

    try {
      const template = readTemplate(programDir);
      const tsContent = generateTypeScriptTemplate(programId, template, programDir);

      const outputPath = path.join(OUTPUT_DIR, `${programId}.ts`);
      fs.writeFileSync(outputPath, tsContent);
      console.log(`   ✅ Generated: ${outputPath}\n`);
    } catch (error) {
      console.error(`   ❌ Error processing ${programId}:`, error);
    }
  }

  // Generate index file
  const indexContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Run "pnpm extract-templates" to regenerate.
 */

${programDirs.map((id) => `export * as ${id.replace(/-/g, "_")} from "./${id}";`).join("\n")}

export const programIds = ${JSON.stringify(programDirs)} as const;
export type ProgramId = typeof programIds[number];
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), indexContent);
  console.log("📄 Generated index.ts");
  console.log("\n✨ Done!");
}

main();
