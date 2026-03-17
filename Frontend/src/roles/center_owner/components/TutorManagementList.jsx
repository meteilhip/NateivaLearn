// src/roles/center_owner/components/TutorManagementList.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TutorRequestCard } from "./TutorRequestCard";
import { useActiveOrganization } from "../../../shared/hooks/useActiveOrganization";
import { useOrganizationsStore } from "../../../app/store/organizations.store";

/**
 * TutorManagementList
 * -------------------
 * Liste de gestion des tuteurs pour center_owner.
 * Affiche les demandes en attente et les membres actuels.
 */
export const TutorManagementList = () => {
  const { t } = useTranslation();
  const { activeOrganizationId } = useActiveOrganization();
  const {
    membershipRequests,
    fetchMembershipRequests,
    updateMembershipStatus,
    fetchMembersForOrganization,
    getMembersForOrganization,
  } = useOrganizationsStore();

  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!activeOrganizationId) return;
    fetchMembershipRequests(activeOrganizationId);
    fetchMembersForOrganization(activeOrganizationId).then((result) => {
      const tutors = (result || []).filter((m) => m.role === "tutor");
      setMembers(
        tutors.map((m) => ({
          id: m.id,
          name: m.name ?? m.user?.name ?? "-",
          email: m.email ?? m.user?.email ?? "-",
          avatar: m.avatar ?? "/teacher-new.png",
          subjects: m.subjects ?? [],
          experience: m.experience ?? "-",
        }))
      );
    });
  }, [activeOrganizationId, fetchMembershipRequests, fetchMembersForOrganization]);

  const requests = (membershipRequests || []).filter(
    (r) => r.role === "tutor" && r.status === "pending"
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
            {requests.map((tutor) => (
              <TutorRequestCard
                key={tutor.id}
                tutor={tutor}
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
          {t("centerOwner.currentMembers", "Tuteurs du centre")}
        </h2>
        {members.length === 0 ? (
          <p className="text-dark/60">{t("centerOwner.noTutors", "Aucun tuteur")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((tutor) => (
              <TutorRequestCard
                key={tutor.id}
                tutor={tutor}
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
