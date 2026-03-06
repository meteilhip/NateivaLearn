// src/auth/pages/Login.jsx
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { HiHand } from "react-icons/hi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";
import { useAuthStore } from "../../app/store/auth.store";
import { ROLES } from "../../shared/utils/roles";
import { useTranslation } from "react-i18next";

/**
 * Login
 * -----
 * Expérience de connexion fluide, inspirée des steps de signup
 * - Animation latérale
 * - Texte contextuel (pas un simple formulaire)
 * - Mot de passe avec affichage / masquage
 * - CTA vers la création de compte
 */
export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { t } = useTranslation();

  /** État du formulaire */
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /** Affichage / masquage du mot de passe */
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed);
  };

  /**
   * Soumission de la connexion (clic ou touche Entrée)
   */
  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      return toast.error(t("login.errorEmpty"));
    }
    if (!isValidEmail(form.email)) {
      return toast.error(t("login.errorEmailInvalid"));
    }

    const result = await login(form);

    if (result?.error) {
      // Si le backend renvoie une erreur de validation 422 (mauvais identifiants),
      // on remplace le message générique par un message clair côté UI.
      const message =
        (result.errors && (result.errors.email || result.errors.password)) ?
          t("login.errorCredentials") :
          result.error || t("login.errorCredentials");
      return toast.error(message);
    }

    toast.success(t("login.success"));
    const user = useAuthStore.getState().user;
    setTimeout(() => {
      const role = user?.role;
      if (role === ROLES.Learner || role === "student") {
        navigate("/learner/dashboard");
      } else if (role === ROLES.Tutor || role === "teacher") {
        navigate("/tutor/dashboard");
      } else if (role === ROLES.CenterOwner || role === "center_owner" || role === "CENTER") {
        navigate("/center_owner/dashboard");
      } else {
        navigate("/");
      }
    }, 300);
  };

  /**
   * Redirection vers le signup
   */
  const handleGoToSignup = () => {
    navigate("/signup");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      key="login-step"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 w-full max-w-4xl mx-auto p-8 min-h-screen flex flex-col"
    >
      <ToastContainer position="top-right" />

      {/* Titre principal */}
    <h1 className="text-3xl font-bold flex items-center gap-3">
        Bon retour
        <motion.span
        animate={{ rotate: [0, 20, -20, 20, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        >
        <HiHand className="text-primary" size={32} />
        </motion.span>
    </h1>

      {/* Texte d’introduction */}
      <p className="text-black/70 text-lg">
        Connectez-vous pour reprendre là où vous vous êtes arrêté.
      </p>

      {/* Email */}
      <Input
        type="email"
        placeholder={t("login.emailPlaceholder")}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        icon={FiMail}
        onKeyDown={handleKeyDown}
      />

      {/* Mot de passe avec œil */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t("login.passwordPlaceholder")}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          icon={FiLock}
          onKeyDown={handleKeyDown}
        />

        {/* Bouton afficher / masquer */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-3 text-black/50 hover:text-black"
        >
          {showPassword ? (
            <FiEyeOff size={22} />
          ) : (
            <FiEye size={22} />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        {/* CTA secondaire */}
        <button
          onClick={handleGoToSignup}
          className="text-sm text-black/60 hover:text-primary transition"
        >
          {t("login.noAccountQuestion")}
          <span className="ml-1 font-semibold text-primary">
            {t("login.createAccountCta")}
          </span>
        </button>

        {/* Bouton principal */}
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="rounded"
        >
          {t("login.submit")}
        </Button>
      </div>
    </motion.div>
  );
}
