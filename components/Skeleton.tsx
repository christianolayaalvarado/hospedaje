export default function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-gray-200
        rounded-xl
        ${className}
      `}
    >
      <div
        className="
          absolute inset-0
          -translate-x-full
          animate-[shimmer_2s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/60
          to-transparent
        "
      />
    </div>
  );
}