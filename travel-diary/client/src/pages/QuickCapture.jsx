import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useGeolocation } from '../hooks/useGeolocation';
import { useToast } from '../components/Toast';

export default function QuickCapture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileRef = useRef(null);
  const { latitude, longitude, loading: geoLoading, getPosition } = useGeolocation();

  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auto-grab GPS on mount
  useEffect(() => {
    getPosition();
  }, [getPosition]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!note.trim() && !photo) {
      toast('Add a photo or note to save', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('note', note);
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      formData.append('category', 'general');
      if (photo) formData.append('photo', photo);

      await api.createMoment(id, formData);
      toast('Moment captured!');
      navigate(`/trips/${id}`);
    } catch (err) {
      toast(err.message, 'error');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(`/trips/${id}`)}
          className="text-white/70 hover:text-white transition-colors p-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-white/80 text-sm font-medium">Quick Capture</span>
        <div className="w-10" />
      </div>

      {/* Photo area */}
      <div className="flex-1 flex items-center justify-center px-4">
        {previewUrl ? (
          <div className="relative w-full max-w-sm">
            <img
              src={previewUrl}
              alt="Captured"
              className="w-full rounded-2xl object-cover max-h-[50vh]"
            />
            <button
              onClick={() => {
                setPhoto(null);
                setPreviewUrl(null);
                if (fileRef.current) fileRef.current.value = '';
              }}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full max-w-sm h-64 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors flex flex-col items-center justify-center gap-3"
          >
            <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white/40 text-sm">Tap to add a photo</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhoto}
          className="hidden"
        />
      </div>

      {/* Bottom section */}
      <div className="px-4 pb-6 space-y-3">
        {/* GPS indicator */}
        <div className="flex items-center gap-2 text-xs">
          {geoLoading ? (
            <span className="text-amber-400 flex items-center gap-1">
              <div className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin" />
              Getting location...
            </span>
          ) : latitude ? (
            <span className="text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Location captured
            </span>
          ) : (
            <button onClick={getPosition} className="text-white/40 hover:text-white/60 transition-colors">
              Tap to get location
            </button>
          )}
        </div>

        {/* Note input */}
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Quick note... (optional)"
          className="w-full bg-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
        />

        {/* Save button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Moment
            </>
          )}
        </button>
      </div>
    </div>
  );
}
