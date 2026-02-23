// src/roles/center_owner/pages/VideoCallLayout.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaVideo, FaMicrophone, FaPhone, FaUsers } from "react-icons/fa";

/**
 * VideoCallLayout
 * ---------------
 * Layout UI pour visioconférence (simulation frontend uniquement).
 * Affiche les participants et les contrôles.
 */
export const VideoCallLayout = () => {
  const { t } = useTranslation();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // Mock participants
  const participants = [
    { id: "p1", name: "Tuteur 1", isVideoOn: true },
    { id: "p2", name: "Apprenant 1", isVideoOn: true },
    { id: "p3", name: "Apprenant 2", isVideoOn: false },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark">
        {t("centerOwner.videoCall", "Visioconférence")}
      </h1>

      {/* Zone vidéo principale */}
      <div className="bg-gray-900 rounded-lg p-8 min-h-[500px] flex items-center justify-center relative">
        <div className="grid grid-cols-2 gap-4 w-full">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]"
            >
              {participant.isVideoOn ? (
                <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                  <FaUsers className="text-white text-4xl" />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              <p className="text-white text-sm mt-2">{participant.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contrôles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`
              p-4 rounded-full transition
              ${isVideoOn ? "bg-gray-200 text-dark" : "bg-red-600 text-white"}
            `}
          >
            <FaVideo size={20} />
          </button>

          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`
              p-4 rounded-full transition
              ${isMicOn ? "bg-gray-200 text-dark" : "bg-red-600 text-white"}
            `}
          >
            <FaMicrophone size={20} />
          </button>

          <button
            type="button"
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <FaPhone size={20} />
          </button>
        </div>

        <p className="text-center text-sm text-dark/60 mt-4">
          {t("centerOwner.videoCallNote", "Simulation UI uniquement - Pas de connexion réelle")}
        </p>
      </div>
    </div>
  );
};
