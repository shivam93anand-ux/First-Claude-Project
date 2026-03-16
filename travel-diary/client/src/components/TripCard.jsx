import { Link } from 'react-router-dom';

export default function TripCard({ trip }) {
  const dateStr = new Date(trip.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link to={`/trips/${trip.id}`} className="card overflow-hidden group block">
      {trip.cover_photo ? (
        <div className="h-40 overflow-hidden">
          <img
            src={`/uploads/${trip.cover_photo}`}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-brand-100 to-warm-200 flex items-center justify-center">
          <span className="text-5xl">{trip.cover_emoji || '✈️'}</span>
        </div>
      )}

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-800 group-hover:text-brand-600 transition-colors truncate">
          {trip.title}
        </h3>

        {trip.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{trip.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
          <span>{dateStr}</span>
          <span>{trip.moment_count || 0} moment{trip.moment_count !== 1 ? 's' : ''}</span>
        </div>

        {trip.is_public === 1 && (
          <span className="inline-flex items-center gap-1 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Shared
          </span>
        )}
      </div>
    </Link>
  );
}
