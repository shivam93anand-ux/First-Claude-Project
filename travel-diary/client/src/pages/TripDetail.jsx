import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../components/Toast';
import MomentCard from '../components/MomentCard';
import MomentForm from '../components/MomentForm';
import ShareButton from '../components/ShareButton';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [trip, setTrip] = useState(null);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const data = await api.getTrip(id);
      setTrip(data.trip);
      setMoments(data.moments);
    } catch (err) {
      toast(err.message, 'error');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleMomentCreated = (moment) => {
    setMoments([...moments, moment]);
  };

  const handleDeleteMoment = async (momentId) => {
    try {
      await api.deleteMoment(momentId);
      setMoments(moments.filter((m) => m.id !== momentId));
      toast('Moment deleted');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleDeleteTrip = async () => {
    setDeleting(true);
    try {
      await api.deleteTrip(id);
      toast('Trip deleted');
      navigate('/dashboard');
    } catch (err) {
      toast(err.message, 'error');
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to trips
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{trip.cover_emoji}</span>
              <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
            </div>
            {trip.description && (
              <p className="text-gray-500 mb-3">{trip.description}</p>
            )}
            <ShareButton trip={trip} onUpdate={setTrip} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/trips/${id}/capture`}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Quick Capture</span>
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="btn-ghost text-gray-400 hover:text-red-500 p-2.5"
              title="Delete trip"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Moments */}
      {moments.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">📸</span>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No moments yet</h2>
          <p className="text-gray-500 mb-6">Start capturing your travel experiences</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add a Moment
            </button>
            <Link to={`/trips/${id}/capture`} className="btn-secondary">
              Quick Capture
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {moments.length} moment{moments.length !== 1 ? 's' : ''}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {moments.map((moment) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                onDelete={handleDeleteMoment}
              />
            ))}
          </div>
        </div>
      )}

      {/* FAB for adding moment */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg shadow-brand-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Moment form modal */}
      {showForm && (
        <MomentForm
          tripId={id}
          onCreated={handleMomentCreated}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDelete(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <span className="text-4xl mb-3 block">🗑️</span>
            <h3 className="font-semibold text-gray-900 mb-2">Delete this trip?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete "{trip.title}" and all its moments. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleDeleteTrip}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center"
              >
                {deleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
