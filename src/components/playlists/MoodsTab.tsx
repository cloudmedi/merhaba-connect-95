import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import axios from "@/lib/axios";

interface Mood {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
}

interface MoodsTabProps {
  selectedMoods: Mood[];
  onSelectMood: (mood: Mood) => void;
  onUnselectMood: (moodId: string) => void;
}

export function MoodsTab({ selectedMoods, onSelectMood, onUnselectMood }: MoodsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [moods, setMoods] = useState<Mood[]>([]);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const { data } = await axios.get('/admin/moods', {
          params: { search: searchQuery }
        });
        setMoods(data || []);
      } catch (error) {
        console.error('Error fetching moods:', error);
      }
    };

    fetchMoods();
  }, [searchQuery]);

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
        {moods.map((mood) => {
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
              {mood.icon && <span className="text-2xl mb-2">{mood.icon}</span>}
              <h4 className="mt-2 text-sm font-medium">{mood.name}</h4>
              {mood.description && (
                <p className="text-xs text-gray-500 text-center mt-1">{mood.description}</p>
              )}
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
                {mood.icon && <span>{mood.icon}</span>}
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