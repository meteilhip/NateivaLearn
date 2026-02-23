// src/shared/components/availability/TimeRangePicker.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

/**
 * TimeRangePicker
 * ---------------
 * Composant pour sélectionner une plage horaire (début - fin).
 * Utilisé dans DayAvailabilityRow pour chaque plage horaire.
 */
export const TimeRangePicker = ({ start, end, onChange, onRemove }) => {
  const [startHour, setStartHour] = useState(Math.floor(start / 60));
  const [startMin, setStartMin] = useState(start % 60);
  const [endHour, setEndHour] = useState(Math.floor(end / 60));
  const [endMin, setEndMin] = useState(end % 60);

  // Synchroniser avec les props
  useEffect(() => {
    setStartHour(Math.floor(start / 60));
    setStartMin(start % 60);
    setEndHour(Math.floor(end / 60));
    setEndMin(end % 60);
  }, [start, end]);

  const handleStartChange = (hour, min) => {
    const newStart = hour * 60 + min;
    if (newStart < end) {
      onChange(newStart, end);
      setStartHour(hour);
      setStartMin(min);
    }
  };

  const handleEndChange = (hour, min) => {
    const newEnd = hour * 60 + min;
    if (newEnd > start) {
      onChange(start, newEnd);
      setEndHour(hour);
      setEndMin(min);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
      {/* Début */}
      <div className="flex items-center gap-1">
        <select
          value={startHour}
          onChange={(e) => handleStartChange(Number(e.target.value), startMin)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span>:</span>
        <select
          value={startMin}
          onChange={(e) => handleStartChange(startHour, Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value={0}>00</option>
          <option value={30}>30</option>
        </select>
      </div>

      <span className="text-gray-500">-</span>

      {/* Fin */}
      <div className="flex items-center gap-1">
        <select
          value={endHour}
          onChange={(e) => handleEndChange(Number(e.target.value), endMin)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span>:</span>
        <select
          value={endMin}
          onChange={(e) => handleEndChange(endHour, Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value={0}>00</option>
          <option value={30}>30</option>
        </select>
      </div>

      {/* Bouton supprimer */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 text-red-600 hover:text-red-700"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};
