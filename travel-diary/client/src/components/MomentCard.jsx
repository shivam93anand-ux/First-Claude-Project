import StarRating from './StarRating';

const categoryIcons = {
  food: '🍜',
  activity: '🎯',
  sightseeing: '📸',
  accommodation: '🏨',
  transport: '🚃',
  shopping: '🛍️',
  nightlife: '🌙',
  general: '📍',
};

export default function MomentCard({ moment, onDelete, readonly = false }) {
  const timeStr = new Date(moment.captured_at).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card overflow-hidden fade-in">
      {moment.photo_path && (
        <div className="h-52 overflow-hidden">
          <img
            src={`/uploads/${moment.photo_path}`}
            alt={moment.note || 'Moment photo'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{categoryIcons[moment.category] || categoryIcons.general}</span>
            <span className="capitalize">{moment.category}</span>
            <span className="text-gray-300">·</span>
            <span>{timeStr}</span>
          </div>

          {!readonly && onDelete && (
            <button
              onClick={() => onDelete(moment.id)}
              className="text-gray-300 hover:text-red-400 transition-colors p-1"
              title="Delete moment"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {moment.note && (
          <p className="text-gray-700 text-[15px] leading-relaxed">{moment.note}</p>
        )}

        {moment.rating && (
          <StarRating rating={moment.rating} readonly size="sm" />
        )}

        {moment.location_name && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{moment.location_name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
