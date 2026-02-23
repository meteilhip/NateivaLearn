// src/data/centers.js
// Extended fake DB for centers — includes LEVELS, subjects, and prices
// Levels are standardized: Débutant | Intermédiaire | Avancé

import center1 from "../assets/images/center1.jpg";
import center2 from "../assets/images/center2.jpg";
import center3 from "../assets/images/center3.jpg";
import center4 from "../assets/images/center4.jpg";

/**
 * STRUCTURE D'UN CENTRE
 * --------------------
 * - id, name, city, address, image, contactPhone
 * - levels: array of level objects
 *    {
 *      id,
 *      level: "Débutant" | "Intermédiaire" | "Avancé",
 *      subjects: [{ id, name }],
 *      pricePerSubject: { [subjectName]: number }
 *    }
 * - subjects: liste dédupliquée des matières (helper pour le UI)
 * - ratings: score + reviews
 *
 * Dataset fictif utilisé pour filtres intelligents / démos
 */

const centers = [
  {
    id: 1,
    name: "Centre Central",
    city: "Yaoundé",
    address: "Mimboman",
    image: center1,
    contactPhone: "237650556008",
    ratings: { score: 4.6, reviews: 128 },

    // ⬇️ REMPLACE "classes"
    levels: [
      {
        id: "l1-1",
        level: "Débutant",
        subjects: [
          { id: "s-math", name: "Mathematics" },
          { id: "s-fr", name: "Français" }
        ],
        pricePerSubject: {
          Mathematics: 1000,
          Français: 1400
        }
      },
      {
        id: "l1-2",
        level: "Intermédiaire",
        subjects: [
          { id: "s-math", name: "Mathematics" },
          { id: "s-phy", name: "Physics" },
          { id: "s-chem", name: "Chemistry" }
        ],
        pricePerSubject: {
          Mathematics: 2000,
          Physics: 2200,
          Chemistry: 2200
        }
      }
    ]
  },

  {
    id: 2,
    name: "Nateiva Tutoring",
    city: "Yaoundé",
    address: "Ngousso",
    image: center2,
    learnersCount: 102,
    tutorsCount: 10,
    contactPhone: "237650556009",
    ratings: { score: 4.9, reviews: 203 },

    levels: [
      {
        id: "l2-1",
        level: "Intermédiaire",
        subjects: [
          { id: "s-math", name: "Mathematics" },
          { id: "s-eng", name: "English" },
          { id: "s-compsci", name: "Computer Science" }
        ],
        pricePerSubject: {
          Mathematics: 500,
          English: 1000,
          "Computer Science": 300
        }
      },
      {
        id: "l2-2",
        level: "Avancé",
        subjects: [
          { id: "s-math", name: "Mathematics" },
          { id: "s-stat", name: "Statistics" }
        ],
        pricePerSubject: {
          Mathematics: 3500,
          Statistics: 3200
        }
      }
    ]
  },

  {
    id: 3,
    name: "Centre A",
    city: "Douala",
    address: "Bonapriso",
    image: center3,
    contactPhone: "237650556010",
    ratings: { score: 4.2, reviews: 54 },

    levels: [
      {
        id: "l3-1",
        level: "Débutant",
        subjects: [
          { id: "s-fr", name: "Français" },
          { id: "s-eng", name: "English" }
        ],
        pricePerSubject: {
          Français: 1300,
          English: 450
        }
      },
      {
        id: "l3-2",
        level: "Intermédiaire",
        subjects: [
          { id: "s-hist", name: "History" },
          { id: "s-geo", name: "Geography" }
        ],
        pricePerSubject: {
          History: 1500,
          Geography: 1500
        }
      }
    ]
  },

  {
    id: 4,
    name: "Centre B",
    city: "Douala",
    address: "Akwa",
    image: center4,
    contactPhone: "237650556011",
    ratings: { score: 4.0, reviews: 71 },

    levels: [
      {
        id: "l4-1",
        level: "Avancé",
        subjects: [
          { id: "s-phy", name: "Physics" },
          { id: "s-chem", name: "Chemistry" }
        ],
        pricePerSubject: {
          Physics: 200,
          Chemistry: 200
        }
      }
    ]
  },

  {
    id: 5,
    name: "Centre C",
    city: "Bafoussam",
    address: "Quartier Centre",
    image: center1,
    contactPhone: "237650556012",
    ratings: { score: 3.9, reviews: 22 },

    levels: [
      {
        id: "l5-1",
        level: "Débutant",
        subjects: [
          { id: "s-math", name: "Mathematics" },
          { id: "s-eng", name: "English" }
        ],
        pricePerSubject: {
          Mathematics: 1200,
          English: 12000
        }
      }
    ]
  },

  {
    id: 6,
    name: "Centre D",
    city: "Bamenda",
    address: "Route Principale",
    image: center3,
    contactPhone: "237650556013",
    ratings: { score: 4.3, reviews: 39 },

    levels: [
      {
        id: "l6-1",
        level: "Intermédiaire",
        subjects: [
          { id: "s-fr", name: "Français" },
          { id: "s-math", name: "Mathematics" }
        ],
        pricePerSubject: {
          Français: 1300,
          Mathematics: 1500
        }
      }
    ]
  }
];

/**
 * HELPER
 * ------
 * Génère une liste UNIQUE de matières par centre
 * utile pour :
 * - filtres globaux
 * - affichage rapide (badges, tags)
 */
const withSubjects = centers.map((center) => {
  const subjectMap = {};

  center.levels.forEach((lvl) => {
    lvl.subjects.forEach((subject) => {
      subjectMap[subject.name] = subject;
    });
  });

  return {
    ...center,
    subjects: Object.values(subjectMap)
  };
});

export default withSubjects;
