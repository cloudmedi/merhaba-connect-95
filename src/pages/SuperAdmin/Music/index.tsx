import { MusicContent } from "./MusicContent";

export default function Music() {
  return (
    <main className="p-8 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Music Library</h1>
          <p className="text-sm text-gray-500">Manage your music catalog</p>
        </div>

        <MusicContent />
      </div>
    </main>
  );
}