import { useState } from 'react';
import { api } from '../api/client';
import { useGeolocation } from '../hooks/useGeolocation';
import { useToast } from './Toast';
import StarRating from './StarRating';
import PhotoUpload from './PhotoUpload';

const categories = [
  { value: 'food', label: 'Food', icon: '🍜' },
  { value: 'activity', label: 'Activity', icon: '🎯' },
  { value: 'sightseeing', label: 'Sightseeing', icon: '📸' },
  { value: 'accommodation', label: 'Stay', icon: '🏨' },
  { value: 'transport', label: 'Transport', icon: '🚃' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { value: 'general', label: 'Other', icon: '📍' },
];

export default function MomentForm({ tripId, onCreated, onClose }) {
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState('general');
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { latitude, longitude, loading: geoLoading, error: geoError, getPosition } = useGeolocation();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note.trim() && !photo) {
      toast('Add a note or photo to save this moment', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('note', note);
      if (rating) formData.append('rating', rating);
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      formData.append('location_name', locationName);
      formData.append('category', category);
      if (photo) formData.append('photo', photo);

      const data = await api.createMoment(tripId, formData);
      onCreated(data.moment);
      toast('Moment saved!');
      onClose();
    } catch (err) {
      toast(err.message, 'error');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-semibold text-gray-800">New Moment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <PhotoUpload onFileSelect={setPhoto} />

          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What happened here? How did it feel?"
              rows={3}
              className="input-field resize-none"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    category === cat.value
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Rating</label>
            <StarRating rating={rating} onChange={setRating} size="lg" />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g., Dotonbori Street, Osaka"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={getPosition}
                disabled={geoLoading}
                className="btn-secondary px-3 flex items-center gap-1.5 shrink-0"
                title="Get GPS location"
              >
                {geoLoading ? (
                  <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {latitude && longitude && (
              <p className="text-xs text-green-600 mt-1.5">GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
            )}
            {geoError && <p className="text-xs text-red-500 mt-1.5">{geoError}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Save Moment</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
