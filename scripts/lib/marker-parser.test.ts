import { describe, it, expect } from "vitest";
import {
  parseMarkerComments,
  parseArgsString,
  groupInjections,
  type ParsedInjection,
} from "./marker-parser";

describe("parseMarkerComments", () => {
  it("parses single-line args marker", () => {
    const content = `
use anchor_lang::prelude::*;

// @wizard:inject.create_mint.args fee_basis_points: u16, max_fee: u64

pub fn init() {}
`;

    const result = parseMarkerComments(content);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      target: "create_mint",
      type: "args",
      content: "fee_basis_points: u16, max_fee: u64",
    });
  });

  it("parses block marker for modules", () => {
    const content = `
// @wizard:inject.lib.modules
pub mod transfer_fee;
// @wizard:end
`;

    const result = parseMarkerComments(content);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      target: "lib",
      type: "modules",
      content: "pub mod transfer_fee;",
    });
  });

  it("parses block marker for body with multiple lines", () => {
    const content = `
// @wizard:inject.create_mint.body
    // Initialize transfer fee extension
    let _fee_config = transfer_fee::init_transfer_fee(fee_basis_points, max_fee)?;
    msg!("Transfer fee initialized");
// @wizard:end
`;

    const result = parseMarkerComments(content);

    expect(result).toHaveLength(1);
    expect(result[0].target).toBe("create_mint");
    expect(result[0].type).toBe("body");
    expect(result[0].content).toContain("Initialize transfer fee extension");
    expect(result[0].content).toContain("init_transfer_fee");
    expect(result[0].content).toContain('msg!("Transfer fee initialized")');
  });

  it("parses multiple markers in one file", () => {
    const content = `
use anchor_lang::prelude::*;

// @wizard:inject.lib.modules
pub mod my_extension;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::my_extension;
// @wizard:end

// @wizard:inject.create_mint.args my_param: u64

// @wizard:inject.create_mint.body
    my_extension::init(my_param)?;
// @wizard:end

// @wizard:inject.create_mint.accounts
    pub my_account: Signer<'info>,
// @wizard:end

pub fn init(param: u64) -> Result<()> {
    Ok(())
}
`;

    const result = parseMarkerComments(content);

    expect(result).toHaveLength(5);
    expect(result.map((r) => r.type)).toEqual([
      "modules",
      "imports",
      "args",
      "body",
      "accounts",
    ]);
  });

  it("handles empty content between markers", () => {
    const content = `
// @wizard:inject.lib.modules
// @wizard:end
`;

    const result = parseMarkerComments(content);

    expect(result).toHaveLength(1);
    expect(result[0].content).toBe("");
  });

  it("ignores content outside markers", () => {
    const content = `
use anchor_lang::prelude::*;

// This is a regular comment, not a marker
pub mod some_module;

// @wizard:inject.lib.modules
pub mod injected_module;
// @wizard:end

// More regular code
pub fn handler() {}
`;

    const result = parseMarkerComments(content);

    expect(result).toHaveLength(1);
    expect(result[0].content).toBe("pub mod injected_module;");
  });

  it("handles markers with extra whitespace", () => {
    const content = `
//   @wizard:inject.lib.modules
pub mod spaced;
//   @wizard:end
`;

    const result = parseMarkerComments(content);

    expect(result).toHaveLength(1);
    expect(result[0].target).toBe("lib");
    expect(result[0].type).toBe("modules");
  });
});

describe("parseArgsString", () => {
  it("parses single arg", () => {
    expect(parseArgsString("fee: u16")).toEqual(["fee: u16"]);
  });

  it("parses multiple args", () => {
    expect(parseArgsString("fee_basis_points: u16, max_fee: u64")).toEqual([
      "fee_basis_points: u16",
      "max_fee: u64",
    ]);
  });

  it("handles extra whitespace", () => {
    expect(parseArgsString("  fee: u16  ,  max: u64  ")).toEqual([
      "fee: u16",
      "max: u64",
    ]);
  });

  it("handles empty string", () => {
    expect(parseArgsString("")).toEqual([]);
  });

  it("handles trailing comma", () => {
    expect(parseArgsString("fee: u16,")).toEqual(["fee: u16"]);
  });
});

describe("groupInjections", () => {
  it("groups lib injections correctly", () => {
    const parsed: ParsedInjection[] = [
      { target: "lib", type: "modules", content: "pub mod foo;" },
      { target: "lib", type: "instructions", content: "pub fn bar() {}" },
    ];

    const result = groupInjections(parsed);

    expect(result.lib).toEqual({
      modules: "pub mod foo;",
      instructions: "pub fn bar() {}",
    });
  });

  it("groups instruction injections correctly", () => {
    const parsed: ParsedInjection[] = [
      { target: "create_mint", type: "imports", content: "use crate::foo;" },
      { target: "create_mint", type: "args", content: "fee: u16, max: u64" },
      { target: "create_mint", type: "body", content: "foo::init()?;" },
      { target: "create_mint", type: "accounts", content: "pub acc: Signer," },
    ];

    const result = groupInjections(parsed);

    expect(result.create_mint).toEqual({
      imports: "use crate::foo;",
      args: ["fee: u16", "max: u64"],
      body: "foo::init()?;",
      accounts: "pub acc: Signer,",
    });
  });

  it("handles multiple instruction targets", () => {
    const parsed: ParsedInjection[] = [
      { target: "create_mint", type: "body", content: "// create_mint code" },
      { target: "transfer", type: "body", content: "// transfer code" },
    ];

    const result = groupInjections(parsed);

    expect(result.create_mint).toEqual({ body: "// create_mint code" });
    expect(result.transfer).toEqual({ body: "// transfer code" });
  });

  it("handles empty input", () => {
    const result = groupInjections([]);
    expect(result).toEqual({});
  });
});
