import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import TripCard from '../components/TripCard';

const emojis = ['✈️', '🏖️', '🏔️', '🌸', '🗼', '🎌', '🌊', '🏕️', '🚂', '🌍', '🗺️', '🌅'];

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEmoji, setNewEmoji] = useState('✈️');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await api.getTrips();
      setTrips(data.trips);
    } catch (err) {
      toast(err.message, 'error');
    }
    setLoading(false);
  };

  const createTrip = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const data = await api.createTrip({
        title: newTitle,
        description: newDesc,
        cover_emoji: newEmoji,
      });
      setTrips([data.trip, ...trips]);
      setShowNew(false);
      setNewTitle('');
      setNewDesc('');
      setNewEmoji('✈️');
      toast('Trip created!');
    } catch (err) {
      toast(err.message, 'error');
    }
    setCreating(false);
  };

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi, {user?.username} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your travel diary awaits</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Trip
        </button>
      </div>

      {/* New Trip Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowNew(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Create a new trip</h2>

            <form onSubmit={createTrip} className="space-y-4">
              {/* Emoji picker */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setNewEmoji(e)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        newEmoji === e
                          ? 'bg-brand-100 ring-2 ring-brand-400 scale-110'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Trip name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Japan Spring 2026"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Description (optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="input-field resize-none"
                  placeholder="A brief note about this trip..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 flex items-center justify-center">
                  {creating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trips Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🗺️</span>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No trips yet</h2>
          <p className="text-gray-500 mb-6">Create your first trip and start logging moments</p>
          <button onClick={() => setShowNew(true)} className="btn-primary">
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
