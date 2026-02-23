// src/roles/tutor/pages/TutorVideo.jsx
import { motion } from "framer-motion";
import { FaVideo } from "react-icons/fa";

/** TutorVideo - Espace visioconférence tuteur. */
export const TutorVideo = () => (
  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
    <h1 className="text-2xl font-bold text-dark">Visioconférence</h1>
    <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center gap-4 shadow-sm">
      <FaVideo size={40} className="text-primary" />
      <p className="text-dark/70 text-center">Les sessions de visioconférence apparaîtront ici.</p>
    </div>
  </motion.div>
);
