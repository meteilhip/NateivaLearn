// src/app/store/courses.store.js
import { create } from "zustand";
import { bookingService, availabilityService, tutorService } from "../../services";

const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

function mapBooking(b) {
  if (!b) return b;
  return {
    id: b.id,
    learnerId: b.learner_id ?? b.learnerId,
    learnerName: b.learner?.name ?? b.learner_name ?? b.learnerName,
    learnerEmail: b.learner?.email ?? b.learner_email ?? b.learnerEmail,
    tutorId: b.tutor_id ?? b.tutorId,
    tutorName: b.tutor?.name,
    tutorAvatar: b.tutor?.avatar ?? b.tutor?.photo ?? null,
    subject: null,
    startTime: b.date && b.start_time ? `${b.date}T${b.start_time}` : b.start_time ?? b.startTime,
    endTime: b.date && b.end_time ? `${b.date}T${b.end_time}` : b.end_time ?? b.endTime,
    status: b.status,
    price: b.price,
    reviewGiven: b.review_given ?? b.reviewGiven,
  };
}

function mapTutor(t) {
  if (!t) return t;
  const p = t.tutor_profile ?? t.tutorProfile ?? {};
  return {
    id: t.id,
    name: t.name,
    avatar: t.avatar ?? t.photo ?? null,
    bio: p.bio,
    subjects: p.subjects ?? [],
    languages: p.languages ?? [],
    center: t.city ?? "",
    pricePerHour: p.hourly_rate ?? p.hourlyRate,
    rating: p.rating ?? 0,
    studentsCount: 0,
    videoUrl: p.video_url ?? t.video_url ?? null,
    availabilitySlots: [],
  };
}

export const BOOKING_STATUS_LABELS = BOOKING_STATUS;

export const useCoursesStore = create((set, get) => ({
  tutors: [],
  weeklyAvailability: [],
  blockedDates: [],
  bookings: [],
  availabilityByTutorId: {},

  fetchTutors: async (filters = {}) => {
    try {
      const data = await tutorService.list(filters);
      set({ tutors: (data ?? []).map(mapTutor) });
      return get().tutors;
    } catch {
      set({ tutors: [] });
      return [];
    }
  },

  fetchBookings: async () => {
    try {
      const data = await bookingService.list();
      set({ bookings: (data ?? []).map(mapBooking) });
      return get().bookings;
    } catch {
      set({ bookings: [] });
      return [];
    }
  },

  setBookingsForLearner: async (learnerId) => {
    await get().fetchBookings();
  },

  setBookingsForTutor: async (tutorId) => {
    await get().fetchBookings();
  },

  fetchAvailability: async () => {
    try {
      const data = await availabilityService.list();
      const slots = (data.slots ?? []).map((s) => ({
        day: s.day_of_week ?? s.day,
        start: timeToMinutes(s.start_time ?? s.startTime),
        end: timeToMinutes(s.end_time ?? s.endTime),
      }));
      const blocked = (data.blocked_dates ?? []).map((d) => (typeof d === "string" ? d : d?.date ?? d));
      set({ weeklyAvailability: slots, blockedDates: blocked });
      return { weeklyAvailability: slots, blockedDates: blocked };
    } catch {
      set({ weeklyAvailability: [], blockedDates: [] });
      return { weeklyAvailability: [], blockedDates: [] };
    }
  },

  fetchAvailabilityForTutor: async (tutorId) => {
    if (!tutorId) return [];
    try {
      const data = await availabilityService.byTutor(tutorId);
      const slots = (data.slots ?? []).map((s) => ({
        day: s.day_of_week ?? s.day,
        start: timeToMinutes(s.start_time ?? s.startTime),
        end: timeToMinutes(s.end_time ?? s.endTime),
      }));
      set((state) => ({
        availabilityByTutorId: {
          ...state.availabilityByTutorId,
          [tutorId]: slots,
        },
      }));
      return slots;
    } catch {
      set((state) => ({
        availabilityByTutorId: {
          ...state.availabilityByTutorId,
          [tutorId]: [],
        },
      }));
      return [];
    }
  },

  createBooking: async (payload) => {
    try {
      const date = payload.date ?? (payload.startTime?.slice ? payload.startTime.slice(0, 10) : null);
      const startTime = typeof payload.startTime === "string" && payload.startTime.length === 5 && payload.startTime.includes(":")
        ? payload.startTime
        : (payload.startTime?.slice ? payload.startTime.slice(11, 16) : payload.startTime);
      const endTime = typeof payload.endTime === "string" && payload.endTime.length === 5 && payload.endTime.includes(":")
        ? payload.endTime
        : (payload.endTime?.slice ? payload.endTime.slice(11, 16) : payload.endTime);
      const data = await bookingService.create({
        tutorId: payload.tutorId,
        organizationId: payload.organizationId,
        date,
        startTime,
        endTime,
        price: payload.price,
      });
      set((state) => ({ bookings: [mapBooking(data), ...state.bookings] }));
      return mapBooking(data);
    } catch (err) {
      const data = err?.data;
      const msg = data?.message || err?.message;
      const errors = data?.errors;
      return { error: msg, errors };
    }
  },

  confirmBooking: async (bookingId) => {
    try {
      await bookingService.confirm(bookingId);
      await get().fetchBookings();
    } catch (e) {
      throw e;
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      await bookingService.cancel(bookingId);
      await get().fetchBookings();
    } catch (e) {
      throw e;
    }
  },

  updateBooking: async (bookingId, updates) => {
    await get().fetchBookings();
  },

  completeBooking: async (bookingId) => {
    try {
      await bookingService.complete(bookingId);
      await get().fetchBookings();
    } catch (e) {
      throw e;
    }
  },

  setReviewGiven: async (bookingId) => {
    await get().fetchBookings();
  },

  setWeeklyAvailability: async (slots) => {
    try {
      // On reçoit des créneaux au format { day, start, end } en minutes.
      const apiSlots = (slots ?? []).map((s) => ({
        day_of_week: s.day,
        start_time: minutesToTime(s.start),
        end_time: minutesToTime(s.end),
      }));

      const data = await availabilityService.saveSlots(apiSlots);
      const mapped = (data ?? []).map((s) => ({
        day: s.day_of_week ?? s.day,
        start: timeToMinutes(s.start_time ?? s.startTime),
        end: timeToMinutes(s.end_time ?? s.endTime),
      }));
      set({ weeklyAvailability: mapped });
    } catch (e) {
      throw e;
    }
  },

  addBlockedDate: async (dateStr) => {
    try {
      await availabilityService.blockDate(dateStr);
      const data = await availabilityService.list();
      set({ blockedDates: data.blocked_dates ?? [] });
    } catch (e) {
      throw e;
    }
  },

  removeBlockedDate: async (dateStr) => {
    try {
      await availabilityService.unblockDate(dateStr);
      const data = await availabilityService.list();
      set({ blockedDates: data.blocked_dates ?? [] });
    } catch (e) {
      throw e;
    }
  },

  getFilteredTutors: (filters = {}) => {
    const { language, subject, priceMin, priceMax, ratingMin } = filters;
    return get().tutors.filter((t) => {
      if (language && !(t.languages || []).includes(language)) return false;
      if (subject && !(t.subjects || []).includes(subject)) return false;
      if (priceMin != null && (t.pricePerHour ?? 0) < priceMin) return false;
      if (priceMax != null && (t.pricePerHour ?? 0) > priceMax) return false;
      if (ratingMin != null && (t.rating ?? 0) < ratingMin) return false;
      return true;
    });
  },
}));

function timeToMinutes(t) {
  if (typeof t !== "string") return 0;
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesToTime(totalMinutes) {
  const total = typeof totalMinutes === "number" ? totalMinutes : 0;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
