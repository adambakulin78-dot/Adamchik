import React, { useState, useEffect } from 'react';
import { BlueLockCharacter } from '../types';
import { Sparkles, Shield, Flame, Zap, Eye, Trophy, Crown, Compass, Activity, Check } from 'lucide-react';
import { CharacterSvgArt } from '../data/characterAvatars';

interface CharacterAvatarProps {
  character: BlueLockCharacter;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showBadge?: boolean;
  badgeLabel?: string;
  statusGlow?: 'active' | 'completed' | 'idle';
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  size = 'md',
  className = '',
  showBadge = false,
  badgeLabel,
  statusGlow,
}) => {
  const [useExternalPhoto, setUseExternalPhoto] = useState<boolean>(false);
  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);
  const [activeUrl, setActiveUrl] = useState<string>('');

  // Size styling maps
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-13 h-13 md:w-14 md:h-14 rounded-2xl',
    lg: 'w-16 h-16 md:w-20 md:h-20 rounded-2xl',
    xl: 'w-24 h-24 md:w-28 md:h-28 rounded-3xl',
    hero: 'w-32 h-32 md:w-36 md:h-36 rounded-3xl',
  };

  // Pre-test external photo in background without mounting a broken <img> tag
  useEffect(() => {
    // Crucial: reset state immediately on character/avatarUrl change to prevent image mix-ups!
    setPhotoLoaded(false);
    setUseExternalPhoto(false);
    setActiveUrl('');

    let isMounted = true;

    const candidateUrls = [character.avatarUrl, ...(character.fallbackAvatarUrls || [])]
      .filter(url => url && !url.includes('wikia.nocookie.net'));

    if (candidateUrls.length === 0) {
      return;
    }

    const testUrl = candidateUrls[0];
    const testImg = new Image();
    testImg.referrerPolicy = 'no-referrer';

    testImg.onload = () => {
      if (isMounted) {
        setActiveUrl(testUrl);
        setUseExternalPhoto(true);
        setPhotoLoaded(true);
      }
    };

    testImg.onerror = () => {
      if (isMounted) {
        setUseExternalPhoto(false);
        setPhotoLoaded(false);
      }
    };

    testImg.src = testUrl;

    return () => {
      isMounted = false;
    };
  }, [character.id, character.avatarUrl, character.fallbackAvatarUrls]);

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      {/* Outer Hologram Container */}
      <div
        className={`${sizeClasses[size]} overflow-hidden border-2 p-0.5 shadow-xl transition-all duration-300 relative bg-slate-950 flex items-center justify-center`}
        style={{
          borderColor: character.accentColor,
          boxShadow: statusGlow === 'active'
            ? `0 0 24px ${character.accentColor}80, 0 0 8px ${character.accentColor}`
            : statusGlow === 'completed'
            ? `0 0 20px rgba(16, 185, 129, 0.6)`
            : `0 0 16px ${character.glowColor || 'rgba(6, 182, 212, 0.3)'}`,
        }}
      >
        {/* Core Vector Cyber Avatar Artwork (Always 100% reliable) */}
        <div key={character.id} className="w-full h-full rounded-[inherit] overflow-hidden relative">
          <CharacterSvgArt id={character.id} className="w-full h-full transform hover:scale-105 transition-transform duration-300" />

          {/* Optional External Photo overlay ONLY if verified successfully loaded */}
          {useExternalPhoto && photoLoaded && activeUrl && (
            <img
              key={`${character.id}-${activeUrl}`}
              src={activeUrl}
              alt={character.nameRu}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-top rounded-[inherit] transition-opacity duration-300"
            />
          )}

          {/* Subtle holographic scanline & glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit] pointer-events-none" />
        </div>
      </div>

      {/* Optional Character Label Badge */}
      {showBadge && (
        <div
          className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-black border shadow-md flex items-center gap-1 z-20 whitespace-nowrap"
          style={{
            borderColor: character.accentColor,
            color: character.accentColor,
          }}
        >
          {badgeLabel || character.nameRu.split(' ')[0]}
        </div>
      )}
    </div>
  );
};
