"use client";

interface MeasurementGridProps {
  className?: string;
  color?: string;
}

export function MeasurementGrid({ className, color }: MeasurementGridProps) {
  const strokeColor = color || "currentColor";

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none text-foreground ${className || ""}`}
    >
      {/* Light mode grid - higher opacity */}
      <svg
        className="absolute inset-0 w-full h-full opacity-100 dark:opacity-0 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <radialGradient id="fadeGradientLight" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fadeMaskLight">
            <rect width="100%" height="100%" fill="url(#fadeGradientLight)" />
          </mask>
          <pattern
            id="smallGridLight"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.5"
              strokeOpacity="0.12"
            />
          </pattern>

          <pattern
            id="largeGridLight"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#smallGridLight)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </pattern>

          <pattern
            id="diagonalLinesLight"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="200"
              stroke={strokeColor}
              strokeWidth="0.75"
              strokeOpacity="0.1"
              strokeDasharray="15,30"
            />
            <line
              x1="200"
              y1="0"
              x2="0"
              y2="200"
              stroke={strokeColor}
              strokeWidth="0.75"
              strokeOpacity="0.1"
              strokeDasharray="15,30"
            />
          </pattern>

          <pattern
            id="combinedGridLight"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <rect width="200" height="200" fill="url(#largeGridLight)" />
            <rect width="200" height="200" fill="url(#diagonalLinesLight)" />
          </pattern>
        </defs>

        <g mask="url(#fadeMaskLight)">
          <rect width="100%" height="100%" fill="url(#combinedGridLight)" />
        </g>

        <path
          d="M 24 8 L 8 8 L 8 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />

        {Array.from({ length: 20 }).map((_, i) => (
          <g key={`top-light-${i}`}>
            <line
              x1={100 + i * 100}
              y1="0"
              x2={100 + i * 100}
              y2="10"
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity="0.18"
            />
            <text
              x={100 + i * 100}
              y="24"
              fill={strokeColor}
              fillOpacity="0.15"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              {(i + 1) * 10}
            </text>
          </g>
        ))}

        {Array.from({ length: 20 }).map((_, i) => (
          <g key={`left-light-${i}`}>
            <line
              x1="0"
              y1={100 + i * 100}
              x2="10"
              y2={100 + i * 100}
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity="0.18"
            />
            <text
              x="14"
              y={104 + i * 100}
              fill={strokeColor}
              fillOpacity="0.15"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              textAnchor="start"
            >
              {(i + 1) * 10}
            </text>
          </g>
        ))}

        <text
          x="36"
          y="36"
          fill={strokeColor}
          fillOpacity="0.12"
          fontSize="10"
          fontFamily="ui-sans-serif, sans-serif"
          fontWeight="500"
        >
          cm
        </text>

        </svg>

      {/* Dark mode grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-0 dark:opacity-100 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <radialGradient id="fadeGradientDark" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fadeMaskDark">
            <rect width="100%" height="100%" fill="url(#fadeGradientDark)" />
          </mask>
          <pattern
            id="smallGridDark"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
          </pattern>

          <pattern
            id="largeGridDark"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#smallGridDark)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity="0.15"
            />
          </pattern>

          <pattern
            id="diagonalLinesDark"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="200"
              stroke={strokeColor}
              strokeWidth="0.75"
              strokeOpacity="0.06"
              strokeDasharray="15,30"
            />
            <line
              x1="200"
              y1="0"
              x2="0"
              y2="200"
              stroke={strokeColor}
              strokeWidth="0.75"
              strokeOpacity="0.06"
              strokeDasharray="15,30"
            />
          </pattern>

          <pattern
            id="combinedGridDark"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <rect width="200" height="200" fill="url(#largeGridDark)" />
            <rect width="200" height="200" fill="url(#diagonalLinesDark)" />
          </pattern>
        </defs>

        <g mask="url(#fadeMaskDark)">
          <rect width="100%" height="100%" fill="url(#combinedGridDark)" />
        </g>

        <path
          d="M 24 8 L 8 8 L 8 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {Array.from({ length: 20 }).map((_, i) => (
          <g key={`top-dark-${i}`}>
            <line
              x1={100 + i * 100}
              y1="0"
              x2={100 + i * 100}
              y2="10"
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            <text
              x={100 + i * 100}
              y="24"
              fill={strokeColor}
              fillOpacity="0.12"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              {(i + 1) * 10}
            </text>
          </g>
        ))}

        {Array.from({ length: 20 }).map((_, i) => (
          <g key={`left-dark-${i}`}>
            <line
              x1="0"
              y1={100 + i * 100}
              x2="10"
              y2={100 + i * 100}
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            <text
              x="14"
              y={104 + i * 100}
              fill={strokeColor}
              fillOpacity="0.12"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              textAnchor="start"
            >
              {(i + 1) * 10}
            </text>
          </g>
        ))}

        <text
          x="36"
          y="36"
          fill={strokeColor}
          fillOpacity="0.1"
          fontSize="10"
          fontFamily="ui-sans-serif, sans-serif"
          fontWeight="500"
        >
          cm
        </text>

        </svg>
    </div>
  );
}
