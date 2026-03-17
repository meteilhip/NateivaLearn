// src/auth/pages/SignupMultiStep.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/store/auth.store";
import { authService } from "../../services";

// ==================== STEPS COMMUNS ====================
import Step0UserInfo from "./Step0UserInfo";
import Step1CityAndNumber from "./Step1CityAndNumber";
import Step2Password from "./Step2Password";
import Step3Role from "./Step3Role";

// ==================== STUDENT ====================
import Step4Level from "./Step4Level";
import Step5Subjects from "./Step5Subjects";
import Step6Centers from "./Step6Centers";
import Step7Subscription from "./Step7Subscription";

// ==================== TUTOR ====================
import StepTutorSubjects from "./tutor/StepTutorSubjects";
import StepTutorLanguages from "./tutor/StepTutorLanguages";
import StepTutorVideo from "./tutor/StepTutorVideo";
import StepTutorCenters from "./tutor/StepTutorCenters";

// ==================== CENTER_OWNER ====================
import Step4CenterSetup from "./Step4CenterSetup";

// ==================== ROLES ====================
import { ROLES } from "../../shared/utils/roles";
import { useOrganizationsStore } from "../../app/store/organizations.store";

export default function SignupMultiStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const createOrganization = useOrganizationsStore((s) => s.createOrganization);

  /** Step courant */
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  /** Données globales du signup */
  const [data, setData] = useState({
    // -------- COMMUN --------
    name: "",
    email: "",
    city: "",
    country: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",

    // -------- STUDENT --------
    level: "",
    subjects: [],
    center: null,
    subscription: null,

    // -------- TUTOR --------
    tutorSubjects: [],
    tutorLanguages: [],
    tutorVideo: null,
    tutorCenter: null,

    // -------- CENTER_OWNER --------
    centerName: "",
    centerDescription: "",
    centerLogo: null,
    centerCity: "",
    centerCountry: "",
    centerLanguages: [],
    centerRequiredLanguages: [],
    centerSubjects: [],
    ownerLanguages: [],
  });

  /**
   * Bouton "Continuer"
   * -------------------
   * Valide UNIQUEMENT les étapes bloquantes
   */
  const handleNext = async () => {
    // Étape 0 : infos utilisateur + validation email (format + disponibilité)
    if (step === 0) {
      if (!data.name || !data.email) {
        return toast.error(t("signup.errorEmpty"));
      }
      const email = data.email.trim().toLowerCase();
      // Validation simple du format email côté frontend
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return toast.error(t("signup.errorEmailInvalid"));
      }
      try {
        await authService.checkEmail(email);
      } catch (err) {
        const backendMessage = err?.data?.errors?.email?.[0] || err?.data?.message;
        toast.error(backendMessage || t("signup.errorEmailTaken"));
        return;
      }
    }

    // Étape 1 : localisation (ville, pays) + téléphone
    if (step === 1 && (!data.city || !data.country || !data.phone)) {
      return toast.error(t("signup.errorEmpty"));
    }

    // Étape 2 : mot de passe
    if (step === 2) {
      if (!data.password || !data.confirmPassword) {
        return toast.error(t("signup.errorEmpty"));
      }
      if (data.password !== data.confirmPassword) {
        return toast.error(t("signup.errorPassword"));
      }
      if (data.password.length < 8) {
        return toast.error(t("signup.errorPasswordWeak"));
      }
    }

    // Étape 3 : rôle
    if (step === 3 && !data.role) {
      return toast.error(t("signup.errorRole"));
    }

    /* ===================== LEARNER ===================== */
    if (data.role === ROLES.Learner) {
      if (step === 4 && !data.level) {
        return toast.error(t("signup.errorLevel"));
      }
      if (step === 5 && !data.subjects.length) {
        return toast.error(t("signup.errorSubject"));
      }
      if (step === 6 && !data.center) {
        return toast.error(t("signup.errorCenter"));
      }
      if (step === 7 && !data.subscription) {
        return toast.error(t("signup.errorSubscription"));
      }
    }

    /* ===================== TUTOR ===================== */
    if (data.role === ROLES.Tutor) {
      if (step === 4 && !data.teacherSubjects.length) {
        return toast.error(t("signup.errorSubject"));
      }
      if (step === 5 && !data.teacherLanguages.length) {
        return toast.error(t("signup.errorLanguage"));
      }
      if (step === 6 && !data.teacherVideo) {
        return toast.error(t("signup.errorVideo"));
      }
      // ⚠️ PAS de validation sur teacherCenter (OPTIONNEL)
    }

    setStep((prev) => prev + 1);
  };

  /** Retour étape précédente */
  const handleBack = () => setStep((prev) => prev - 1);

  /**
   * Soumission finale (learner / tutor).
   * On ne redirige que si l'inscription a réussi.
   */
  const handleSubmit = async () => {
    const result = await register(data);
    if (result?.error) {
      // Toast global
      toast.error(result.error);
      // Toasts détaillés par champ si disponibles (422 validation)
      if (result.errors) {
        Object.values(result.errors).forEach((messages) => {
          if (Array.isArray(messages) && messages[0]) {
            toast.error(messages[0]);
          }
        });
      }
      return;
    }
    toast.success(t("signup.success"));
    setTimeout(() => {
      const targetUser = useAuthStore.getState().user;
      const role = targetUser?.role ?? data.role;
      switch (role) {
        case ROLES.Learner:
          navigate("/learner/dashboard", { replace: true });
          break;
        case ROLES.Tutor:
          navigate("/tutor/dashboard", { replace: true });
          break;
        case ROLES.CenterOwner:
          navigate("/center_owner/dashboard", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    }, 300);
  };

  /**
   * Soumission center_owner : créer Organisation + Membership(owner), puis register user avec organizationIds.
   * centerData passé par Step4CenterSetup pour éviter state asynchrone.
   */
  const handleSubmitCenterOwner = async (centerData = {}) => {
    const userData = {
      ...data,
      role: ROLES.CenterOwner || "center_owner",
    };
    const result = await register(userData);
    if (result?.error) {
      toast.error(result.error);
      if (result.errors) {
        Object.values(result.errors).forEach((messages) => {
          if (Array.isArray(messages) && messages[0]) {
            toast.error(messages[0]);
          }
        });
      }
      return;
    }
    const orgResult = await createOrganization({
      name: centerData.centerName || data.centerName,
      description: centerData.centerDescription ?? data.centerDescription,
      logo: centerData.centerLogo ?? data.centerLogo,
      city: centerData.centerCity ?? data.centerCity,
      country: centerData.centerCountry ?? data.centerCountry,
      languages: centerData.centerRequiredLanguages ?? data.centerRequiredLanguages ?? data.centerLanguages ?? [],
      subjects: centerData.centerSubjects ?? data.centerSubjects ?? [],
      ownerId: useAuthStore.getState().user?.id,
    });
    if (orgResult?.error) {
      toast.error(orgResult.error);
      return;
    }
    toast.success(t("signup.success"));
    setTimeout(() => navigate("/center_owner/dashboard", { replace: true }), 300);
  };

  /** Progress bar (8 steps max) */
  const progressWidth = [
    "12.5%",
    "25%",
    "37.5%",
    "50%",
    "62.5%",
    "75%",
    "87.5%",
    "100%",
  ][step];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 min-h-screen flex flex-col">
      <ToastContainer position="top-right" />

      {/* Progress bar */}
      <div className="h-1 w-full bg-black/10 rounded mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: progressWidth }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <AnimatePresence mode="wait">

          {/* COMMUN */}
          {step === 0 && <Step0UserInfo data={data} setData={setData} onNext={handleNext} />}
          {step === 1 && <Step1CityAndNumber data={data} setData={setData} onNext={handleNext} onBack={handleBack} />}
          {step === 2 && (
            <Step2Password
              data={data}
              setData={setData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <Step3Role
              data={data}
              setData={setData}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={() => {
                setData((prev) => ({ ...prev, role: ROLES.Learner }));
                setStep((prev) => prev + 1);
              }}
            />
          )}

          {/* LEARNER */}
          {step === 4 && data.role === ROLES.Learner && (
            <Step4Level
              data={data}
              setData={setData}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={() => {
                setData((prev) => ({ ...prev, level: prev.level || "Débutant" }));
                setStep((prev) => prev + 1);
              }}
            />
          )}
          {step === 5 && data.role === ROLES.Learner && (
            <Step5Subjects
              data={data}
              setData={setData}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={() => setStep((prev) => prev + 1)}
            />
          )}
          {step === 6 && data.role === ROLES.Learner && (
            <Step6Centers
              data={data}
              setData={setData}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={() => setStep((prev) => prev + 1)}
            />
          )}
          {step === 7 && data.role === ROLES.Learner && <Step7Subscription data={data} setData={setData} onNext={handleSubmit} onBack={handleBack} onSkip={handleSubmit} />}

          {/* TUTOR */}
          {step === 4 && data.role === ROLES.Tutor && (
            <StepTutorSubjects
              data={data}
              setData={setData}
              onNext={() => setStep((p) => p + 1)}
              onBack={handleBack}
              onSkip={() => setStep((prev) => prev + 1)}
            />
          )}
          {step === 5 && data.role === ROLES.Tutor && (
            <StepTutorLanguages
              data={data}
              setData={setData}
              onNext={() => setStep((p) => p + 1)}
              onBack={handleBack}
              onSkip={() => setStep((prev) => prev + 1)}
            />
          )}
          {step === 6 && data.role === ROLES.Tutor && (
            <StepTutorVideo
              data={data}
              setData={setData}
              onNext={() => setStep((p) => p + 1)}
              onBack={handleBack}
              onSkip={() => setStep((prev) => prev + 1)}
            />
          )}
          {step === 7 && data.role === ROLES.Tutor && (
            <StepTutorCenters data={data} setData={setData} onBack={handleBack} onNext={handleSubmit} onSkip={handleSubmit} />
          )}

          {/* CENTER_OWNER : un seul step après Step3Role */}
          {step === 4 && data.role === ROLES.CenterOwner && (
            <Step4CenterSetup
              data={data}
              setData={setData}
              onBack={handleBack}
              onSubmit={handleSubmitCenterOwner}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
