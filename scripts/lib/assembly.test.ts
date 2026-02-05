/**
 * Tests for the generated code assembly functions.
 *
 * These tests verify that the assembleLib and assembleInstruction functions
 * correctly inject extension code into base templates.
 */

import { describe, it, expect } from "vitest";
import {
  assembleLib,
  assembleInstruction,
  extensions,
  baseFiles,
} from "../../apps/web/lib/codegen/generated/token-mint";

describe("assembleLib", () => {
  it("returns base lib.rs when no extensions enabled", () => {
    const result = assembleLib([]);

    expect(result).toContain("pub mod token_mint");
    expect(result).toContain("pub mod instructions;");
    expect(result).toContain("pub mod error;");
  });

  it("replaces program name when provided", () => {
    const result = assembleLib([], "my_custom_token");

    expect(result).toContain("pub mod my_custom_token");
    expect(result).not.toContain("pub mod token_mint");
  });

  it("injects metadata module", () => {
    const result = assembleLib(["metadata"]);

    expect(result).toContain("pub mod metadata;");
  });

  it("injects transfer-fee module and instruction", () => {
    const result = assembleLib(["metadata", "transfer-fee"]);

    expect(result).toContain("pub mod transfer_fee;");
    expect(result).toContain("pub fn update_transfer_fee");
    expect(result).toContain("Context<UpdateTransferFee>");
  });

  it("injects close-mint module and instruction", () => {
    const result = assembleLib(["metadata", "close-mint"]);

    expect(result).toContain("pub mod close_mint;");
    expect(result).toContain("pub fn close_mint");
    expect(result).toContain("Context<CloseMint>");
  });

  it("injects non-transferable module", () => {
    const result = assembleLib(["metadata", "non-transferable"]);

    expect(result).toContain("pub mod non_transferable;");
  });

  it("injects multiple extensions in order", () => {
    const result = assembleLib(["metadata", "transfer-fee", "close-mint"]);

    expect(result).toContain("pub mod metadata;");
    expect(result).toContain("pub mod transfer_fee;");
    expect(result).toContain("pub mod close_mint;");
    expect(result).toContain("update_transfer_fee");
    expect(result).toContain("fn close_mint");
  });
});

describe("assembleInstruction", () => {
  it("returns base create_mint when no extensions enabled", () => {
    const result = assembleInstruction("create_mint", []);

    expect(result).toContain("pub fn handler");
    expect(result).toContain("CreateMint");
    expect(result).toContain("Ok(())");
  });

  it("throws for unknown instruction", () => {
    expect(() => assembleInstruction("unknown_instruction", [])).toThrow(
      "Unknown instruction: unknown_instruction"
    );
  });

  it("injects metadata imports and body", () => {
    const result = assembleInstruction("create_mint", ["metadata"]);

    expect(result).toContain("use crate::metadata;");
    expect(result).toContain("metadata::validate_metadata");
  });

  it("injects transfer-fee imports, args, body, and accounts", () => {
    const result = assembleInstruction("create_mint", [
      "metadata",
      "transfer-fee",
    ]);

    // Imports
    expect(result).toContain("use crate::transfer_fee;");

    // Args in function signature
    expect(result).toContain("fee_basis_points: u16");
    expect(result).toContain("max_fee: u64");

    // Args in #[instruction] macro
    expect(result).toMatch(/#\[instruction\([^)]*fee_basis_points/);

    // Accounts
    expect(result).toContain("fee_authority");
  });

  it("injects close-mint imports and accounts", () => {
    const result = assembleInstruction("create_mint", [
      "metadata",
      "close-mint",
    ]);

    expect(result).toContain("use crate::close_mint;");
    expect(result).toContain("close_authority");
  });

  it("injects non-transferable imports", () => {
    const result = assembleInstruction("create_mint", [
      "metadata",
      "non-transferable",
    ]);

    expect(result).toContain("use crate::non_transferable;");
  });

  it("injects multiple extensions correctly", () => {
    const result = assembleInstruction("create_mint", [
      "metadata",
      "transfer-fee",
      "close-mint",
    ]);

    // All imports
    expect(result).toContain("use crate::metadata;");
    expect(result).toContain("use crate::transfer_fee;");
    expect(result).toContain("use crate::close_mint;");

    // Body
    expect(result).toContain("metadata::validate_metadata");

    // All accounts
    expect(result).toContain("fee_authority");
    expect(result).toContain("close_authority");
  });
});

describe("extensions data structure", () => {
  it("has all expected extensions", () => {
    expect(Object.keys(extensions)).toEqual([
      "metadata",
      "transfer-fee",
      "close-mint",
      "non-transferable",
    ]);
  });

  it("metadata is locked (always enabled)", () => {
    expect(extensions.metadata.locked).toBe(true);
    expect(extensions.metadata.default).toBe(true);
  });

  it("transfer-fee and non-transferable conflict with each other", () => {
    expect(extensions["transfer-fee"].conflictsWith).toContain(
      "non-transferable"
    );
    expect(extensions["non-transferable"].conflictsWith).toContain(
      "transfer-fee"
    );
  });

  it("transfer-fee has config fields", () => {
    expect(extensions["transfer-fee"].config).toBeDefined();
    expect(extensions["transfer-fee"].config?.fee_basis_points).toBeDefined();
    expect(extensions["transfer-fee"].config?.max_fee).toBeDefined();
  });

  it("all extensions have inject rules", () => {
    for (const [id, ext] of Object.entries(extensions)) {
      expect(ext.inject, `${id} should have inject`).toBeDefined();
      expect(ext.inject.lib?.modules, `${id} should have lib.modules`).toBeDefined();
    }
  });
});

describe("baseFiles", () => {
  it("has lib.rs", () => {
    expect(baseFiles.lib).toContain("use anchor_lang::prelude::*");
    expect(baseFiles.lib).toContain("#[program]");
  });

  it("has create_mint instruction", () => {
    expect(baseFiles.instructions.create_mint).toContain("pub fn handler");
    expect(baseFiles.instructions.create_mint).toContain("CreateMint");
  });
});
