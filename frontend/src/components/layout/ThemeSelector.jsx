import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Crown, Shield, Sparkles, Sun, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const THEME_ICONS = {
  njp: Shield,
  white: Sun,
  "luxury-gold": Crown,
  "royal-indigo": Zap,
  "stealth-titanium": Sparkles,
};

export default function ThemeSelector({ compact = false }) {
  const { theme, setTheme, themes, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const CurrentIcon = THEME_ICONS[currentTheme.id] || Sparkles;

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] shadow-sm transition hover:border-[var(--accent-color)] active:scale-95"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex size-5 items-center justify-center rounded-lg bg-[var(--bg-surface)] text-[var(--accent-color)] shadow-2xs">
          <CurrentIcon className="size-3.5" />
        </div>

        {!compact && (
          <div className="hidden text-left md:block">
            <span className="block truncate font-bold text-[11px] leading-none">
              {currentTheme.name}
            </span>
          </div>
        )}

        {/* Mini swatch preview */}
        <div className="hidden items-center gap-0.5 sm:flex">
          {currentTheme.swatches.slice(0, 3).map((color, i) => (
            <span
              key={i}
              className="size-2 rounded-full ring-1 ring-black/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <ChevronDown
          className={`size-3.5 text-[var(--text-muted)] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[var(--accent-color)]" : "group-hover:text-[var(--text-main)]"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 z-50 w-80 animate-in fade-in zoom-in-95 duration-200 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/20">
          {/* Header */}
          <div className="border-b border-[var(--border-color-subtle)] px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-tight text-[var(--text-main)]">
                Select Theme
              </span>
              <span className="rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-color)] border border-[var(--border-color)]">
                {themes.length} Pro Themes
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
              Transform interface colors and visual ambiance
            </p>
          </div>

          {/* Theme List */}
          <div className="mt-1.5 space-y-1.5 max-h-[380px] overflow-y-auto p-1">
            {themes.map((t) => {
              const Icon = THEME_ICONS[t.id] || Sparkles;
              const isSelected = t.id === theme;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition-all ${
                    isSelected
                      ? "border border-[var(--accent-color)] bg-[var(--bg-elevated)] shadow-sm"
                      : "border border-transparent hover:border-[var(--border-color-subtle)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-105 ${
                        isSelected
                          ? "bg-[var(--accent-color)] text-[var(--btn-text)]"
                          : "bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
                      }`}
                      style={{
                        backgroundColor: isSelected ? t.accent : undefined,
                        color: isSelected && !t.isDark ? "#FFFFFF" : undefined,
                      }}
                    >
                      <Icon className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-bold text-[var(--text-main)]">
                          {t.name}
                        </span>
                        {isSelected && (
                          <span className="flex size-4 items-center justify-center rounded-full bg-[var(--accent-color)] text-white">
                            <Check className="size-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[10px] text-[var(--text-muted)]">
                        {t.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Swatches */}
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--bg-surface)] p-1 border border-[var(--border-color-subtle)]">
                    {t.swatches.map((color, idx) => (
                      <span
                        key={idx}
                        className="size-2.5 rounded-full ring-1 ring-black/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
