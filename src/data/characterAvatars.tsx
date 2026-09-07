import React from 'react';

export interface CharacterSvgProps {
  id: string;
  size?: number | string;
  className?: string;
  glow?: boolean;
}

/**
 * High-tech Blue Lock Cyber Holographic Avatar SVGs.
 * Designed with Metavision grids, character badges, glowing ocular nodes, and dynamic team motifs.
 * Zero network dependencies, zero 403 errors, 100% offline reliability.
 */
export const CharacterSvgArt: React.FC<CharacterSvgProps> = ({
  id,
  size = '100%',
  className = '',
  glow = true,
}) => {
  switch (id) {
    case 'ego':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ego-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#020617" />
              <stop offset="0.5" stopColor="#082f49" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="ego-glow" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
            <radialGradient id="ego-glasses" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
            </radialGradient>
            <pattern id="ego-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
          </defs>

          {/* Background & Cyber Grid */}
          <rect width="120" height="120" rx="16" fill="url(#ego-bg)" />
          <rect width="120" height="120" rx="16" fill="url(#ego-grid)" />

          {/* Metavision scanning circles */}
          <circle cx="60" cy="55" r="45" stroke="#06b6d4" strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity="0.4" />
          <circle cx="60" cy="55" r="32" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.5" />

          {/* Silhouette - Jinpachi Ego Head & Hair */}
          {/* Turtleneck Collar */}
          <path d="M 42 88 L 78 88 L 84 120 L 36 120 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 44 88 L 76 88 L 74 98 L 46 98 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1" />

          {/* Chin & Jaw */}
          <path d="M 45 54 L 47 76 L 60 84 L 73 76 L 75 54 Z" fill="#f8fafc" opacity="0.95" />

          {/* Messy Black Anime Hair */}
          <path
            d="M 32 48 C 30 28, 50 16, 60 16 C 72 16, 90 28, 88 48 C 86 58, 88 66, 90 70 L 82 62 C 80 50, 78 36, 60 34 C 42 36, 40 50, 38 62 L 30 70 C 32 66, 34 58, 32 48 Z"
            fill="#020617"
            stroke="#06b6d4"
            strokeWidth="0.8"
          />
          {/* Hair bangs */}
          <path d="M 38 42 L 46 54 L 50 44 L 60 56 L 68 44 L 74 54 L 80 42" fill="#020617" />

          {/* Glowing Glasses */}
          {/* Left Lens */}
          <circle cx="49" cy="56" r="10" fill="url(#ego-glasses)" stroke="#e0f2fe" strokeWidth="1.5" />
          <circle cx="49" cy="56" r="5" fill="#06b6d4" opacity="0.8" />
          <line x1="43" y1="52" x2="55" y2="60" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />

          {/* Right Lens */}
          <circle cx="71" cy="56" r="10" fill="url(#ego-glasses)" stroke="#e0f2fe" strokeWidth="1.5" />
          <circle cx="71" cy="56" r="5" fill="#06b6d4" opacity="0.8" />
          <line x1="65" y1="52" x2="77" y2="60" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />

          {/* Bridge & Temple arms */}
          <path d="M 59 56 L 61 56" stroke="#e0f2fe" strokeWidth="2" />
          <path d="M 39 56 L 35 52" stroke="#e0f2fe" strokeWidth="1.5" />
          <path d="M 81 56 L 85 52" stroke="#e0f2fe" strokeWidth="1.5" />

          {/* Smirk & Nose */}
          <path d="M 60 62 L 60 66 L 58 68" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
          <path d="M 54 74 Q 60 77 66 74" stroke="#020617" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Kanji Emblem Banner */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#06b6d4" strokeWidth="1" />
          <text x="60" y="110" fill="#22d3ee" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            絵心 • EGO
          </text>
        </svg>
      );

    case 'isagi':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="isagi-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#022c22" />
              <stop offset="0.5" stopColor="#064e3b" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="isagi-hair" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e293b" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
            <radialGradient id="metavision-eye" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="120" height="120" rx="16" fill="url(#isagi-bg)" />

          {/* Metavision Hexagonal Spatial Grid */}
          <polygon points="60,20 85,34 85,64 60,78 35,64 35,34" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.4" fill="none" />
          <polygon points="60,5 105,30 105,80 60,105 15,80 15,30" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />

          {/* Puzzle Pieces Effect */}
          <rect x="18" y="24" width="12" height="12" rx="2" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" fill="#064e3b" fillOpacity="0.3" transform="rotate(15 24 30)" />
          <rect x="88" y="65" width="14" height="14" rx="2" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" fill="#064e3b" fillOpacity="0.3" transform="rotate(-20 95 72)" />

          {/* Isagi Body & Bodysuit */}
          <path d="M 38 86 L 82 86 L 94 120 L 26 120 Z" fill="#020617" stroke="#10b981" strokeWidth="1" />
          <path d="M 52 86 L 68 86 L 70 120 L 50 120 Z" fill="#065f46" />
          {/* Number 11 */}
          <text x="60" y="112" fill="#34d399" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            11
          </text>

          {/* Face */}
          <path d="M 43 52 L 46 75 L 60 84 L 74 75 L 77 52 Z" fill="#f8fafc" />

          {/* Dark Blue-Black Hair with Isagi Spikes & Sprout */}
          <path
            d="M 34 50 C 30 26, 48 14, 60 14 C 74 14, 90 26, 86 50 C 84 58, 86 64, 88 66 L 80 60 C 78 48, 76 34, 60 32 C 44 34, 42 48, 40 60 L 32 66 C 34 64, 36 58, 34 50 Z"
            fill="url(#isagi-hair)"
            stroke="#10b981"
            strokeWidth="0.8"
          />
          {/* Isagi's iconic ahoge / sprout */}
          <path d="M 58 14 Q 52 4 48 6 Q 54 10 59 14" fill="#10b981" />
          <path d="M 60 14 Q 66 2 70 4 Q 64 9 61 14" fill="#34d399" />

          {/* Bangs */}
          <polygon points="40,38 46,52 50,42" fill="#0f172a" />
          <polygon points="48,42 56,56 60,44" fill="#0f172a" />
          <polygon points="58,44 64,56 70,42" fill="#0f172a" />
          <polygon points="68,42 74,52 80,38" fill="#0f172a" />

          {/* Intense Eyes with Metavision Grid Glow */}
          {/* Left Eye */}
          <path d="M 44 55 Q 50 51 54 55 Q 50 58 44 55 Z" fill="#ffffff" />
          <circle cx="49" cy="55" r="3.5" fill="url(#metavision-eye)" />
          <circle cx="49" cy="55" r="1.5" fill="#a7f3d0" />
          {/* Metavision cross-reticle in pupil */}
          <line x1="47" y1="55" x2="51" y2="55" stroke="#ffffff" strokeWidth="0.6" />
          <line x1="49" y1="53" x2="49" y2="57" stroke="#ffffff" strokeWidth="0.6" />

          {/* Right Eye */}
          <path d="M 66 55 Q 70 51 76 55 Q 70 58 66 55 Z" fill="#ffffff" />
          <circle cx="71" cy="55" r="3.5" fill="url(#metavision-eye)" />
          <circle cx="71" cy="55" r="1.5" fill="#a7f3d0" />
          {/* Metavision cross-reticle in pupil */}
          <line x1="69" y1="55" x2="73" y2="55" stroke="#ffffff" strokeWidth="0.6" />
          <line x1="71" y1="53" x2="71" y2="57" stroke="#ffffff" strokeWidth="0.6" />

          {/* Eyebrows */}
          <path d="M 43 50 L 54 52" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 77 50 L 66 52" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />

          {/* Kanji Badge */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#10b981" strokeWidth="1" />
          <text x="60" y="110" fill="#34d399" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            潔 • ISAGI
          </text>
        </svg>
      );

    case 'bachira':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bachira-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#451a03" />
              <stop offset="0.5" stopColor="#78350f" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>

          <rect width="120" height="120" rx="16" fill="url(#bachira-bg)" />

          {/* Yellow Monster Aura Flames */}
          <path d="M 20 40 Q 30 15 45 30 Q 60 5 75 25 Q 90 10 100 40" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.6" />
          <circle cx="60" cy="55" r="42" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.3" />

          {/* Bodysuit #8 */}
          <path d="M 38 86 L 82 86 L 94 120 L 26 120 Z" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
          <text x="60" y="112" fill="#fbbf24" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            8
          </text>

          {/* Face */}
          <path d="M 43 52 L 46 75 L 60 84 L 74 75 L 77 52 Z" fill="#f8fafc" />

          {/* Black Bob Hair with Yellow Underdye Tips */}
          <path
            d="M 32 48 C 30 24, 48 14, 60 14 C 72 14, 90 24, 88 48 C 88 64, 84 72, 84 72 L 78 62 C 78 48, 76 34, 60 32 C 44 34, 42 48, 42 62 L 36 72 C 36 72, 32 64, 32 48 Z"
            fill="#0f172a"
          />
          {/* Signature Yellow highlights at tips */}
          <path d="M 34 56 L 40 68 L 44 60" fill="#f59e0b" />
          <path d="M 86 56 L 80 68 L 76 60" fill="#f59e0b" />

          {/* Joyful Monster Eyes */}
          <circle cx="49" cy="54" r="4.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <circle cx="49" cy="54" r="2" fill="#020617" />
          <circle cx="50" cy="53" r="1" fill="#ffffff" />

          <circle cx="71" cy="54" r="4.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <circle cx="71" cy="54" r="2" fill="#020617" />
          <circle cx="72" cy="53" r="1" fill="#ffffff" />

          {/* Playful Monster Tongue / Grin */}
          <path d="M 52 68 Q 60 76 68 68" stroke="#020617" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 58 71 Q 62 78 66 72" fill="#f43f5e" />

          {/* Kanji Badge */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
          <text x="60" y="110" fill="#fbbf24" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            蜂楽 • BACHIRA
          </text>
        </svg>
      );

    case 'rin':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rin-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#082f49" />
              <stop offset="0.5" stopColor="#0c4a6e" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>

          <rect width="120" height="120" rx="16" fill="url(#rin-bg)" />

          {/* Destruction Marionette Strings & Lasers */}
          <line x1="20" y1="10" x2="50" y2="70" stroke="#0284c7" strokeWidth="1" opacity="0.6" />
          <line x1="100" y1="10" x2="70" y2="70" stroke="#0284c7" strokeWidth="1" opacity="0.6" />
          <circle cx="60" cy="55" r="44" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

          {/* Bodysuit #10 */}
          <path d="M 38 86 L 82 86 L 94 120 L 26 120 Z" fill="#020617" stroke="#0284c7" strokeWidth="1" />
          <text x="60" y="112" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            10
          </text>

          {/* Face */}
          <path d="M 43 52 L 46 75 L 60 84 L 74 75 L 77 52 Z" fill="#f8fafc" />

          {/* Dark Teal / Black Hair with iconic long middle parting */}
          <path
            d="M 33 48 C 30 24, 46 14, 60 14 C 74 14, 90 24, 87 48 C 86 64, 85 72, 85 72 L 78 62 C 78 48, 76 34, 60 32 C 44 34, 42 48, 42 62 L 35 72 C 35 72, 33 64, 33 48 Z"
            fill="#042f2e"
            stroke="#0d9488"
            strokeWidth="0.5"
          />
          {/* Long middle bangs */}
          <polygon points="56,32 59,62 62,32" fill="#042f2e" />
          <polygon points="44,36 50,56 54,40" fill="#042f2e" />
          <polygon points="66,40 70,56 76,36" fill="#042f2e" />

          {/* Cold Piercing Teal Eyes with Bottom Eyelashes */}
          <path d="M 43 54 L 54 53 L 52 57 L 44 57 Z" fill="#ffffff" />
          <circle cx="49" cy="55" r="3" fill="#0d9488" />
          <circle cx="49" cy="55" r="1.5" fill="#020617" />
          {/* Bottom eyelashes */}
          <line x1="45" y1="58" x2="44" y2="60" stroke="#020617" strokeWidth="1" />
          <line x1="49" y1="58" x2="49" y2="61" stroke="#020617" strokeWidth="1" />

          <path d="M 77 54 L 66 53 L 68 57 L 76 57 Z" fill="#ffffff" />
          <circle cx="71" cy="55" r="3" fill="#0d9488" />
          <circle cx="71" cy="55" r="1.5" fill="#020617" />
          {/* Bottom eyelashes */}
          <line x1="75" y1="58" x2="76" y2="60" stroke="#020617" strokeWidth="1" />
          <line x1="71" y1="58" x2="71" y2="61" stroke="#020617" strokeWidth="1" />

          {/* Intense Frown */}
          <path d="M 42 48 L 54 51" stroke="#020617" strokeWidth="2" strokeLinecap="round" />
          <path d="M 78 48 L 66 51" stroke="#020617" strokeWidth="2" strokeLinecap="round" />

          {/* Kanji Badge */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#0284c7" strokeWidth="1" />
          <text x="60" y="110" fill="#38bdf8" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            凛 • RIN
          </text>
        </svg>
      );

    case 'nagi':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nagi-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e293b" />
              <stop offset="0.5" stopColor="#334155" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>

          <rect width="120" height="120" rx="16" fill="url(#nagi-bg)" />

          {/* Soft Kinetic Waves / Zero-Gravity Flow */}
          <circle cx="60" cy="55" r="44" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
          <circle cx="60" cy="55" r="28" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />

          {/* Bodysuit #7 */}
          <path d="M 38 86 L 82 86 L 94 120 L 26 120 Z" fill="#020617" stroke="#94a3b8" strokeWidth="1" />
          <text x="60" y="112" fill="#cbd5e1" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            7
          </text>

          {/* Face */}
          <path d="M 43 52 L 46 75 L 60 84 L 74 75 L 77 52 Z" fill="#f8fafc" />

          {/* Fluffy White / Silver Hair */}
          <path
            d="M 30 46 C 26 22, 46 12, 60 12 C 74 12, 94 22, 90 46 C 88 60, 86 68, 86 68 L 78 58 C 78 44, 76 28, 60 26 C 44 28, 42 44, 42 58 L 34 68 C 34 68, 32 60, 30 46 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />
          {/* Messy spikes on top */}
          <polygon points="45,20 50,8 55,20" fill="#f1f5f9" />
          <polygon points="55,18 62,6 68,18" fill="#f1f5f9" />
          <polygon points="68,20 74,10 78,22" fill="#f1f5f9" />

          {/* Sleepy / Genius Eyes */}
          <path d="M 44 56 Q 50 54 54 56" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="49" cy="57" r="2.5" fill="#475569" />

          <path d="M 66 56 Q 70 54 76 56" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="71" cy="57" r="2.5" fill="#475569" />

          {/* Kanji Badge */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#94a3b8" strokeWidth="1" />
          <text x="60" y="110" fill="#e2e8f0" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            凪 • NAGI
          </text>
        </svg>
      );

    case 'chigiri':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="chigiri-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4c0519" />
              <stop offset="0.5" stopColor="#881337" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>

          <rect width="120" height="120" rx="16" fill="url(#chigiri-bg)" />

          {/* Red Panther Supersonic Speed Lines */}
          <line x1="10" y1="40" x2="110" y2="40" stroke="#f43f5e" strokeWidth="1" strokeDasharray="8 4" opacity="0.6" />
          <line x1="15" y1="65" x2="105" y2="65" stroke="#fb7185" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.4" />

          {/* Bodysuit #4 */}
          <path d="M 38 86 L 82 86 L 94 120 L 26 120 Z" fill="#020617" stroke="#f43f5e" strokeWidth="1" />
          <text x="60" y="112" fill="#fb7185" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            4
          </text>

          {/* Face */}
          <path d="M 43 52 L 46 75 L 60 84 L 74 75 L 77 52 Z" fill="#f8fafc" />

          {/* Long Reddish-Pink Flowing Hair (Left side braid/drape) */}
          <path
            d="M 32 46 C 30 20, 48 12, 60 12 C 72 12, 90 20, 88 46 C 88 64, 88 88, 88 88 L 78 72 C 78 48, 76 28, 60 26 C 44 28, 42 48, 42 72 L 32 88 Z"
            fill="#e11d48"
          />
          {/* Pink highlights */}
          <path d="M 40 30 L 46 64 L 42 45" stroke="#fda4af" strokeWidth="1" />
          <path d="M 80 30 L 74 64 L 78 45" stroke="#fda4af" strokeWidth="1" />

          {/* Red Panther Eyes */}
          <circle cx="49" cy="54" r="3.5" fill="#e11d48" />
          <circle cx="49" cy="54" r="1.5" fill="#020617" />
          <circle cx="50" cy="53" r="0.8" fill="#ffffff" />

          <circle cx="71" cy="54" r="3.5" fill="#e11d48" />
          <circle cx="71" cy="54" r="1.5" fill="#020617" />
          <circle cx="72" cy="53" r="0.8" fill="#ffffff" />

          {/* Kanji Badge */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#f43f5e" strokeWidth="1" />
          <text x="60" y="110" fill="#fb7185" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            千切 • CHIGIRI
          </text>
        </svg>
      );

    case 'barou':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="barou-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b0764" />
              <stop offset="0.5" stopColor="#581c87" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>

          <rect width="120" height="120" rx="16" fill="url(#barou-bg)" />

          {/* Royal Violet King's Crown & Lightning */}
          <path d="M 44 26 L 50 14 L 60 22 L 70 14 L 76 26 Z" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1" />

          {/* Bodysuit #13 */}
          <path d="M 38 86 L 82 86 L 94 120 L 26 120 Z" fill="#020617" stroke="#a855f7" strokeWidth="1" />
          <text x="60" y="112" fill="#c084fc" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            13
          </text>

          {/* Face */}
          <path d="M 43 52 L 46 75 L 60 84 L 74 75 L 77 52 Z" fill="#f8fafc" />

          {/* Spiky Tall Black Hair */}
          <polygon points="34,48 40,24 48,46" fill="#0f172a" />
          <polygon points="46,46 54,16 62,46" fill="#0f172a" />
          <polygon points="60,46 68,18 76,46" fill="#0f172a" />
          <polygon points="74,46 80,26 86,48" fill="#0f172a" />

          {/* Ruthless King Red Eyes */}
          <circle cx="49" cy="55" r="3.5" fill="#dc2626" />
          <circle cx="49" cy="55" r="1.5" fill="#020617" />

          <circle cx="71" cy="55" r="3.5" fill="#dc2626" />
          <circle cx="71" cy="55" r="1.5" fill="#020617" />

          {/* Kanji Badge */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#a855f7" strokeWidth="1" />
          <text x="60" y="110" fill="#c084fc" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            馬狼 • BAROU
          </text>
        </svg>
      );

    case 'kaiser':
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="kaiser-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0c4a6e" />
              <stop offset="0.5" stopColor="#0284c7" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>

          <rect width="120" height="120" rx="16" fill="url(#kaiser-bg)" />

          {/* Blue Rose Petals & Emperor Crown */}
          <circle cx="60" cy="55" r="44" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
          <path d="M 46 22 L 52 12 L 60 18 L 68 12 L 74 22 Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />

          {/* Bodysuit #10 */}
          <path d="M 38 86 L 82 86 L 94 120 L 26 120 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
          <text x="60" y="112" fill="#7dd3fc" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            10
          </text>

          {/* Face */}
          <path d="M 43 52 L 46 75 L 60 84 L 74 75 L 77 52 Z" fill="#f8fafc" />

          {/* Blonde Hair with Blue Strands & Rose Neck Tattoo */}
          <path
            d="M 32 46 C 30 20, 48 12, 60 12 C 72 12, 90 20, 88 46 C 88 64, 86 76, 86 76 L 78 62 C 78 48, 76 28, 60 26 C 44 28, 42 48, 42 62 L 34 76 Z"
            fill="#fef08a"
          />
          {/* Blue streaks */}
          <path d="M 42 34 L 46 62" stroke="#0284c7" strokeWidth="2.5" />
          <path d="M 78 34 L 74 62" stroke="#0284c7" strokeWidth="2.5" />

          {/* Piercing Emperor Blue Eyes */}
          <circle cx="49" cy="54" r="3.5" fill="#0284c7" />
          <circle cx="49" cy="54" r="1.5" fill="#ffffff" />

          <circle cx="71" cy="54" r="3.5" fill="#0284c7" />
          <circle cx="71" cy="54" r="1.5" fill="#ffffff" />

          {/* Smug Smirk */}
          <path d="M 54 68 Q 62 73 66 69" stroke="#020617" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Kanji Badge */}
          <rect x="36" y="98" width="48" height="16" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
          <text x="60" y="110" fill="#7dd3fc" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
            帝王 • KAISER
          </text>
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="120" height="120" rx="16" fill="#020617" />
          <circle cx="60" cy="60" r="45" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" />
          <text x="60" y="66" fill="#22d3ee" fontSize="16" fontWeight="900" textAnchor="middle">
            BLUE LOCK
          </text>
        </svg>
      );
  }
};
