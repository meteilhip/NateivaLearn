import { useState, useRef, useMemo } from "react";
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
  const [bio, setBio] = useState(user?.tutorProfile?.bio || "");
  const [pricePerHour, setPricePerHour] = useState(
    user?.tutorProfile?.hourly_rate != null ? String(user.tutorProfile.hourly_rate) : ""
  );
  const [languages, setLanguages] = useState(
    Array.isArray(user?.tutorProfile?.languages)
      ? user.tutorProfile.languages.join(", ")
      : user?.tutorProfile?.languages || ""
  );
  const [subjects, setSubjects] = useState(user?.tutorProfile?.subjects || []);
  const [videoUrl, setVideoUrl] = useState(user?.tutorProfile?.video_url || "");
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

  const handleConfirmBio = () => {
    updateProfile({ bio: bio.trim() });
  };

  const handleConfirmVideo = () => {
    updateProfile({ video_url: videoUrl || null });
  };

  const displayLanguages = useMemo(() => {
    if (!user?.tutorProfile?.languages) return "";
    if (Array.isArray(user.tutorProfile.languages)) {
      return user.tutorProfile.languages.join(", ");
    }
    return String(user.tutorProfile.languages);
  }, [user?.tutorProfile]);

  const embed = useMemo(() => {
    if (!videoUrl) return null;
    try {
      const url = new URL(videoUrl);
      const hostname = url.hostname.toLowerCase();

      // YouTube (formats courts et classiques)
      if (hostname === "youtu.be") {
        const id = url.pathname.replace("/", "");
        if (!id) return null;
        return { url: `https://www.youtube.com/embed/${id}`, platform: "youtube" };
      }
      if (hostname.includes("youtube.com")) {
        const v = url.searchParams.get("v");
        if (v) {
          return { url: `https://www.youtube.com/embed/${v}`, platform: "youtube" };
        }
        // Si c'est déjà un embed
        if (url.pathname.includes("/embed/")) {
          return { url: videoUrl, platform: "youtube" };
        }
        return { url: videoUrl, platform: "youtube" };
      }

      // TikTok : on convertit /@user/video/ID en URL d'embed (vidéos majoritairement verticales)
      if (hostname.includes("tiktok.com")) {
        const segments = url.pathname.split("/").filter(Boolean);
        const videoIndex = segments.findIndex((s) => s === "video");
        if (videoIndex !== -1 && segments[videoIndex + 1]) {
          const id = segments[videoIndex + 1];
          return { url: `https://www.tiktok.com/embed/v2/${id}`, platform: "tiktok" };
        }
        return { url: videoUrl, platform: "tiktok" };
      }

      // Instagram : posts, reels, TV → URL d'embed (souvent vertical)
      if (hostname.includes("instagram.com")) {
        const segments = url.pathname.split("/").filter(Boolean);
        const typeIndex = segments.findIndex((s) => ["p", "reel", "tv"].includes(s));
        if (typeIndex !== -1 && segments[typeIndex + 1]) {
          const type = segments[typeIndex];
          const code = segments[typeIndex + 1];
          return { url: `https://www.instagram.com/${type}/${code}/embed`, platform: "instagram" };
        }
        return { url: videoUrl, platform: "instagram" };
      }

      // Facebook : on passe par le plugin vidéo officiel (plutôt horizontal)
      if (hostname.includes("facebook.com")) {
        const encoded = encodeURIComponent(videoUrl);
        return {
          url: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false`,
          platform: "facebook",
        };
      }

      // LinkedIn et autres : on tente un embed direct sur l'URL donnée
      return { url: videoUrl, platform: "other" };
    } catch {
      return null;
    }
  }, [videoUrl]);

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
        <h3 className="text-sm font-semibold text-dark/60 uppercase tracking-wider">
          {t("teacherPages.profileTitle")}
        </h3>
        <p className="text-xs text-dark/50 mt-1 mb-4">
          {t("teacherPages.profileSubtitle")}
        </p>
        <div className="max-w-2xl space-y-6">
          <ProfileField
            label={t("teacherPages.bio")}
            value={bio}
            onChange={setBio}
            onConfirm={handleConfirmBio}
            multiline
          />
          
          {/* Section Matières enseignées */}
          <div className="py-4 border-b border-black/5">
            <SubjectsSection
              subjects={subjects}
              onChange={(nextSubjects) => {
                setSubjects(nextSubjects);
                updateProfile({ subjects: nextSubjects });
              }}
            />
          </div>

          <ProfileField
            label={`${t("teacherPages.pricePerHour")} ($ / ${t("courses.hour")})`}
            value={pricePerHour}
            onChange={setPricePerHour}
            onConfirm={() => {
              const parsed = parseFloat(pricePerHour.replace(",", "."));
              updateProfile({
                hourly_rate: Number.isFinite(parsed) ? parsed : null,
              });
            }}
          />
          <ProfileField
            label={t("tutor.languages")}
            value={displayLanguages}
            readOnly
          />
          <ProfileField
            label={t("teacherPages.videoUrl")}
            value={videoUrl}
            onChange={setVideoUrl}
            onConfirm={handleConfirmVideo}
            placeholder="https://..."
          />
          {embed && (
            <div
              className={
                embed.platform === "tiktok" || embed.platform === "instagram"
                  ? "mt-4 w-full max-w-xs aspect-[9/16]"
                  : "mt-4 w-full max-w-xl aspect-video"
              }
            >
              <iframe
                src={embed.url}
                title="Tutor video"
                className="w-full h-full rounded-xl border border-black/5"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
