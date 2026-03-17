// src/shared/pages/LibraryPage.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { libraryService } from "../../services";
import { Button } from "../ui/Button";

export function LibraryPage() {
  const { t } = useTranslation();
  const [data, setData] = useState({ folders: [], files: [], shared: [] });
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [parentId, setParentId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [shareModal, setShareModal] = useState(null); // { type: 'file'|'folder', id, name }
  const [shareRecipientId, setShareRecipientId] = useState("");
  const [shareSending, setShareSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await libraryService.list();
      setData(res);
    } catch {
      setData({ folders: [], files: [], shared: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await libraryService.createFolder({ name: newFolderName.trim(), parentId: parentId || null });
      setNewFolderName("");
      setParentId(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await libraryService.uploadFile(file, parentId || null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (id) => {
    if (!confirm(t("library.confirmDeleteFile", "Supprimer ce fichier ?"))) return;
    try {
      await libraryService.deleteFile(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (id) => {
    if (!confirm(t("library.confirmDeleteFolder", "Supprimer ce dossier et son contenu ?"))) return;
    try {
      await libraryService.deleteFolder(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (fileId, name) => {
    setDownloadingId(fileId);
    try {
      await libraryService.downloadFile(fileId, name);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const openShare = (type, id, name) => {
    setShareModal({ type, id, name });
    setShareRecipientId("");
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!shareModal || !shareRecipientId.trim()) return;
    setShareSending(true);
    try {
      await libraryService.share({
        recipientId: Number(shareRecipientId.trim()),
        shareableType: shareModal.type,
        shareableId: shareModal.id,
      });
      setShareModal(null);
      setShareRecipientId("");
    } catch (err) {
      console.error(err);
    } finally {
      setShareSending(false);
    }
  };

  const renderFolder = (folder, isShared = false) => (
    <div key={`f-${folder.id}`} className="ml-4 border-l border-black/10 pl-3 py-1">
      <div className="flex items-center gap-2 py-1">
        <span className="font-medium text-dark">📁 {folder.name}</span>
        {!isShared && (
          <>
            <Button variant="ghost" className="text-xs" onClick={() => openShare("folder", folder.id, folder.name)}>
              {t("library.share", "Partager")}
            </Button>
            <Button variant="ghost" className="text-xs text-red-600" onClick={() => handleDeleteFolder(folder.id)}>
              {t("common.delete", "Supprimer")}
            </Button>
          </>
        )}
      </div>
      {(folder.files || []).map((f) => (
        <div key={`file-${f.id}`} className="flex items-center gap-2 py-0.5 text-sm">
          <button
            type="button"
            onClick={() => handleDownload(f.id, f.name)}
            disabled={downloadingId === f.id}
            className="text-primary hover:underline text-left disabled:opacity-50"
          >
            {f.name}
          </button>
          {!isShared && (
            <>
              <Button variant="ghost" className="text-xs" onClick={() => openShare("file", f.id, f.name)}>
                {t("library.share", "Partager")}
              </Button>
              <Button variant="ghost" className="text-xs text-red-600" onClick={() => handleDeleteFile(f.id)}>
                {t("common.delete", "Supprimer")}
              </Button>
            </>
          )}
        </div>
      ))}
      {(folder.children || []).map((c) => renderFolder(c, isShared))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">{t("library.title", "Ma librairie")}</h1>

      <section className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-dark mb-3">{t("library.myContent", "Mes dossiers et fichiers")}</h2>
        <form onSubmit={handleCreateFolder} className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder={t("library.folderName", "Nom du dossier")}
            className="border border-black/20 rounded px-3 py-2 text-sm"
          />
          <Button type="submit" variant="primary" className="rounded text-sm">
            {t("library.newFolder", "Nouveau dossier")}
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            <span
              role="button"
              className={`inline-flex items-center gap-2 px-4 py-2 font-medium border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded transition ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              {uploading ? t("library.uploading", "Envoi…") : t("library.uploadFile", "Envoyer un fichier")}
            </span>
          </label>
        </div>

        {loading ? (
          <p className="text-dark/60 py-4">{t("library.loading", "Chargement…")}</p>
        ) : (
          <div className="mt-4">
            {data.folders?.map((f) => renderFolder(f, false))}
            {data.files?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-dark/70 mb-1">{t("library.filesRoot", "Fichiers à la racine")}</p>
                {data.files.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 py-0.5 text-sm">
                    <button
                      type="button"
                      onClick={() => handleDownload(f.id, f.name)}
                      disabled={downloadingId === f.id}
                      className="text-primary hover:underline text-left disabled:opacity-50"
                    >
                      {f.name}
                    </button>
                    <Button variant="ghost" className="text-xs" onClick={() => openShare("file", f.id, f.name)}>
                      {t("library.share", "Partager")}
                    </Button>
                    <Button variant="ghost" className="text-xs text-red-600" onClick={() => handleDeleteFile(f.id)}>
                      {t("common.delete", "Supprimer")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {(!data.folders?.length && !data.files?.length) && (
              <p className="text-dark/60 text-sm py-2">{t("library.empty", "Aucun dossier ni fichier. Créez un dossier ou envoyez un fichier.")}</p>
            )}
          </div>
        )}
      </section>

      {data.shared?.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-dark mb-3">{t("library.received", "Reçus")}</h2>
          <ul className="space-y-2">
            {data.shared.map((s) => (
              <li key={s.share_id} className="border border-black/10 rounded p-2">
                <p className="text-sm font-medium text-dark">
                  {t("library.from", "De")} {s.sender_name}
                </p>
                {s.shareable_type === "folder" && renderFolder(s.shareable, true)}
                {s.shareable_type === "file" && (
                  <button
                    type="button"
                    onClick={() => handleDownload(s.shareable.id, s.shareable.name)}
                    disabled={downloadingId === s.shareable.id}
                    className="text-primary hover:underline text-sm text-left disabled:opacity-50"
                  >
                    {s.shareable.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShareModal(null)}>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-dark mb-2">
              {t("library.shareTitle", "Partager")} : {shareModal.name}
            </h3>
            <form onSubmit={handleShareSubmit}>
              <label className="block text-sm font-medium text-dark/80 mb-1">
                {t("library.recipientId", "ID du destinataire")}
              </label>
              <input
                type="number"
                value={shareRecipientId}
                onChange={(e) => setShareRecipientId(e.target.value)}
                placeholder="123"
                className="w-full border border-black/20 rounded px-3 py-2 mb-3"
                required
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShareModal(null)}>
                  {t("common.cancel", "Annuler")}
                </Button>
                <Button type="submit" variant="primary" disabled={shareSending}>
                  {shareSending ? t("library.sending", "Envoi…") : t("library.send", "Envoyer")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
