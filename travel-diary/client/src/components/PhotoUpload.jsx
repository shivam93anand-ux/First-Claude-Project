import { useState, useRef } from 'react';

export default function PhotoUpload({ onFileSelect, preview = null }) {
  const [previewUrl, setPreviewUrl] = useState(preview);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Photo must be under 10MB');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const clearPhoto = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="relative cursor-pointer group"
    >
      {previewUrl ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium transition-opacity">
              Change photo
            </span>
          </div>
          <button
            onClick={clearPhoto}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-300 transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50/50">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-400">Add a photo</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
