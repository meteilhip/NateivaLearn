// src/auth/pages/Step1CityAndNumber.jsx
import { motion } from "framer-motion";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Import composants réutilisables
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";

/**
 * Step1CityAndNumber
 * Étape 1 du signup : Localisation (ville, pays) et numéro de téléphone
 *
 * Props :
 * - data : objet contenant city, country et phone
 * - setData : fonction pour mettre à jour les données
 * - onNext : callback pour passer à l'étape suivante
 * - onBack : callback pour revenir à l'étape précédente
 */
export default function Step1CityAndNumber({ data, setData, onNext, onBack }) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="step-1-city-number"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Titre avec icône */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        {t("signup.locationAndPhone", "Localisation et numéro de téléphone")}
        <FiMapPin className="text-primary" size={32} />
      </h1>

      {/* Petite phrase d'introduction */}
      <p className="text-black/70 text-lg">
        {t("signup.locationAndPhoneInfo", "Indiquez votre ville, votre pays et votre numéro de téléphone.")}
      </p>

      {/* Input ville */}
      <Input
        type="text"
        placeholder={t("signup.city", "Ville")}
        value={data.city || ""}
        onChange={(e) => setData({ ...data, city: e.target.value })}
        icon={FiMapPin}
      />

      {/* Input pays */}
      <Input
        type="text"
        placeholder={t("signup.country", "Pays")}
        value={data.country || ""}
        onChange={(e) => setData({ ...data, country: e.target.value })}
        icon={FiMapPin}
      />

      {/* Input numéro de téléphone */}
      <Input
        type="tel"
        placeholder={t("signup.phone")}
        value={data.phone || ""}
        onChange={(e) => setData({ ...data, phone: e.target.value })}
        icon={FiPhone}
      />

      {/* Boutons de navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="rounded">
          ← {t("signup.back")}
        </Button>
        <Button variant="primary" onClick={onNext} className="rounded">
          {t("signup.continue")}
        </Button>
      </div>
    </motion.div>
  );
}
