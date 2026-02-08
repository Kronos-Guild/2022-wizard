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

  const settingsProps = {
    state,
    onNameChange: updateName,
    onSymbolChange: updateSymbol,
    onDecimalsChange: updateDecimals,
    onAuthorityChange: updateAuthority,
    onClusterChange: updateCluster,
    onCloseMintChange: updateCloseMint,
    onNonTransferableChange: updateNonTransferable,
    onTransferFeeChange: updateTransferFee,
    onFeeBpsChange: updateFeeBps,
    onMaxFeeChange: updateMaxFee,
  } as const;

  return (
    <>
      <WizardLayout
        sidebar={<SettingsPanel {...settingsProps} idPrefix="sidebar" />}
        preview={<CodePreview state={state} />}
      />
      <SettingsDrawer>
        <SettingsPanel {...settingsProps} idPrefix="drawer" />
      </SettingsDrawer>
    </>
  );
}
