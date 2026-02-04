"use client";

import { useCallback, useMemo } from "react";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { DEFAULTS } from "@/lib/wizard/defaults";
import type { Cluster, MintAuthority, WizardState } from "@/lib/wizard/types";

const HISTORY_OPTIONS = { history: "replace", shallow: true } as const;

export function useWizardState() {
  const [name, setName] = useQueryState(
    "name",
    parseAsString.withDefault(DEFAULTS.name)
  );
  const [symbol, setSymbol] = useQueryState(
    "symbol",
    parseAsString.withDefault(DEFAULTS.symbol)
  );
  const [decimals, setDecimals] = useQueryState(
    "decimals",
    parseAsInteger.withDefault(DEFAULTS.decimals)
  );
  const [authority, setAuthority] = useQueryState(
    "authority",
    parseAsStringEnum<MintAuthority>(["keypair", "pda"]).withDefault(
      DEFAULTS.authority
    )
  );
  const [cluster, setCluster] = useQueryState(
    "cluster",
    parseAsStringEnum<Cluster>(["devnet", "mainnet-beta", "localnet"]).withDefault(
      DEFAULTS.cluster
    )
  );

  const [closeMint, setCloseMint] = useQueryState(
    "closeMint",
    parseAsBoolean.withDefault(DEFAULTS.extensions.closeMint)
  );
  const [nonTransferable, setNonTransferable] = useQueryState(
    "nonTransferable",
    parseAsBoolean.withDefault(DEFAULTS.extensions.nonTransferable)
  );
  const [transferFee, setTransferFee] = useQueryState(
    "transferFee",
    parseAsBoolean.withDefault(DEFAULTS.extensions.transferFee)
  );
  const [feeBps, setFeeBps] = useQueryState(
    "feeBps",
    parseAsInteger.withDefault(DEFAULTS.transferFeeConfig.feeBps)
  );
  const [maxFee, setMaxFee] = useQueryState(
    "maxFee",
    parseAsInteger.withDefault(DEFAULTS.transferFeeConfig.maxFee)
  );
  const state: WizardState = useMemo(
    () => ({
      name,
      symbol,
      decimals,
      authority,
      cluster,
      extensions: {
        metadata: true,
        closeMint,
        nonTransferable,
        transferFee,
      },
      transferFeeConfig: {
        feeBps,
        maxFee,
      },
    }),
    [
      name,
      symbol,
      decimals,
      authority,
      cluster,
      closeMint,
      nonTransferable,
      transferFee,
      feeBps,
      maxFee,
    ]
  );

  const updateName = useCallback(
    (value: string) => setName(value, HISTORY_OPTIONS),
    [setName]
  );
  const updateSymbol = useCallback(
    (value: string) => setSymbol(value, HISTORY_OPTIONS),
    [setSymbol]
  );
  const updateDecimals = useCallback(
    (value: number) => setDecimals(value, HISTORY_OPTIONS),
    [setDecimals]
  );
  const updateAuthority = useCallback(
    (value: MintAuthority) => setAuthority(value, HISTORY_OPTIONS),
    [setAuthority]
  );
  const updateCluster = useCallback(
    (value: Cluster) => setCluster(value, HISTORY_OPTIONS),
    [setCluster]
  );
  const updateCloseMint = useCallback(
    (value: boolean) => setCloseMint(value, HISTORY_OPTIONS),
    [setCloseMint]
  );
  const updateNonTransferable = useCallback(
    (value: boolean) => setNonTransferable(value, HISTORY_OPTIONS),
    [setNonTransferable]
  );
  const updateTransferFee = useCallback(
    (value: boolean) => setTransferFee(value, HISTORY_OPTIONS),
    [setTransferFee]
  );
  const updateFeeBps = useCallback(
    (value: number) => setFeeBps(value, HISTORY_OPTIONS),
    [setFeeBps]
  );
  const updateMaxFee = useCallback(
    (value: number) => setMaxFee(value, HISTORY_OPTIONS),
    [setMaxFee]
  );
  return {
    state,
    updateName,
    updateSymbol,
    updateDecimals,
    updateAuthority,
    updateCluster,
    updateCloseMint,
    updateNonTransferable,
    updateTransferFee,
    updateFeeBps,
    updateMaxFee,
  };
}
