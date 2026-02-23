import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../../../app/store/auth.store";
import { ProfileField } from "../../../shared/ui/ProfileField";
import { SubjectsSection } from "../../../shared/components/SubjectsSection";

export const TutorProfile = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [bio, setBio] = useState("Enseignant passionné, pédagogie adaptée à chaque élève.");
  const [pricePerHour, setPricePerHour] = useState("5000");
  const [languages, setLanguages] = useState("Français, Anglais");
  const [subjects, setSubjects] = useState(["Mathématiques", "Physique"]);
  const [videoUrl, setVideoUrl] = useState("");
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const handleConfirmName = () => {
    if (name.trim()) updateProfile({ name: name.trim() });
  };

  const handleConfirmPassword = () => {
    setPasswordError("");
    if (currentPassword !== (user?.password ?? "")) {
      setPasswordError(t("profilePage.wrongCurrentPassword"));
      return;
    }
    if (newPassword && newPassword === confirmPassword) {
      updateProfile({ password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const passwordDirty = currentPassword !== "" || newPassword !== "" || confirmPassword !== "";
  const passwordValid =
    currentPassword === (user?.password ?? "") &&
    newPassword.length > 0 &&
    newPassword === confirmPassword;

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col gap-6">
      {/* Carte Compte */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-80 shrink-0 bg-gradient-to-b from-primary/5 to-transparent p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <img
              src={user?.avatar || "/9581121.png"}
              alt=""
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-medium">
              {t("profilePage.changePhoto")}
            </span>
          </button>
          <h2 className="mt-4 text-xl font-semibold text-dark truncate max-w-full px-2 text-center">{user?.name || "—"}</h2>
        </div>

        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center min-w-0">
          <div className="max-w-lg">
            <h3 className="text-sm font-semibold text-dark/60 uppercase tracking-wider mb-2">{t("settings.account")}</h3>
            <ProfileField label={t("profilePage.name")} value={name} onChange={setName} onConfirm={handleConfirmName} />
            <ProfileField label={t("profilePage.email")} value={user?.email || ""} readOnly />
            <ProfileField label={t("profilePage.phone")} value={user?.phone || ""} readOnly />

            <div className="py-4 border-b border-black/5">
              <span className="text-dark/60 text-sm font-medium min-w-[140px] block mb-2">{t("profilePage.password")}</span>
              {passwordError && <p className="text-red-600 text-sm mb-2">{passwordError}</p>}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-black/10 focus-within:border-primary transition-colors">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t("profilePage.currentPassword")}
                    className="flex-1 bg-transparent text-dark text-base outline-none py-2 placeholder:text-dark/40"
                  />
                  <button type="button" onClick={() => setShowCurrent((s) => !s)} className="p-2 rounded-full text-dark/50 hover:text-dark hover:bg-black/5" title={showCurrent ? t("profilePage.hidePassword") : t("profilePage.showPassword")} aria-label={showCurrent ? t("profilePage.hidePassword") : t("profilePage.showPassword")}>
                    {showCurrent ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 border-b border-black/10 focus-within:border-primary transition-colors">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("profilePage.newPassword")}
                    className="flex-1 bg-transparent text-dark text-base outline-none py-2 placeholder:text-dark/40"
                  />
                  <button type="button" onClick={() => setShowNew((s) => !s)} className="p-2 rounded-full text-dark/50 hover:text-dark hover:bg-black/5" title={showNew ? t("profilePage.hidePassword") : t("profilePage.showPassword")} aria-label={showNew ? t("profilePage.hidePassword") : t("profilePage.showPassword")}>
                    {showNew ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 border-b border-black/10 focus-within:border-primary transition-colors">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("profilePage.confirmPassword")}
                    className="flex-1 bg-transparent text-dark text-base outline-none py-2 placeholder:text-dark/40"
                  />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="p-2 rounded-full text-dark/50 hover:text-dark hover:bg-black/5" title={showConfirm ? t("profilePage.hidePassword") : t("profilePage.showPassword")} aria-label={showConfirm ? t("profilePage.hidePassword") : t("profilePage.showPassword")}>
                    {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  {passwordDirty && (
                    <button type="button" onClick={passwordValid ? handleConfirmPassword : undefined} className={`flex-shrink-0 p-2 rounded-full transition ${passwordValid ? "text-primary hover:bg-primary/10" : "text-dark/30 cursor-not-allowed"}`} title={passwordValid ? "Valider" : ""} disabled={!passwordValid}>
                      <FaCheck size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Carte Profil public */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 md:p-8"
      >
        <h3 className="text-sm font-semibold text-dark/60 uppercase tracking-wider mb-4">{t("teacherPages.profileTitle")}</h3>
        <div className="max-w-2xl space-y-6">
          <ProfileField label={t("teacherPages.bio")} value={bio} onChange={setBio} onConfirm={() => {}} multiline />
          
          {/* Section Matières enseignées */}
          <div className="py-4 border-b border-black/5">
            <SubjectsSection subjects={subjects} onChange={setSubjects} />
          </div>

          <ProfileField
            label={`${t("teacherPages.pricePerHour")} ($ / ${t("courses.hour")})`}
            value={pricePerHour}
            onChange={setPricePerHour}
            onConfirm={() => {}}
          />
          <ProfileField label={t("tutor.languages")} value={languages} onChange={setLanguages} onConfirm={() => {}} />
          <ProfileField
            label={t("teacherPages.videoUrl")}
            value={videoUrl}
            onChange={setVideoUrl}
            onConfirm={() => {}}
            placeholder="https://..."
          />
        </div>
      </motion.div>
    </div>
  );
};
