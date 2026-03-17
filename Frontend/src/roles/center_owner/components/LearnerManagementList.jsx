// src/roles/center_owner/components/LearnerManagementList.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LearnerRequestCard } from "./LearnerRequestCard";
import { useActiveOrganization } from "../../../shared/hooks/useActiveOrganization";
import { useOrganizationsStore } from "../../../app/store/organizations.store";

/**
 * LearnerManagementList
 * ----------------------
 * Liste de gestion des apprenants pour center_owner.
 * Affiche les demandes en attente et les membres actuels.
 */
export const LearnerManagementList = () => {
  const { t } = useTranslation();
  const { activeOrganizationId } = useActiveOrganization();
  const {
    membershipRequests,
    fetchMembershipRequests,
    updateMembershipStatus,
    fetchMembersForOrganization,
  } = useOrganizationsStore();

  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!activeOrganizationId) return;
    fetchMembershipRequests(activeOrganizationId);
    fetchMembersForOrganization(activeOrganizationId).then((result) => {
      const learners = (result || []).filter((m) => m.role === "learner");
      setMembers(
        learners.map((m) => ({
          id: m.id,
          name: m.name ?? m.user?.name ?? "-",
          email: m.email ?? m.user?.email ?? "-",
          avatar: m.avatar ?? "/9581121.png",
          level: m.level ?? "-",
          subjects: m.subjects ?? [],
        }))
      );
    });
  }, [activeOrganizationId, fetchMembershipRequests, fetchMembersForOrganization]);

  const requests = (membershipRequests || []).filter(
    (r) => r.role === "learner" && r.status === "pending"
  );

  const handleAccept = (membershipId) => {
    updateMembershipStatus(membershipId, "accepted");
  };

  const handleReject = (membershipId) => {
    updateMembershipStatus(membershipId, "rejected");
  };

  const handleRemove = (membershipId) => {
    updateMembershipStatus(membershipId, "rejected");
  };

  return (
    <div className="space-y-6">
      {/* Demandes en attente */}
      {requests.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-dark mb-4">
            {t("centerOwner.pendingRequests", "Demandes en attente")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((learner) => (
              <LearnerRequestCard
                key={learner.id}
                learner={learner}
                onAccept={handleAccept}
                onReject={handleReject}
                isMember={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Membres actuels */}
      <section>
        <h2 className="text-lg font-semibold text-dark mb-4">
          {t("centerOwner.currentLearners", "Apprenants du centre")}
        </h2>
        {members.length === 0 ? (
          <p className="text-dark/60">{t("centerOwner.noLearners", "Aucun apprenant")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((learner) => (
              <LearnerRequestCard
                key={learner.id}
                learner={learner}
                onRemove={handleRemove}
                isMember={true}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
