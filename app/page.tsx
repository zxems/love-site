import { Carousel } from "@/components/carousel"
import { AddImageForm } from "@/components/add-image-form"
import { MusicPlayer } from "@/components/music-player"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MusicPlayer />
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">Austin + Hannah</h1>
            <p className="mt-4 text-xl text-gray-600">🩷🩷🩷</p>
          </header>

          <section className="mb-16">
            <div className="bg-[#FFD1DF] p-8 rounded-xl shadow-lg">
              <Carousel />
            </div>
          </section>

          <section className="mb-16">
            <div className="bg-white p-8 rounded-xl border border-[#FFD1DF]">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Memories</h2>
              <AddImageForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
