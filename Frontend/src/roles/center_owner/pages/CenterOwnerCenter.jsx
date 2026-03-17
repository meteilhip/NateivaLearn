import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useActiveOrganization } from "../../../shared/hooks/useActiveOrganization";
import { useOrganizationsStore } from "../../../app/store/organizations.store";
import { CenterOwnerTutorsManagement } from "./CenterOwnerTutorsManagement";
import { CenterOwnerLearnersManagement } from "./CenterOwnerLearnersManagement";

export const CenterOwnerCenter = () => {
  const { t } = useTranslation();
  const { activeOrganization, activeOrganizationId } = useActiveOrganization();
  const fetchOrganizations = useOrganizationsStore((s) => s.fetchOrganizations);

  useEffect(() => {
    fetchOrganizations?.();
  }, [fetchOrganizations]);

  if (!activeOrganizationId || !activeOrganization) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-dark">{t("centerOwner.myCenter", "Mon centre")}</h1>
        <p className="text-dark/60">{t("center_owner.noActiveOrganization", "Aucun centre actif.")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">{t("centerOwner.myCenter", "Mon centre")}</h1>
        <p className="text-sm text-dark/60 mt-1">
          {t("centerOwner.myCenterSubtitle")}
        </p>
      </div>

      {/* Carte résumé centre */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 space-y-2"
      >
        <h2 className="text-lg font-semibold text-dark">{activeOrganization.name}</h2>
        {(activeOrganization.city || activeOrganization.country) && (
          <p className="text-sm text-dark/60">
            {[activeOrganization.city, activeOrganization.country].filter(Boolean).join(", ")}
          </p>
        )}
        {activeOrganization.description && (
          <p className="text-sm text-dark/70 mt-2">{activeOrganization.description}</p>
        )}
      </motion.div>

      {/* Gestion tuteurs + apprenants du centre */}
      <CenterOwnerTutorsManagement />
      <CenterOwnerLearnersManagement />
    </div>
  );
};

