// src/shared/ui/ProfileField.jsx
import { useState } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";

/**
 * ProfileField
 * ------------
 * Une ligne profil : label + valeur ou input.
 * - readOnly : affiche la valeur (non modifiable), pas d’icône d’édition.
 * - editable : affiche l’input avec icône crayon ; dès qu’on tape, icône → coche pour valider.
 */
export const ProfileField = ({
  label,
  value,
  onChange,
  onConfirm,
  readOnly = false,
  type = "text",
  placeholder = "",
  className = "",
  multiline = false,
}) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e) => {
    onChange?.(e.target.value);
    setIsDirty(true);
  };

  const handleConfirm = () => {
    onConfirm?.();
    setIsDirty(false);
  };

  if (readOnly) {
    return (
      <div className={`flex items-center justify-between py-4 border-b border-black/5 ${className}`}>
        <span className="text-dark/60 text-sm font-medium min-w-[140px]">{label}</span>
        <span className="text-dark flex-1 text-right">{value || "—"}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 py-4 border-b border-black/5 ${className}`}>
      <span className="text-dark/60 text-sm font-medium min-w-[140px] shrink-0 pt-1">{label}</span>
      <div className="flex-1 flex items-start gap-3 min-w-0 border-b border-black/10 focus-within:border-primary transition-colors">
        {multiline ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={3}
            className="flex-1 bg-transparent text-dark text-base outline-none py-1 min-w-0 placeholder:text-dark/40 resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-dark text-base outline-none py-1 min-w-0 placeholder:text-dark/40"
          />
        )}
        <button
          type="button"
          onClick={isDirty ? handleConfirm : undefined}
          className={`flex-shrink-0 p-2 rounded-full transition mt-0.5 ${
            isDirty ? "text-primary hover:bg-primary/10" : "text-dark/40 hover:text-dark/70 hover:bg-black/5"
          }`}
          title={isDirty ? "Valider" : "Modifiable"}
          aria-label={isDirty ? "Valider" : "Modifiable"}
        >
          {isDirty ? <FaCheck size={18} /> : <FaPencilAlt size={16} />}
        </button>
      </div>
    </div>
  );
};
