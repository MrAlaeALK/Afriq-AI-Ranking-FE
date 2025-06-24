// hooks/useConfirmDialog.js or .tsx
import { useState } from "react";

export const useConfirmDialog = () => {
  const [confirmDialogData, setConfirmDialogData] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: "Confirmer",
    cancelText: "Annuler",
    confirmVariant: "destructive",
    error: null,
    setError: null
  });

  const openConfirmDialog = ({
    title,
    description,
    onConfirm,
    onCancel = () => {},
    confirmText = "Confirmer",
    cancelText = "Annuler",
    confirmVariant = "destructive",
    error,
    setError,
  }) => {
    setConfirmDialogData({
      open: true,
      title,
      description,
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
      confirmVariant,
      error,
      setError
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialogData((prev) => ({ ...prev, open: false, error: null }));
  };

  return {
    confirmDialogData,
    openConfirmDialog,
    closeConfirmDialog,
  };
};
