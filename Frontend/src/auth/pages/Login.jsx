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

  /** État du formulaire */
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /** Affichage / masquage du mot de passe */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Soumission de la connexion
   */
  const handleSubmit = () => {
    if (!form.email || !form.password) {
      return toast.error("Veuillez remplir tous les champs");
    }

    const result = login(form);

    if (result?.error) {
      return toast.error(result.error);
    }

    toast.success("Connexion réussie");

    // Récupération de l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // Redirection selon le rôle (learner, tutor, center_owner). Compat anciens rôles "student"/"teacher"
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
        placeholder="Votre adresse email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        icon={FiMail}
      />

      {/* Mot de passe avec œil */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Votre mot de passe"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          icon={FiLock}
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
          Pas encore de compte ?
          <span className="ml-1 font-semibold text-primary">
            Créer un compte
          </span>
        </button>

        {/* Bouton principal */}
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="rounded"
        >
          Se connecter
        </Button>
      </div>
    </motion.div>
  );
}
