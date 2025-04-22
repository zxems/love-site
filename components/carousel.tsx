"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// This will be replaced with actual images added by the user
const defaultImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Memory 1",
    caption: "Our first date",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Memory 2",
    caption: "Summer vacation",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Memory 3",
    caption: "Anniversary celebration",
  },
]

export function Carousel() {
  const [images, setImages] = useState(defaultImages)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Load images from localStorage on component mount
  useEffect(() => {
    const storedImages = localStorage.getItem("coupleMuseumImages")
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages)
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setImages(parsedImages)
        }
      } catch (error) {
        console.error("Error parsing stored images:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length, isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  if (!isLoaded) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>
  }

  if (images.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <p className="mb-4">No images added yet. Add your first memory below!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardContent className="p-0 relative aspect-[16/9]">
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={image.id} className="min-w-full h-full flex-shrink-0 relative">
                  <div className="relative w-full h-full">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority={index === currentIndex}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                    <p className="text-lg font-medium">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute inset-x-0 bottom-1/2 flex justify-between px-4 transform translate-y-1/2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white"
          onClick={goToNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              index === currentIndex ? "bg-[#FFD1DF] border-2 border-pink-400" : "bg-gray-300",
            )}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAutoPlay}
          className="text-sm border-[#FFD1DF] text-gray-700 hover:bg-[#FFD1DF]/20"
        >
          {isAutoPlaying ? "Pause Slideshow" : "Play Slideshow"}
        </Button>
      </div>
    </div>
  )
}
