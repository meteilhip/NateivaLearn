import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/ui/Button";
import { useTranslation } from "react-i18next";
import { FaVideo } from "react-icons/fa";
import { toast } from "react-toastify";

/** StepTutorVideo – Étape où le tuteur ajoute une vidéo de présentation */
export default function StepTutorVideo({ data, setData, onNext, onBack }) {
  const [videoFile, setVideoFile] = useState(data.tutorVideo || null);
  const [videoURL, setVideoURL] = useState(
    data.tutorVideo ? URL.createObjectURL(data.tutorVideo) : null
  );

  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const videoRef = useRef(null);

  const { t } = useTranslation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoURL(url);
      setData((prev) => ({ ...prev, tutorVideo: file }));

      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
      }

      toast.success("Vidéo sélectionnée !");
    }
  };

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(userStream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current = new MediaRecorder(userStream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const file = new File([blob], "presentation.webm", { type: "video/webm" });

        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoURL(url);
        setData((prev) => ({ ...prev, tutorVideo: file }));

        userStream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setIsRecording(false);

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.controls = true;
          videoRef.current.play();
        }

        toast.success("Enregistrement terminé et vidéo uploadée !");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
        videoRef.current.controls = false;
        videoRef.current.play();
      }

      toast.info("Enregistrement en cours...");
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'accéder à la caméra");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleNext = () => {
    if (!videoFile) return toast.error("Veuillez ajouter une vidéo !");
    onNext();
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

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
        Vous pouvez sélectionner une vidéo ou utiliser votre caméra pour vous présenter.
      </p>

      <video
        ref={videoRef}
        src={!isRecording ? videoURL : undefined}
        controls={!isRecording}
        className="w-full max-h-80 rounded-lg border bg-black"
        autoPlay={isRecording}
      />

      <div className="flex gap-4 mt-4">
        <label
          htmlFor="videoUpload"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition font-medium shadow-md flex-1 justify-center"
        >
          <FaVideo size={20} />
          {videoFile ? "Changer la vidéo" : "Sélectionner une vidéo"}
        </label>
        <input
          id="videoUpload"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="bg-green-500 hover:bg-green-600 text-white rounded flex-1"
          >
            Démarrer la caméra
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white rounded flex-1"
          >
            Arrêter l'enregistrement
          </Button>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="rounded">
          ← {t("signup.back")}
        </Button>
        <Button onClick={handleNext} disabled={!videoFile} className="rounded">
          {t("signup.continue")}
        </Button>
      </div>
    </motion.div>
  );
}
