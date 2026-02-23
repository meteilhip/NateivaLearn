// src/shared/ui/Input.jsx
import React from "react";

/**
 * Input
 * Composant d'input réutilisable avec icône
 *
 * Props :
 * - type : type de l'input ("text", "email", "password", ...)
 * - placeholder : texte d'indication
 * - value : valeur contrôlée
 * - onChange : fonction pour gérer le changement de valeur
 * - icon : composant icône à afficher à gauche (optionnel)
 * - className : classes supplémentaires
 */
export const Input = ({ type = "text", placeholder, value, onChange, icon: Icon, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 border-b-2 border-black/20 focus-within:border-primary py-3 ${className}`}>
      {Icon && <Icon className="text-black/50" size={24} />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full text-lg outline-none bg-transparent py-2"
      />
    </div>
  );
};
