import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/ui/Button";
import { useTranslation } from "react-i18next";
import { FaVideo, FaLink } from "react-icons/fa";
import { toast } from "react-toastify";
import { Input } from "../../../shared/ui/Input";

/**
 * StepTutorVideo – Étape où le tuteur fournit un lien vidéo (YouTube, Loom, etc.)
 * plutôt qu'un upload de fichier lourd.
 */
export default function StepTutorVideo({ data, setData, onNext, onBack, onSkip }) {
  const { t } = useTranslation();
  const [videoUrl, setVideoUrl] = useState(data.tutorVideo ?? "");

  const isValidUrl = (value) => {
    if (!value) return false;
    try {
      const url = new URL(value.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setVideoUrl(value);
    setData((prev) => ({ ...prev, tutorVideo: value }));
  };

  const handleNext = () => {
    if (!videoUrl || !isValidUrl(videoUrl)) {
      return toast.error("Veuillez saisir un lien vidéo valide (YouTube, Loom, etc.)");
    }
    onNext();
  };

  return (
    <motion.div
      key="step-tutor-video"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold flex items-center gap-3">
        Dites-nous en plus sur vous
        <FaVideo className="text-primary" size={32} />
      </h1>

      <p className="text-black/70 text-lg">
        Collez un lien vers une courte vidéo de présentation (YouTube, Loom, Drive...).
      </p>

      <div className="space-y-3">
        <Input
          type="url"
          placeholder="https://youtube.com/..."
          value={videoUrl}
          onChange={handleChange}
          icon={FaLink}
        />
        {videoUrl && isValidUrl(videoUrl) && (
          <div className="rounded-lg border p-3 bg-black/5 text-sm break-all">
            <span className="font-semibold mr-2">Lien actuel :</span>
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              {videoUrl}
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="rounded">
            ← {t("signup.back")}
          </Button>
          <Button onClick={handleNext} disabled={!videoUrl} className="rounded">
            {t("signup.continue")}
          </Button>
        </div>
        {onSkip && (
          <Button variant="outline" onClick={onSkip} className="rounded w-full text-black/60">
            {t("signup.skip")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
