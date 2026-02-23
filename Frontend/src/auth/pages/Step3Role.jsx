// src/auth/pages/Step3Role.jsx
import { motion } from "framer-motion";
import { GiSchoolBag, GiTeacher } from "react-icons/gi";
import { MdSchool } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useTranslation } from "react-i18next";

import { Button } from "../../shared/ui/Button";
import { ROLES } from "../../shared/utils/roles";

/**
 * Étape de choix du rôle
 * ➜ Toujours "Continuer"
 */
export default function Step3Role({ data, setData, onNext, onBack }) {
  const { t } = useTranslation();

  const roles = [
    { id: ROLES.Learner, label: t("signup.roleLearner"), icon: <GiSchoolBag size={32} /> },
    { id: ROLES.Tutor, label: t("signup.roleTutor"), icon: <GiTeacher size={32} /> },
    { id: ROLES.CenterOwner, label: t("signup.roleCenterOwner"), icon: <MdSchool size={32} /> },
  ];

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.chooseRole")}
        <HiOutlineUserGroup className="text-primary" size={32} />
      </h1>

      <p className="text-black/70 text-lg">
        {t("signup.chooseRoleInfo")}
      </p>

      <div className="flex flex-col gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            className={`flex items-center gap-4 p-4 border rounded text-lg transition ${
              data.role === role.id
                ? "border-primary bg-primary/10"
                : "border-black/20"
            }`}
            onClick={() => setData({ ...data, role: role.id })}
          >
            {role.icon}
            {role.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={onBack} variant="outline" className="rounded">
          ← {t("signup.back")}
        </Button>

        <Button onClick={onNext} className="rounded">
          {t("signup.continue")}
        </Button>
      </div>
    </motion.div>
  );
}
