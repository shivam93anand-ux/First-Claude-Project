import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import MomentCard from '../components/MomentCard';

export default function PublicTrip() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [moments, setMoments] = useState([]);
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrip();
  }, [token]);

  const loadTrip = async () => {
    try {
      const data = await api.getSharedTrip(token);
      setTrip(data.trip);
      setMoments(data.moments);
      setAuthor(data.author);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
        <span className="text-5xl mb-4">🔒</span>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Trip not found</h1>
        <p className="text-gray-500 mb-6">This trip might be private or doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-3 block">{trip.cover_emoji}</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
        {trip.description && (
          <p className="text-gray-500 max-w-lg mx-auto mb-3">{trip.description}</p>
        )}
        <p className="text-sm text-gray-400">
          by <span className="font-medium text-gray-600">{author}</span> · {moments.length} moment{moments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Moments */}
      {moments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No moments captured yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {moments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} readonly />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-12 mt-8 border-t border-gray-100">
        <p className="text-gray-500 text-sm mb-4">Want to create your own travel diary?</p>
        <Link to="/signup" className="btn-primary">
          Start Your Diary
        </Link>
      </div>
    </div>
  );
}
