import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Smile, Frown, Meh, Heart, Angry, Sun, Moon, CloudRain } from "lucide-react";

interface Mood {
  id: number;
  name: string;
  icon: JSX.Element;
  description: string;
}

interface MoodsTabProps {
  selectedMoods: Mood[];
  onSelectMood: (mood: Mood) => void;
  onUnselectMood: (moodId: number) => void;
}

const availableMoods: Mood[] = [
  { id: 1, name: "Happy", icon: <Smile className="w-6 h-6" />, description: "Upbeat and cheerful" },
  { id: 2, name: "Sad", icon: <Frown className="w-6 h-6" />, description: "Melancholic and emotional" },
  { id: 3, name: "Neutral", icon: <Meh className="w-6 h-6" />, description: "Balanced and calm" },
  { id: 4, name: "Romantic", icon: <Heart className="w-6 h-6" />, description: "Love and passion" },
  { id: 5, name: "Energetic", icon: <Sun className="w-6 h-6" />, description: "Dynamic and lively" },
  { id: 6, name: "Relaxing", icon: <Moon className="w-6 h-6" />, description: "Peaceful and serene" },
  { id: 7, name: "Angry", icon: <Angry className="w-6 h-6" />, description: "Intense and powerful" },
  { id: 8, name: "Gloomy", icon: <CloudRain className="w-6 h-6" />, description: "Dark and atmospheric" },
];

export function MoodsTab({ selectedMoods, onSelectMood, onUnselectMood }: MoodsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMoods = availableMoods.filter((mood) =>
    mood.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mood.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search moods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMoods.map((mood) => {
          const isSelected = selectedMoods.some((m) => m.id === mood.id);
          return (
            <div
              key={mood.id}
              className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 border-primary" : "hover:bg-accent"
              }`}
              onClick={() => {
                if (isSelected) {
                  onUnselectMood(mood.id);
                } else {
                  onSelectMood(mood);
                }
              }}
            >
              {mood.icon}
              <h4 className="mt-2 text-sm font-medium">{mood.name}</h4>
              <p className="text-xs text-gray-500 text-center mt-1">{mood.description}</p>
            </div>
          );
        })}
      </div>

      {selectedMoods.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Selected Moods:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedMoods.map((mood) => (
              <div
                key={mood.id}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                {mood.icon}
                <span>{mood.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnselectMood(mood.id);
                  }}
                  className="hover:text-primary/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}