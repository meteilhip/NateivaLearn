import centersData from "./centers";
import { FaBookOpen, FaGlobe, FaSquareRootAlt } from "react-icons/fa";

// Map pour associer certaines matières à des icônes
const subjectIcons = {
  Mathematics: FaSquareRootAlt,
  English: FaGlobe,
  Français: FaBookOpen,
  // ajoute d'autres matières si nécessaire
};

// Construire les cours dynamiquement à partir des centres
const coursesMap = {};

centersData.forEach(center => {
  (center.levels || []).forEach(cls => {
    (cls.subjects || []).forEach(subject => {
      if (!coursesMap[subject.name]) {
        coursesMap[subject.name] = {
          id: Object.keys(coursesMap).length + 1,
          title: `Cours de ${subject.name}`,
          summary: `Apprenez et maîtrisez ${subject.name} avec nos meilleurs enseignants.`,
          icon: subjectIcons[subject.name] || FaBookOpen,
          subjectName: subject.name
        };
      }
    });
  });
});

const coursesData = Object.values(coursesMap);

export default coursesData;
