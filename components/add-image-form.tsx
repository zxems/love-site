"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"

export function AddImageForm() {
  const [caption, setCaption] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCaption("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !previewUrl) {
      toast({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive",
      })
      return
    }

    try {
      // Get existing images from localStorage
      const existingImagesJSON = localStorage.getItem("coupleMuseumImages")
      const existingImages = existingImagesJSON ? JSON.parse(existingImagesJSON) : []

      // Create new image object
      const newImage = {
        id: Date.now(),
        src: previewUrl,
        alt: caption || "Memory",
        caption: caption || "Our special moment",
      }

      // Add new image to array
      const updatedImages = [...existingImages, newImage]

      // Save to localStorage
      localStorage.setItem("coupleMuseumImages", JSON.stringify(updatedImages))

      toast({
        title: "Success",
        description: "Your memory has been added to the museum!",
      })

      // Clear form
      clearSelection()

      // Reload the page to show the new image
      window.location.reload()
    } catch (error) {
      console.error("Error saving image:", error)
      toast({
        title: "Error",
        description: "There was a problem adding your memory",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image">Upload Image</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-24 w-full border-dashed border-2 flex flex-col items-center justify-center gap-2"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <Upload className="h-6 w-6 text-gray-500" />
            <span className="text-sm text-gray-500">Click to select an image</span>
          </Button>
          <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      {previewUrl && (
        <div className="relative">
          <div className="aspect-video relative overflow-hidden rounded-md border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          placeholder="describe our memory my love"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#FFD1DF] text-gray-900 hover:bg-[#FFD1DF]/80"
        disabled={!selectedFile}
      >
        Add to Our Museum
      </Button>
    </form>
  )
}
