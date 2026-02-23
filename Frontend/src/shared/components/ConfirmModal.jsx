// src/shared/components/ConfirmModal.jsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { Button } from "../ui/Button";

/**
 * ConfirmModal
 * ------------
 * Modale de confirmation réutilisable (annuler réservation, supprimer, etc.).
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onConfirm: () => void  (appelé au clic sur le bouton de confirmation)
 * - title: string
 * - message: string
 * - confirmLabel: string (ex. "Confirmer", "Annuler la réservation")
 * - cancelLabel: string (ex. "Retour", "Annuler")
 * - variant: "danger" | "primary" (style du bouton confirmer)
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "primary",
}) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-dark">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-dark/50 hover:text-dark p-1"
                aria-label="Fermer"
              >
                <FiX size={20} />
              </button>
            </div>
            {message && <p className="text-dark/70 text-sm mb-6">{message}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="rounded" onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant === "danger" ? "solid" : "primary"}
                className={`rounded ${variant === "danger" ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
