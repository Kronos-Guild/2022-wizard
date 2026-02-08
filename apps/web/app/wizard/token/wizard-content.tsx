"use client";

import { CodePreview } from "@/components/wizard/code-preview";
import { SettingsDrawer } from "@/components/wizard/settings-drawer";
import { SettingsPanel } from "@/components/wizard/settings-panel";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { useWizardState } from "@/components/wizard/use-wizard-state";

export function WizardContent() {
  const {
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
  } = useWizardState();

  const settings = (
    <SettingsPanel
      state={state}
      onNameChange={updateName}
      onSymbolChange={updateSymbol}
      onDecimalsChange={updateDecimals}
      onAuthorityChange={updateAuthority}
      onClusterChange={updateCluster}
      onCloseMintChange={updateCloseMint}
      onNonTransferableChange={updateNonTransferable}
      onTransferFeeChange={updateTransferFee}
      onFeeBpsChange={updateFeeBps}
      onMaxFeeChange={updateMaxFee}
    />
  );

  return (
    <>
      <WizardLayout sidebar={settings} preview={<CodePreview state={state} />} />
      <SettingsDrawer>{settings}</SettingsDrawer>
    </>
  );
}
