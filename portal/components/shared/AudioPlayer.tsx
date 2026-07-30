'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  duration?: number;
}

export default function AudioPlayer({ url, duration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      const total = audio.duration || duration || 1;
      setProgress((audio.currentTime / total) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (Number(e.target.value) / 100) * (audioRef.current.duration || duration || 0);
    audioRef.current.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!url) {
    return (
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 flex items-center justify-center text-[#71717a] text-sm h-[74px]">
        No recording available
      </div>
    );
  }

  const displayDuration = audioRef.current?.duration || duration || 0;

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 flex items-center gap-4">
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors flex-shrink-0"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>
      
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-[#a1a1aa] w-10 text-right font-medium">
          {formatTime(currentTime)}
        </span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress}
          onChange={handleSeek}
          className="flex-1 h-1.5 bg-[#222222] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full"
        />
        <span className="text-xs text-[#a1a1aa] w-10 font-medium">
          {formatTime(displayDuration)}
        </span>
      </div>
    </div>
  );
}

