import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function Header({ onAddTopic }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/90 backdrop-blur-lg border-b transition-all duration-300 ${
        scrolled ? "border-gray-200 shadow-sm" : "border-gray-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://codolio.com/codolio_assets/codolio.svg"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />

          <div>
            <h1 className="text-[0.95rem] font-bold text-gray-900 tracking-tight leading-none">
              Interactive Question Management Sheet
            </h1>
            <p className="text-[0.65rem] text-gray-400 font-mono mt-0.5">
              learning tracker
            </p>
          </div>
        </div>

        <button
          onClick={onAddTopic}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg "
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Topic
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
    </header>
  );
}
