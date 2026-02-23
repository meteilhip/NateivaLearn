// src/roles/center_owner/components/LearnerManagementList.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LearnerRequestCard } from "./LearnerRequestCard";

/**
 * Mock data pour les demandes d'apprenants
 */
const MOCK_LEARNER_REQUESTS = [
  {
    id: "lr1",
    name: "Alice Martin",
    email: "alice.martin@example.com",
    avatar: "/placeholder-avatar.png",
    level: "Intermédiaire",
    subjects: ["Mathématiques", "Français"],
  },
  {
    id: "lr2",
    name: "Bob Dupont",
    email: "bob.dupont@example.com",
    avatar: "/placeholder-avatar.png",
    level: "Débutant",
    subjects: ["Anglais"],
  },
];

const MOCK_LEARNER_MEMBERS = [
  {
    id: "lm1",
    name: "Claire Bernard",
    email: "claire.bernard@example.com",
    avatar: "/placeholder-avatar.png",
    level: "Avancé",
    subjects: ["Mathématiques", "Physique"],
  },
];

/**
 * LearnerManagementList
 * ----------------------
 * Liste de gestion des apprenants pour center_owner.
 * Affiche les demandes en attente et les membres actuels.
 */
export const LearnerManagementList = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(MOCK_LEARNER_REQUESTS);
  const [members, setMembers] = useState(MOCK_LEARNER_MEMBERS);

  const handleAccept = (learnerId) => {
    // Simuler l'acceptation
    const learner = requests.find((l) => l.id === learnerId);
    if (learner) {
      setRequests(requests.filter((l) => l.id !== learnerId));
      setMembers([...members, learner]);
      // TODO: Appel API pour accepter
    }
  };

  const handleReject = (learnerId) => {
    // Simuler le refus
    setRequests(requests.filter((l) => l.id !== learnerId));
    // TODO: Appel API pour refuser
  };

  const handleRemove = (learnerId) => {
    // Simuler le retrait
    setMembers(members.filter((l) => l.id !== learnerId));
    // TODO: Appel API pour retirer
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
