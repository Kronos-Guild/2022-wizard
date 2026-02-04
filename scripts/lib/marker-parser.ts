/**
 * Marker Comment Parser
 *
 * Parses @wizard marker comments from Rust files to extract injection rules.
 *
 * Marker syntax:
 *   // @wizard:inject.<target>.<type>
 *   ... code to inject ...
 *   // @wizard:end
 *
 * Where:
 *   - target: "lib" or instruction id (e.g., "create_mint")
 *   - type: "modules", "instructions", "imports", "args", "body", "accounts"
 *
 * For args, use comma-separated on single line:
 *   // @wizard:inject.create_mint.args fee_basis_points: u16, max_fee: u64
 */

export interface ParsedInjection {
  target: string; // "lib" or instruction id
  type: string; // "modules", "instructions", "imports", "args", "body", "accounts"
  content: string;
}

/**
 * Parse @wizard marker comments from file content.
 */
export function parseMarkerComments(fileContent: string): ParsedInjection[] {
  const injections: ParsedInjection[] = [];
  const lines = fileContent.split("\n");

  let currentInjection: {
    target: string;
    type: string;
    lines: string[];
  } | null = null;

  for (const line of lines) {
    // Check for args (single line format)
    const argsMatch = line.match(/\/\/\s*@wizard:inject\.(\w+)\.args\s+(.+)$/);
    if (argsMatch) {
      injections.push({
        target: argsMatch[1],
        type: "args",
        content: argsMatch[2].trim(),
      });
      continue;
    }

    // Check for block start
    const startMatch = line.match(/\/\/\s*@wizard:inject\.(\w+)\.(\w+)\s*$/);
    if (startMatch) {
      currentInjection = {
        target: startMatch[1],
        type: startMatch[2],
        lines: [],
      };
      continue;
    }

    // Check for block end
    if (line.match(/\/\/\s*@wizard:end\s*$/)) {
      if (currentInjection) {
        injections.push({
          target: currentInjection.target,
          type: currentInjection.type,
          content: currentInjection.lines.join("\n"),
        });
        currentInjection = null;
      }
      continue;
    }

    // Collect lines inside a block
    if (currentInjection) {
      currentInjection.lines.push(line);
    }
  }

  return injections;
}

/**
 * Parse args string into array.
 * "fee_basis_points: u16, max_fee: u64" -> ["fee_basis_points: u16", "max_fee: u64"]
 */
export function parseArgsString(argsContent: string): string[] {
  return argsContent
    .split(",")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);
}

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

export interface ExtensionInjections {
  lib?: LibInjection;
  [instructionId: string]: LibInjection | InstructionInjection | undefined;
}

/**
 * Group parsed injections by target and type.
 */
export function groupInjections(
  parsed: ParsedInjection[]
): ExtensionInjections {
  const injections: ExtensionInjections = {};

  for (const injection of parsed) {
    const { target, type, content } = injection;

    if (target === "lib") {
      if (!injections.lib) {
        injections.lib = {};
      }
      if (type === "modules" || type === "instructions") {
        injections.lib[type] = content;
      }
    } else {
      // Instruction target
      if (!injections[target]) {
        injections[target] = {};
      }
      const instrInj = injections[target] as InstructionInjection;

      if (type === "args") {
        instrInj.args = parseArgsString(content);
      } else if (
        type === "imports" ||
        type === "body" ||
        type === "accounts"
      ) {
        instrInj[type] = content;
      }
    }
  }

  return injections;
}
