/**
 * Transforme une URL vidéo (YouTube, TikTok, etc.) en URL d'embed pour iframe.
 * @param {string} videoUrl
 * @returns {{ url: string, platform: string } | null}
 */
export function getVideoEmbed(videoUrl) {
  if (!videoUrl || typeof videoUrl !== "string") return null;
  try {
    const url = new URL(videoUrl);
    const hostname = url.hostname.toLowerCase();

    if (hostname === "youtu.be") {
      const id = url.pathname.replace("/", "");
      if (!id) return null;
      return { url: `https://www.youtube.com/embed/${id}`, platform: "youtube" };
    }
    if (hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return { url: `https://www.youtube.com/embed/${v}`, platform: "youtube" };
      if (url.pathname.includes("/embed/")) return { url: videoUrl, platform: "youtube" };
      return { url: videoUrl, platform: "youtube" };
    }
    if (hostname.includes("tiktok.com")) {
      const segments = url.pathname.split("/").filter(Boolean);
      const videoIndex = segments.findIndex((s) => s === "video");
      if (videoIndex !== -1 && segments[videoIndex + 1]) {
        const id = segments[videoIndex + 1];
        return { url: `https://www.tiktok.com/embed/v2/${id}`, platform: "tiktok" };
      }
      return { url: videoUrl, platform: "tiktok" };
    }
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
    if (hostname.includes("facebook.com")) {
      const encoded = encodeURIComponent(videoUrl);
      return {
        url: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false`,
        platform: "facebook",
      };
    }
    return { url: videoUrl, platform: "other" };
  } catch {
    return null;
  }
}
