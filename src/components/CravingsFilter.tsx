import { Craving } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CravingsFilterProps {
  onCravingSelect: (craving: Craving) => void;
  selectedCraving?: Craving;
}

const cravingOptions: { value: Craving; label: string; emoji: string; color: string }[] = [
  { value: 'spicy', label: 'Spicy', emoji: '🌶️', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { value: 'sweet', label: 'Sweet', emoji: '🍰', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
  { value: 'sour', label: 'Sour', emoji: '🍋', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'hot', label: 'Hot', emoji: '🔥', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'cold', label: 'Cold', emoji: '❄️', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'cheesy', label: 'Cheesy', emoji: '🧀', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'healthy', label: 'Healthy', emoji: '🥗', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
];

export function CravingsFilter({ onCravingSelect, selectedCraving }: CravingsFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What are you craving?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {cravingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onCravingSelect(option.value)}
              className={`p-4 rounded-lg transition-all ${option.color} ${
                selectedCraving === option.value ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              <div className="text-3xl mb-2">{option.emoji}</div>
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
