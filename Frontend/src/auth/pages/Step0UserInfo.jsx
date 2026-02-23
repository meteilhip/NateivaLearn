// src/auth/pages/Step0UserInfo.jsx
import { motion } from "framer-motion";
import { FiUser, FiMail } from "react-icons/fi";
import { HiHand } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";

/**
 * Step0UserInfo
 * ----------------
 * Première étape du signup
 * - Nom
 * - Email
 * - Accès à la page de connexion si l'utilisateur a déjà un compte
 *
 * Props :
 * - data : état global du signup
 * - setData : setter du state global
 * - onNext : callback pour passer à l'étape suivante
 */
export default function Step0UserInfo({ data, setData, onNext }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Redirection vers la page de connexion
   */
  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <motion.div
      key="step-0"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Sélecteur de langue */}
      <LanguageSwitcher />

      {/* Titre avec icône animée */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.welcome")}
        <motion.span
          animate={{ rotate: [0, 20, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <HiHand className="text-primary" size={32} />
        </motion.span>
      </h1>

      {/* Texte d'introduction */}
      <p className="text-black/70 text-lg">
        {t("signup.intro")}
      </p>

      {/* Input nom */}
      <Input
        type="text"
        placeholder={t("signup.name")}
        value={data.name}
        onChange={(e) =>
          setData({ ...data, name: e.target.value })
        }
        icon={FiUser}
      />

      {/* Input email */}
      <Input
        type="email"
        placeholder={t("signup.email")}
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
        icon={FiMail}
      />

      {/* Actions bas de step */}
      <div className="flex justify-between items-center pt-4">
         
        <button
          onClick={handleGoToLogin}
          className="text-sm text-black/60 hover:text-primary transition"
        >
            Vous avez déjà un compte ?
          <span className="ml-1 font-semibold text-primary">
            Se connecter
          </span>
        </button>

        {/* Bouton continuer */}
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
