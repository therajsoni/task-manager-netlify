import { Dispatch, SetStateAction } from "react";

export default function HoverMessageBar({
  title,
  msg,
  index,
  hoveredIndex,
  setHoveredIndex,
}: {
  title: React.ReactNode;
  msg: string;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: Dispatch<SetStateAction<number | null>>;
}) {
  return (
    <div
      className="relative flex items-center mr-2.5"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* The Eye Icon */}
      <div>{title}</div>

      {/* Tooltip on the left */}
      {hoveredIndex === index && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 shadow">
          {msg}
        </div>
      )}
    </div>
  );
}
