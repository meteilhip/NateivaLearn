// src/shared/components/CenterDetailsModal.jsx
import { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/Button";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAuthStore } from "../../app/store/auth.store";
import { useOrganizationsStore } from "../../app/store/organizations.store";
import { useNotificationsStore } from "../../app/store/notifications.store";
import { ROLES } from "../utils/roles";
import { CenterTutorsInline } from "./center/CenterTutorsInline";
import { StarRating } from "../ui/StarRating";

/**
 * CenterDetailModal
 * - Fluidité complète
 * - Apparence inchangée
 * - Toggle Classes ↔ Enseignants avec animation
 */
export const CenterDetailModal = ({ center, isOpen, onClose, onJoinCenter }) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { organizations, requestMembership, hasPendingRequest, getMembershipRole, fetchMembershipRequests } = useOrganizationsStore();
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications);
  const [showTeachers, setShowTeachers] = useState(false);
  const [joinRequestSent, setJoinRequestSent] = useState(false);

  const isTutor = user?.role === ROLES.Tutor;
  const isLearner = user?.role === ROLES.Learner;

  // Organisation : par id (centre discover) ou par nom
  const organization = useMemo(() => {
    if (!center) return null;
    if (center.id && organizations?.length) {
      const byId = organizations.find((o) => String(o.id) === String(center.id));
      if (byId) return byId;
    }
    if (organizations?.length) {
      const byName = organizations.find((o) => o.name === center.name);
      if (byName) return byName;
    }
    if (center.id) return { id: center.id, name: center.name };
    return null;
  }, [center, organizations]);
  
  // Vérifier si le tuteur a déjà un centre
  const tutorHasCenter = useMemo(() => {
    if (!isTutor || !user) return false;
    const userId = user.id || user.email;
    return (organizations || []).some((org) => {
      const role = getMembershipRole(userId, org.id);
      return role === "tutor" || role === "owner";
    });
  }, [isTutor, user, organizations, getMembershipRole]);
  
  const { membershipRequests } = useOrganizationsStore();
  const hasPendingRequestForCenter = useMemo(() => {
    if (!user || !organization) return false;
    const userId = user.id || user.email;
    return hasPendingRequest(userId, organization.id);
  }, [user, organization, hasPendingRequest, membershipRequests]);

  const isAlreadyMemberTutor = useMemo(() => {
    if (!isTutor || !user || !organization) return false;
    const userId = user.id || user.email;
    const role = getMembershipRole(userId, organization.id);
    return role === "tutor" || role === "owner";
  }, [isTutor, user, organization, getMembershipRole]);

  const handleJoinCenter = async (role) => {
    if (!organization || !user) return;
    const userId = user.id || user.email;
    const result = await requestMembership({
      userId,
      organizationId: organization.id,
      role: role || (isTutor ? "tutor" : "learner"),
    });
    if (result?.error) {
      toast.error(result.error);
    } else {
      setJoinRequestSent(true);
      fetchNotifications?.();
      toast.success(t("tutor.joinRequestSent", "Demande envoyée. Le centre examinera votre demande."));
      if (onJoinCenter) onJoinCenter(organization);
    }
  };

  // Fermeture ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Bloque scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!center) return null;

  // Variants pour modal globale
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  // Variants pour zone dynamique (Classes ↔ Teachers)
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          />

          {/* Conteneur modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className="bg-white rounded shadow-2xl max-w-4xl w-full md:flex md:gap-6 p-6 relative overflow-y-auto max-h-[90vh] scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
              >
                <FiX size={24} />
              </button>

              {/* Logo / image du centre (logo base64 prioritaire) */}
              <div className="md:w-64 flex-shrink-0">
                <img
                  src={center.logo || center.image || "/placeholder-center.jpg"}
                  alt={center.name}
                  className="w-full h-48 md:h-full object-cover rounded-lg min-h-[12rem]"
                />
              </div>

              {/* Infos */}
              <div className="flex-1 mt-4 md:mt-0">
                <h2 className="text-2xl font-bold text-red-600">
                  {center.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  {/* Affichage du score avec étoiles */}
                  <StarRating score={center.ratings?.score || 0} size={18} />

                  {/* Nombre d'avis */}
                  <span className="text-gray-600 text-sm">
                    ({center.ratings?.reviews || 0} avis)
                  </span>
                </div>
                
                <p className="text-gray-600 mt-2">
                  {[center.address, center.city, center.country].filter(Boolean).join(", ") || "-"}
                </p>

                <p className="text-gray-600 mt-1">
                  <span className="font-medium text-gray-700">{t("center.ownerPhoneLabel", "Téléphone du propriétaire")} : </span>
                  {center.owner?.phone || center.contactPhone || t("center.noPhone", "Non renseigné")}
                </p>

                {/* 🔁 ZONE DYNAMIQUE */}
                <AnimatePresence mode="wait">
                  {!showTeachers ? (
                    <motion.div
                      key="classes"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      className="mt-2"
                    >
                      <h3 className="font-semibold text-red-600">
                        {t("center.classesSubjectsPrices")}
                      </h3>

                      <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto scrollbar-hide bg-gray-50">
                        {center.classes?.map((cls) => (
                          <li
                            key={cls.id}
                            className="text-gray-700 border border-gray-200 p-2 rounded"
                          >
                            <div className="font-medium">{cls.name}</div>

                            <div className="text-sm text-gray-600">
                              {t("center.subjects")} :{" "}
                              {cls.subjects.map((s) => s.name).join(", ")}
                            </div>

                            <div className="text-sm text-gray-800 mt-1">
                              {cls.subjects.map((subject) => (
                                <div
                                  key={subject.id}
                                  className="flex justify-between"
                                >
                                  <span>{subject.name}</span>
                                  <span className="font-semibold">
                                    {cls.pricePerSubject?.[
                                      subject.name
                                    ]?.toLocaleString()}{" "}
                                    {t("center.pricePerHour")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <CenterTutorsInline
                      centerName={center.name}
                      isVisible={showTeachers}
                    />
                  )}
                </AnimatePresence>

                {/* Stats */}
                <div className="mt-2 flex flex-wrap gap-4 text-gray-800">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="font-semibold">
                      {center.learnersCount ?? center.studentsCount ?? "0"}
                    </span>{" "}
                    {t("center.studentsActive")}
                  </div>

                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="font-semibold">
                      {center.tutorsCount ?? center.teachersCount ?? "0"}
                    </span>{" "}
                    {t("center.teachersActive")}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="rounded"
                    onClick={() => setShowTeachers((prev) => !prev)}
                  >
                    {showTeachers
                      ? t("center.backToClasses")
                      : t("center.seeTeachers")}
                  </Button>
                  
                  {/* Bouton "Rejoindre le centre" pour tuteurs */}
                  {isTutor && organization && !tutorHasCenter && !isAlreadyMemberTutor && (
                    <Button
                      variant="primary"
                      className="rounded"
                      onClick={() => handleJoinCenter("tutor")}
                      disabled={hasPendingRequestForCenter || joinRequestSent}
                    >
                      {hasPendingRequestForCenter || joinRequestSent
                        ? t("tutor.requestPending", "Demande en attente")
                        : t("tutor.joinCenter", "Rejoindre le centre")}
                    </Button>
                  )}
                  {/* Bouton "Rejoindre le centre" pour learners */}
                  {isLearner && organization && (
                    <Button
                      variant="primary"
                      className="rounded"
                      onClick={() => handleJoinCenter("learner")}
                      disabled={hasPendingRequestForCenter || joinRequestSent}
                    >
                      {hasPendingRequestForCenter || joinRequestSent
                        ? t("tutor.requestPending", "Demande en attente")
                        : t("center.joinCenter", "Rejoindre ce centre")}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
