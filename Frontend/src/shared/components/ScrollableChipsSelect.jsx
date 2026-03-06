/**
 * ScrollableChipsSelect
 * ---------------------
 * Liste d’options en chips dans un conteneur scrollable (évite d’allonger la page).
 * Réutilisable pour langues, matières, etc.
 * @param {string} label - Titre du bloc
 * @param {string} [description] - Texte d’aide sous le titre
 * @param {string[]} options - Liste des options affichées
 * @param {string[]} selected - Valeurs actuellement sélectionnées
 * @param {function(string[]): void} onChange - Callback (nouveau tableau sélectionné)
 * @param {string} [placeholder] - Texte si aucune option (non utilisé si options toujours présentes)
 */

import { motion, AnimatePresence } from "framer-motion";

export function ScrollableChipsSelect({
  label,
  description,
  options = [],
  selected = [],
  onChange,
  placeholder,
  maxHeight = "12rem",
}) {
  const toggle = (option) => {
    const next = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-dark/70 uppercase tracking-wider">
          {label}
        </label>
      )}
      {description && (
        <p className="text-sm text-dark/60 leading-relaxed">{description}</p>
      )}
      <div
        className="border border-black/10 rounded-xl overflow-hidden bg-black/[0.02]"
        style={{ maxHeight }}
      >
        <div className="overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent">
          {options.length === 0 && placeholder ? (
            <p className="text-dark/50 text-sm py-2">{placeholder}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {options.map((option) => {
                  const isSelected = selected.includes(option);
                  return (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => toggle(option)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1
                        ${isSelected
                          ? "bg-primary text-white shadow-sm"
                          : "bg-white border border-black/15 text-dark/80 hover:border-primary/40 hover:bg-primary/5"
                        }
                      `}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
