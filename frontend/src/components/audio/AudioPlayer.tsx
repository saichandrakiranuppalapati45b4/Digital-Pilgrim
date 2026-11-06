'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, AlertCircle, Headphones } from 'lucide-react';
import { HeritageAudio } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { formatTime, getLocalizedText } from '../../lib/utils';

interface AudioPlayerProps {
  tracks: HeritageAudio[];
  heritageName?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks, heritageName }) => {
  const { language } = useLanguage();
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[selectedTrackIndex];

  useEffect(() => {
    // Reset playback when switching tracks
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
  }, [selectedTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.error('Audio play error:', err);
          setHasError(true);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border-heritage bg-white p-5 shadow-heritage">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary-maroon font-serif font-bold text-base">
          <Headphones className="h-5 w-5 text-heritage-gold" />
          <span>{language === 'te' ? 'ఆడియో గైడ్ వివరణ' : 'Audio Guide Experience'}</span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-saffron/10 text-saffron border border-saffron/30 uppercase">
          {currentTrack?.language === 'both'
            ? 'Bilingual'
            : currentTrack?.language === 'te'
            ? 'తెలుగు'
            : 'English'}
        </span>
      </div>

      {heritageName && (
        <h4 className="text-sm font-semibold text-charcoal mb-1">{heritageName}</h4>
      )}

      <p className="text-xs text-secondary-text mb-4">
        {getLocalizedText(currentTrack?.title, language)}
      </p>

      {/* Error state */}
      {hasError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {language === 'te'
              ? 'ఆడియో ప్లే చేయడంలో సమస్య ఏర్పడింది. దయచేసి నెట్‌వర్క్ కనెక్షన్ తనిఖీ చేయండి.'
              : 'Unable to stream audio. Please verify your internet connection.'}
          </span>
        </div>
      )}

      {/* Progress scrubber */}
      <div className="space-y-1 mb-4">
        <input
          type="range"
          min="0"
          max={duration || currentTrack?.duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-ivory-subtle rounded-lg appearance-none cursor-pointer accent-primary-maroon"
        />
        <div className="flex justify-between text-[11px] font-mono text-secondary-text">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || currentTrack?.duration || 0)}</span>
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.currentTime = 0;
            setCurrentTime(0);
          }}
          className="p-2 text-secondary-text hover:text-primary-maroon transition-colors"
          title="Restart Track"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-maroon text-white shadow-md hover:bg-primary-hover transition-transform hover:scale-105 active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <button
          onClick={toggleMute}
          className="p-2 text-secondary-text hover:text-primary-maroon transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Multiple tracks selector if available */}
      {tracks.length > 1 && (
        <div className="mt-4 pt-4 border-t border-border-heritage">
          <p className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-2">
            {language === 'te' ? 'ఇతర ఆడియోలు' : 'Track List'}
          </p>
          <div className="space-y-1.5">
            {tracks.map((track, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTrackIndex(idx)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                  selectedTrackIndex === idx
                    ? 'bg-primary-maroon text-white font-medium'
                    : 'text-charcoal hover:bg-ivory-subtle'
                }`}
              >
                <span className="truncate">{getLocalizedText(track.title, language)}</span>
                <span className="text-[10px] opacity-75">{formatTime(track.duration)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
