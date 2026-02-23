// src/roles/center_owner/components/TutorManagementList.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TutorRequestCard } from "./TutorRequestCard";

/**
 * Mock data pour les demandes de tuteurs
 */
const MOCK_TUTOR_REQUESTS = [
  {
    id: "tr1",
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    avatar: "/teacher-new.png",
    subjects: ["Mathématiques", "Physique"],
    experience: "5 ans",
  },
  {
    id: "tr2",
    name: "Pierre Dubois",
    email: "pierre.dubois@example.com",
    avatar: "/teacher-new.png",
    subjects: ["Anglais", "Français"],
    experience: "3 ans",
  },
];

const MOCK_TUTOR_MEMBERS = [
  {
    id: "tm1",
    name: "Marie Dupont",
    email: "marie.dupont@example.com",
    avatar: "/teacher-new.png",
    subjects: ["Mathématiques", "Physique"],
    experience: "8 ans",
  },
];

/**
 * TutorManagementList
 * -------------------
 * Liste de gestion des tuteurs pour center_owner.
 * Affiche les demandes en attente et les membres actuels.
 */
export const TutorManagementList = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(MOCK_TUTOR_REQUESTS);
  const [members, setMembers] = useState(MOCK_TUTOR_MEMBERS);

  const handleAccept = (tutorId) => {
    // Simuler l'acceptation
    const tutor = requests.find((t) => t.id === tutorId);
    if (tutor) {
      setRequests(requests.filter((t) => t.id !== tutorId));
      setMembers([...members, tutor]);
      // TODO: Appel API pour accepter
    }
  };

  const handleReject = (tutorId) => {
    // Simuler le refus
    setRequests(requests.filter((t) => t.id !== tutorId));
    // TODO: Appel API pour refuser
  };

  const handleRemove = (tutorId) => {
    // Simuler le retrait
    setMembers(members.filter((t) => t.id !== tutorId));
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
