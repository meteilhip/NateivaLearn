// src/shared/components/CenterCard.jsx
import { useState } from "react";
import { Button } from "../ui/Button";
import { CenterDetailModal } from "./CenterDetailModal";
import { useTranslation } from "react-i18next";

/**
 * CenterCard
 * - Carte d’un centre de formation
 * - Affiche les infos principales
 * - Ouvre une modale de détails
 */
export const CenterCard = ({ center }) => {
  const { t } = useTranslation(); // Hook i18n
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <article className="bg-white shadow-md rounded overflow-hidden flex flex-col">
        {/* Image du centre */}
        <div className="h-40">
          <img
            src={center.image || "/placeholder-center.jpg"}
            alt={center.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Contenu */}
        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-gray-900 font-semibold">
              {center.name}
            </h4>

            {/* Adresse */}
            <p className="text-sm text-gray-600">
              {center.address}, {center.city}
            </p>
          </div>

          {/* Bouton détails */}
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              className="rounded"
              onClick={() => setShowModal(true)}
            >
              {t("center.seeDetails")}
            </Button>
          </div>
        </div>
      </article>

      {/* Modale de détails */}
      <CenterDetailModal
        center={center}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
