import { RectangleHorizontal, RectangleVertical, Square } from "lucide-react";
import { aspectRatios, type AspectRatio } from "../assets/assets";
import type { ReactNode } from "react";

const AspectRatioSelector = ({
  value,
  onChange,
}: {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}) => {
  const iconMap: Record<AspectRatio, ReactNode> = {
    "16:9": <RectangleHorizontal className="size-6" />,
    "1:1": <Square className="size-6" />,
    "9:16": <RectangleVertical className="size-6" />,
  };

  return (
    <div className="space-y-3 dark">
      <label className="block text-sm font-medium text-zinc-200">
        Aspect Ratio
      </label>

      <div className="flex flex-wrap gap-2">
        {aspectRatios.map((ratio) => {
          const selected = value === ratio;

          return (
            <button
              type="button"
              key={ratio}
              onClick={() => onChange(ratio)}
              className={`flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm transition ${
                selected
                  ? "bg-white/10 border-pink-500 text-white"
                  : "hover:bg-white/6 border-white/10 text-zinc-300"
              }`}
            >
              {iconMap[ratio]}
              <span className="tracking-widest">{ratio}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
