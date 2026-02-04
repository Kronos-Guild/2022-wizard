"use client";

import { memo, useCallback, type ChangeEvent } from "react";
import { Check } from "lucide-react";
import type { WizardState } from "@/lib/wizard/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsPanelProps {
  state: WizardState;
  onNameChange: (value: string) => void;
  onSymbolChange: (value: string) => void;
  onDecimalsChange: (value: number) => void;
  onAuthorityChange: (value: WizardState["authority"]) => void;
  onClusterChange: (value: WizardState["cluster"]) => void;
  onCloseMintChange: (value: boolean) => void;
  onNonTransferableChange: (value: boolean) => void;
  onTransferFeeChange: (value: boolean) => void;
  onFeeBpsChange: (value: number) => void;
  onMaxFeeChange: (value: number) => void;
}

const SECTION_LABEL =
  "text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium";

export const SettingsPanel = memo(function SettingsPanel({
  state,
  onNameChange,
  onSymbolChange,
  onDecimalsChange,
  onAuthorityChange,
  onClusterChange,
  onCloseMintChange,
  onNonTransferableChange,
  onTransferFeeChange,
  onFeeBpsChange,
  onMaxFeeChange,
}: SettingsPanelProps) {
  const isNonTransferableDisabled = state.extensions.transferFee;
  const isTransferFeeDisabled = state.extensions.nonTransferable;

  // Memoized handlers to avoid creating new functions on each render
  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value),
    [onNameChange]
  );
  const handleSymbolChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onSymbolChange(e.target.value),
    [onSymbolChange]
  );
  const handleDecimalsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onDecimalsChange(Number(e.target.value)),
    [onDecimalsChange]
  );
  const handleFeeBpsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onFeeBpsChange(Number(e.target.value)),
    [onFeeBpsChange]
  );
  const handleMaxFeeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onMaxFeeChange(Number(e.target.value)),
    [onMaxFeeChange]
  );

  return (
    <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto py-6 px-3">
      {/* Token Basics */}
      <div>
        <p className={SECTION_LABEL}>Token Basics</p>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={state.name}
              onChange={handleNameChange}
              placeholder="MyToken"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={state.symbol}
                onChange={handleSymbolChange}
                placeholder="MTK"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="decimals">Decimals</Label>
              <Input
                id="decimals"
                type="number"
                min={0}
                max={9}
                value={state.decimals}
                onChange={handleDecimalsChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mint Authority */}
      <div>
        <p className={SECTION_LABEL}>Mint Authority</p>
        <RadioGroup
          value={state.authority}
          onValueChange={(value) =>
            onAuthorityChange(value as WizardState["authority"])
          }
          className="mt-3"
        >
          <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2.5">
            <RadioGroupItem value="keypair" id="keypair" />
            <Label htmlFor="keypair" className="flex-1 cursor-pointer font-normal">
              Keypair
            </Label>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2.5">
            <RadioGroupItem value="pda" id="pda" />
            <Label htmlFor="pda" className="flex-1 cursor-pointer font-normal">
              PDA (Program-controlled)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Cluster */}
      <div>
        <p className={SECTION_LABEL}>Cluster</p>
        <RadioGroup
          value={state.cluster}
          onValueChange={(value) =>
            onClusterChange(value as WizardState["cluster"])
          }
          className="mt-3"
        >
          <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2.5">
            <RadioGroupItem value="devnet" id="devnet" />
            <Label htmlFor="devnet" className="flex-1 cursor-pointer font-normal">
              Devnet
            </Label>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2.5">
            <RadioGroupItem value="mainnet-beta" id="mainnet-beta" />
            <Label htmlFor="mainnet-beta" className="flex-1 cursor-pointer font-normal">
              Mainnet Beta
            </Label>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2.5">
            <RadioGroupItem value="localnet" id="localnet" />
            <Label htmlFor="localnet" className="flex-1 cursor-pointer font-normal">
              Localnet
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Extensions */}
      <div>
        <p className={SECTION_LABEL}>Extensions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ExtensionPill label="Metadata" active disabled hint="Required" />
          <ExtensionPill
            label="Close Mint"
            active={state.extensions.closeMint}
            onToggle={() => onCloseMintChange(!state.extensions.closeMint)}
          />
          <ExtensionPill
            label="Non-Transferable"
            active={state.extensions.nonTransferable}
            disabled={isNonTransferableDisabled}
            hint={
              isNonTransferableDisabled
                ? "Disable Transfer Fee first"
                : undefined
            }
            onToggle={() =>
              onNonTransferableChange(!state.extensions.nonTransferable)
            }
          />
          <ExtensionPill
            label="Transfer Fee"
            active={state.extensions.transferFee}
            disabled={isTransferFeeDisabled}
            hint={
              isTransferFeeDisabled
                ? "Non-transferable tokens cannot charge fees"
                : undefined
            }
            onToggle={() => onTransferFeeChange(!state.extensions.transferFee)}
          />
          {/* Coming Soon Extensions */}
          <ExtensionPill label="Freeze Authority" soon />
          <ExtensionPill label="Permanent Delegate" soon />
          <ExtensionPill label="Interest Bearing" soon />
        </div>

        {/* Transfer Fee Config */}
        <div
          className="grid transition-[grid-template-rows] duration-200 ease-out"
          style={{
            gridTemplateRows: state.extensions.transferFee ? "1fr" : "0fr",
          }}
        >
          <div className="overflow-hidden">
            <div className="pt-4">
              <div className="grid gap-4 rounded-lg border border-input bg-muted/30 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="feeBps">Fee (Basis Points)</Label>
                  <Input
                    id="feeBps"
                    type="number"
                    min={0}
                    max={10000}
                    value={state.transferFeeConfig.feeBps}
                    onChange={handleFeeBpsChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(state.transferFeeConfig.feeBps / 100).toFixed(2)}% fee
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxFee">Max Fee (tokens)</Label>
                  <Input
                    id="maxFee"
                    type="number"
                    min={0}
                    value={state.transferFeeConfig.maxFee}
                    onChange={handleMaxFeeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
});

interface ExtensionPillProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  hint?: string;
  soon?: boolean;
  onToggle?: () => void;
}

const ExtensionPill = memo(function ExtensionPill({
  label,
  active = false,
  disabled = false,
  hint,
  soon = false,
  onToggle,
}: ExtensionPillProps) {
  const isTrulyDisabled = disabled || soon;

  const pill = (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={isTrulyDisabled ? undefined : onToggle}
      disabled={disabled && !active && !soon}
      className={cn(
        "h-8 rounded-full gap-1.5 transition-all",
        active && "bg-brand text-brand-foreground hover:bg-brand/90",
        soon && "!opacity-50 !cursor-not-allowed !pointer-events-auto",
        disabled && !active && !soon && "opacity-50"
      )}
    >
      {active && <Check className="size-3" />}
      <span>{label}</span>
      {soon && (
        <span className="ml-1 rounded bg-foreground/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-foreground/50">
          Soon
        </span>
      )}
    </Button>
  );

  if (hint && disabled && !soon) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{pill}</TooltipTrigger>
        <TooltipContent>{hint}</TooltipContent>
      </Tooltip>
    );
  }

  return pill;
});
