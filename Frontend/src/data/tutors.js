// src/data/tutors.js
import profFrancais from "../assets/images/profFrançais.jpg";
import profMaths from "../assets/images/profMaths.jpg";
import profMaths1 from "../assets/images/profMaths1.jpg";
import profAnglais from "../assets/images/profAnglais.jpg";

/**
 * Liste normalisée des tuteurs
 * - subjects DOIT correspondre à course.subjectName (Step3)
 */
const tutors = [
  {
    id: 1,
    name: "Mme Dupont",
    avatar: profFrancais,
    subjects: ["Français"],
    center: "Centre Central",
    experience: "3+ ans",
    languages: ["Français", "Anglais"],
    bio: "Enseignante passionnée, engagée dans la réussite académique.",
    studentsCount: 60,
    ratings: { score: 4.3, reviews: 39 },
  },
  {
    id: 2,
    name: "M. Martin",
    avatar: profMaths,
    subjects: ["Mathématiques"],
    center: "Nateiva Tutoring",
    experience: "5+ ans",
    languages: ["Français"],
    bio: "Spécialiste en mathématiques appliquées.",
    studentsCount: 120,
    ratings: { score: 4.3, reviews: 39 },
  },
  {
    id: 3,
    name: "M. Smith",
    avatar: profAnglais,
    subjects: ["Anglais"],
    center: "Centre A",
    experience: "4+ ans",
    languages: ["Anglais"],
    bio: "Coach en communication et anglais professionnel.",
    studentsCount: 80,
    ratings: { score: 4.3, reviews: 39 },
  },
  {
    id: 4,
    name: "Mme Ray",
    avatar: profMaths1,
    subjects: ["Français", "Anglais"],
    center: "Centre B",
    experience: "6+ ans",
    languages: ["Français", "Anglais"],
    bio: "Approche pédagogique personnalisée.",
    studentsCount: 150,
    ratings: { score: 4.3, reviews: 39 },
  },
];

export default tutors;
