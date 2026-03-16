import { useState } from 'react';
import { api } from '../api/client';
import { useToast } from './Toast';

export default function ShareButton({ trip, onUpdate }) {
  const [toggling, setToggling] = useState(false);
  const toast = useToast();

  const togglePublic = async () => {
    setToggling(true);
    try {
      const data = await api.updateTrip(trip.id, { is_public: !trip.is_public });
      onUpdate(data.trip);
      toast(data.trip.is_public ? 'Trip is now public' : 'Trip is now private');
    } catch (err) {
      toast(err.message, 'error');
    }
    setToggling(false);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/shared/${trip.share_token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied to clipboard!');
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      toast('Link copied!');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePublic}
        disabled={toggling}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          trip.is_public ? 'bg-brand-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            trip.is_public ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm text-gray-600">
        {trip.is_public ? 'Public' : 'Private'}
      </span>

      {trip.is_public && (
        <button
          onClick={copyLink}
          className="btn-ghost text-sm flex items-center gap-1.5 text-brand-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy link
        </button>
      )}
    </div>
  );
}
