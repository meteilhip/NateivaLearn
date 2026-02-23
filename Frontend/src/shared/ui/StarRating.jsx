// src/shared/ui/StarRating.jsx
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/**
 * StarRating
 * Affiche dynamiquement une note avec étoiles pleines, demi-étoiles et vides.
 *
 * Props :
 * - score : nombre flottant (ex: 4.6)
 * - maxStars : nombre total d'étoiles (défaut 5)
 * - size : taille des icônes (défaut 20)
 */
export const StarRating = ({ score, maxStars = 5, size = 20 }) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (score >= i) {
      // étoile pleine
      stars.push(<FaStar key={i} size={size} className="text-yellow-400" />);
    } else if (score + 0.5 >= i) {
      // demi-étoile
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-yellow-400" />);
    } else {
      // étoile vide
      stars.push(<FaRegStar key={i} size={size} className="text-yellow-400" />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};
