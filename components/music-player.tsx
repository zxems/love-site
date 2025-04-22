"use client"

import { useState, useEffect, useRef } from "react"
import { Music, Pause, Play, SkipBack, SkipForward, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Sample playlist - replace with your own songs
const defaultPlaylist = [
  {
    id: 1,
    title: "Pistol",
    artist: "Cigarettes After Sex",
    src: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/Pistol - Cigarettes After Sex.mp3` : "/Pistol - Cigarettes After Sex.mp3", // Replace with your actual song path
  },
  {
    id: 2,
    title: "Sweet",
    artist: "Cigarettes After Sex",
    src: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/Sweet - Cigarettes After Sex.mp3` : "/Sweet - Cigarettes After Sex.mp3", // Replace with your actual song path
  },
  {
    id: 3,
    title: "Heavy",
    artist: "The Marias",
    src: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/The Marias - Heavy (Official Audio).mp3` : "/The Marias - Heavy (Official Audio).mp3", // Replace with your actual song path
  },
  {
    id: 4,
    title: "No One Noticed",
    artist: "The Marias",
    src: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/The Marias - No One Noticed (Visualizer).mp3` : "/The Marias - No One Noticed (Visualizer).mp3", // Replace with your actual song path
  },
]

interface Song {
  id: number
  title: string
  artist: string
  src: string
}

interface MusicPlayerProps {
  playlist?: Song[]
}

export function MusicPlayer({ playlist = defaultPlaylist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSong = playlist[currentSongIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      playNextSong()
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSongIndex])

  // Reset audio when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Error playing audio:", err))
      }
    }
  }, [currentSongIndex])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((err) => console.error("Error playing audio:", err))
    }

    setIsPlaying(!isPlaying)
  }

  const playPreviousSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? playlist.length - 1 : prevIndex - 1))
    setCurrentTime(0)
  }

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === playlist.length - 1 ? 0 : prevIndex + 1))
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const selectSong = (index: number) => {
    setCurrentSongIndex(index)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full bg-white border-b border-[#FFD1DF]/50 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Music className="h-5 w-5 text-[#FFD1DF]" />
            <span className="ml-2 text-xs font-medium text-gray-500">Now Playing:</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-sm text-gray-800">{currentSong.title}</span>
            <span className="text-xs text-gray-500 sm:ml-2">by {currentSong.artist}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={playPreviousSong}
              className="h-7 w-7 rounded-full bg-[#FFD1DF]/20 flex items-center justify-center text-gray-800 hover:bg-[#FFD1DF]/40 transition-colors"
              aria-label="Previous song"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="h-8 w-8 rounded-full bg-[#FFD1DF] flex items-center justify-center text-gray-800 hover:bg-[#FFD1DF]/80 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button
              onClick={playNextSong}
              className="h-7 w-7 rounded-full bg-[#FFD1DF]/20 flex items-center justify-center text-gray-800 hover:bg-[#FFD1DF]/40 transition-colors"
              aria-label="Next song"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="hidden md:block text-xs text-gray-600 min-w-[70px] text-center">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-1">-</span>
            <span>{formatTime(duration)}</span>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <List className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Playlist</SheetTitle>
                <SheetDescription>Our favorite songs</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-1">
                {playlist.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => selectSong(index)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      currentSongIndex === index ? "bg-[#FFD1DF]/20 text-gray-900" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="font-medium">{song.title}</div>
                    <div className="text-xs text-gray-500">{song.artist}</div>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <div className="sm:hidden">
            <button
              onClick={togglePlayPause}
              className="h-8 w-8 rounded-full bg-[#FFD1DF] flex items-center justify-center text-gray-800 hover:bg-[#FFD1DF]/80 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="container mx-auto mt-1">
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFD1DF] transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentSong.src} preload="metadata" />
    </div>
  )
}
