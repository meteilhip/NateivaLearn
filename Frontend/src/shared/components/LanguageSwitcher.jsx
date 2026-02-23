import { useTranslation } from "react-i18next";

/**
 * LanguageSwitcher
 * - Choix de langue dès le step 1
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex justify-center gap-2 mb-4">
      {["fr", "en"].map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          className={`px-3 py-1 rounded text-sm transition ${
            i18n.language === lng
              ? "bg-primary text-white"
              : "bg-black/10 text-black"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
