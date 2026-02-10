import { useState } from "react";
import { X } from "lucide-react";

export default function EditModal({ title, initialValue, onSave, onClose }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSave(value.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Name
            </label>
            <input
              type="text"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-[0_2px_8px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_12px_rgba(249,115,22,0.4)] transition-all duration-150"
            >
             
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}