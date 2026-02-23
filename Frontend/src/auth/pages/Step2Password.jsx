// src/auth/pages/Step1Password.jsx
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Import des composants réutilisables
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";

/**
 * Step1Password
 * Étape 1 du signup : choix et confirmation du mot de passe
 *
 * Props :
 * - data : objet contenant password et confirmPassword
 * - setData : fonction pour mettre à jour les données
 * - showPassword : bool pour afficher/masquer le mot de passe
 * - setShowPassword : fonction pour toggle showPassword
 * - onNext : callback pour passer à l'étape suivante
 * - onBack : callback pour revenir à l'étape précédente
 */
export default function Step2Password({ data, setData, showPassword, setShowPassword, onNext, onBack }) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Titre avec icône */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.security")}
        <FiLock className="text-primary" size={32} />
      </h1>

      {/* Informations sur le mot de passe */}
      <p className="text-black/70 text-lg">{t("signup.passwordInfo")}</p>

      {/* Input mot de passe avec toggle show/hide */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t("signup.password")}
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          icon={FiLock}
        />
        {/* Bouton pour afficher/masquer le mot de passe */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-3 text-black/50"
        >
          {showPassword ? <FiEyeOff size={24} /> : <FiEye size={24} />}
        </button>
      </div>

      {/* Input confirmation du mot de passe */}
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={t("signup.confirmPassword")}
        value={data.confirmPassword}
        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
        icon={FiLock}
      />

      {/* Boutons de navigation */}
      <div className="flex justify-between mt-6">
        {/* Bouton Retour */}
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded"
        >
          ← {t("signup.back")}
        </Button>

        {/* Bouton Continuer */}
        <Button
          variant="primary"
          onClick={onNext}
          className="rounded"
        >
          {t("signup.continue")}
        </Button>
      </div>
    </motion.div>
  );
}