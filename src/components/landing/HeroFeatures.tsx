import { Play } from "lucide-react";

const features = [
  { text: "10.000+ Şarkı" },
  { text: "Haftalık Güncellemeler" },
  { text: "Sektöre Özel" },
  { text: "7/24 Destek" },
];

export function HeroFeatures() {
  return (
    <div className="grid grid-cols-2 gap-6 pt-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-3 h-3 text-[#6E59A5]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          </div>
          <span className="text-gray-700">{feature.text}</span>
        </div>
      ))}
    </div>
  );
}