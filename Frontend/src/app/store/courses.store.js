// src/app/store/courses.store.js
import { create } from "zustand";

/**
 * Courses Store (mock)
 * --------------------
 * Simule : tuteurs, réservations (bookings), disponibilités.
 * Côté apprenant : voir tuteurs, réserver, voir mes leçons.
 * Côté tuteur : voir bookings, dispos.
 * Plus tard : branché sur API backend.
 */

// Statuts possibles d'une réservation (alignés avec le doc)
const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

/**
 * Tuteurs fictifs avec prix, note, langues, disponibilités simulées
 */
const MOCK_TUTORS = [
  {
    id: "t1",
    name: "Marie Dupont",
    avatar: "/teacher-new.png",
    bio: "Enseignante passionnée par les mathématiques et la physique. Pédagogie adaptée à chaque élève.",
    tagline: "Maths & Physique",
    subjects: ["Mathématiques", "Physique"],
    languages: ["Français", "Anglais"],
    experience: "8 ans",
    center: "Centre A",
    pricePerHour: 50,
    rating: 4.8,
    studentsCount: 120,
    videoUrl: null,
    // Disponibilités simulées (jours de la semaine 0-6, créneaux en minutes depuis 8h)
    availabilitySlots: [
      { day: 1, start: 9 * 60, end: 12 * 60 },
      { day: 3, start: 14 * 60, end: 18 * 60 },
      { day: 5, start: 10 * 60, end: 14 * 60 },
    ],
  },
  {
    id: "t2",
    name: "Jean Martin",
    avatar: "/teacher-new.png",
    bio: "Professeur d'anglais et de français langue étrangère. Méthode communicative.",
    tagline: "Anglais, FLE",
    subjects: ["Anglais", "Français"],
    languages: ["Français", "Anglais", "Espagnol"],
    experience: "5 ans",
    center: "Centre B",
    pricePerHour: 45,
    rating: 4.6,
    studentsCount: 85,
    videoUrl: null,
    availabilitySlots: [
      { day: 0, start: 10 * 60, end: 16 * 60 },
      { day: 2, start: 9 * 60, end: 13 * 60 },
      { day: 4, start: 14 * 60, end: 19 * 60 },
    ],
  },
  {
    id: "t3",
    name: "Sophie Bernard",
    avatar: "/teacher-new.png",
    bio: "Spécialiste des sciences et de la méthodologie. Préparation aux examens.",
    tagline: "Sciences, Méthodo",
    subjects: ["SVT", "Chimie", "Méthodologie"],
    languages: ["Français"],
    experience: "12 ans",
    center: "Centre B",
    pricePerHour: 55,
    rating: 4.9,
    studentsCount: 200,
    videoUrl: null,
    availabilitySlots: [
      { day: 1, start: 8 * 60, end: 12 * 60 },
      { day: 4, start: 9 * 60, end: 17 * 60 },
    ],
  },
];

/**
 * Réservations fictives (mix à venir + historique)
 * learnerId / tutorId pour lier à l'utilisateur connecté
 */
const getMockBookings = (learnerId) => [
  {
    id: "b1",
    learnerId,
    tutorId: "t1",
    tutorName: "Marie Dupont",
    tutorAvatar: "/teacher-new.png",
    subject: "Mathématiques",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    status: BOOKING_STATUS.CONFIRMED,
    price: 10,
  },
  {
    id: "b2",
    learnerId,
    tutorId: "t2",
    tutorName: "Jean Martin",
    tutorAvatar: "/teacher-new.png",
    subject: "Anglais",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    status: BOOKING_STATUS.PENDING,
    price: 45,
  },
  {
    id: "b3",
    learnerId,
    tutorId: "t1",
    tutorName: "Marie Dupont",
    tutorAvatar: "/teacher-new.png",
    subject: "Physique",
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    status: BOOKING_STATUS.COMPLETED,
    price: 50,
    reviewGiven: true,
  },
  {
    id: "b4",
    learnerId,
    tutorId: "t3",
    tutorName: "Sophie Bernard",
    tutorAvatar: "/teacher-new.png",
    subject: "SVT",
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    status: BOOKING_STATUS.COMPLETED,
    price: 55,
    reviewGiven: false,
  },
];

/**
 * Disponibilités hebdomadaires tuteur (mock)
 */
const MOCK_WEEKLY_AVAILABILITY = [
  { day: 0, start: 10 * 60, end: 16 * 60 },
  { day: 1, start: 9 * 60, end: 12 * 60 },
  { day: 2, start: 9 * 60, end: 13 * 60 },
  { day: 3, start: 14 * 60, end: 18 * 60 },
  { day: 4, start: 9 * 60, end: 17 * 60 },
];

const MOCK_BLOCKED_DATES = [
  new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
];

export const BOOKING_STATUS_LABELS = BOOKING_STATUS;

export const useCoursesStore = create((set, get) => ({
  tutors: MOCK_TUTORS,
  weeklyAvailability: MOCK_WEEKLY_AVAILABILITY,
  blockedDates: MOCK_BLOCKED_DATES,

  /**
   * Bookings : on utilise un userId pour filtrer côté apprenant ou tuteur.
   */
  bookings: [],

  /** Initialiser les bookings pour un apprenant (learnerId) */
  setBookingsForLearner: (learnerId) => {
    set({ bookings: getMockBookings(learnerId) });
  },

  /** Bookings pour un tuteur : on filtre les mock par tutorId (t1, t2, t3) */
  setBookingsForTutor: (tutorId) => {
    const allBookings = getMockBookings("learner-1");
    const forTutor = allBookings.filter((b) => b.tutorId === tutorId);
    set({ bookings: forTutor });
  },

  /**
   * Créer une réservation (mock) : pending → après "paiement" → confirmed
   */
  createBooking: (payload) => {
    const { learnerId, tutorId, tutorName, tutorAvatar, subject, startTime, endTime, price } = payload;
    const newBooking = {
      id: `b-${Date.now()}`,
      learnerId,
      tutorId,
      tutorName,
      tutorAvatar,
      subject,
      startTime,
      endTime,
      status: BOOKING_STATUS.PENDING,
      price,
    };
    set((state) => ({ bookings: [newBooking, ...state.bookings] }));
    return newBooking;
  },

  /**
   * Confirmer un booking (simule succès paiement)
   */
  confirmBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: BOOKING_STATUS.CONFIRMED } : b
      ),
    }));
  },

  /**
   * Annuler un booking
   */
  cancelBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: BOOKING_STATUS.CANCELLED } : b
      ),
    }));
  },

  /**
   * Mettre à jour un booking (pour reprogrammation)
   */
  updateBooking: (bookingId, updates) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, ...updates } : b
      ),
    }));
  },

  /**
   * Marquer comme completed (côté enseignant ou après session)
   */
  completeBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: BOOKING_STATUS.COMPLETED } : b
      ),
    }));
  },

  /**
   * Ajouter un avis (mock : on marque reviewGiven sur le booking)
   */
  setReviewGiven: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, reviewGiven: true } : b
      ),
    }));
  },

  /**
   * Mettre à jour les disponibilités hebdo (tuteur)
   */
  setWeeklyAvailability: (slots) => {
    set({ weeklyAvailability: slots });
  },

  /**
   * Ajouter une date bloquée
   */
  addBlockedDate: (dateStr) => {
    set((state) => ({
      blockedDates: state.blockedDates.includes(dateStr) ? state.blockedDates : [...state.blockedDates, dateStr],
    }));
  },

  removeBlockedDate: (dateStr) => {
    set((state) => ({
      blockedDates: state.blockedDates.filter((d) => d !== dateStr),
    }));
  },

  /** Filtres : langue, matière, prix min/max, note min */
  getFilteredTutors: (filters = {}) => {
    const { language, subject, priceMin, priceMax, ratingMin } = filters;
    return get().tutors.filter((t) => {
      if (language && !(t.languages || []).includes(language)) return false;
      if (subject && !(t.subjects || []).includes(subject)) return false;
      if (priceMin != null && t.pricePerHour < priceMin) return false;
      if (priceMax != null && t.pricePerHour > priceMax) return false;
      if (ratingMin != null && (t.rating || 0) < ratingMin) return false;
      return true;
    });
  },
}));
