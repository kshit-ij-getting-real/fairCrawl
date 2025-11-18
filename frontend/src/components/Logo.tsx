// components/Logo.tsx
import React from "react";

type LogoProps = {
  size?: number;
};

export const Logo: React.FC<LogoProps> = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Clip everything to the circular shape */}
        <clipPath id="faircrawl-circle">
          <circle cx="30" cy="30" r="18" />
        </clipPath>
      </defs>

      {/* Outer circle with dark fill and white border */}
      <circle
        cx="30"
        cy="30"
        r="18"
        fill="#020617"
        stroke="#F9FAFB"
        strokeWidth="1.5"
      />

      {/* All interior graphics clipped to the circle */}
      <g clipPath="url(#faircrawl-circle)">
        {/* Background inside the circle */}
        <circle cx="30" cy="30" r="18" fill="#0F172A" />

        {/* Crawl band (keep entirely inside circle coordinates) */}
        <path
          d="
            M14 28
            L20 24
            L26 26
            L32 22
            L38 24
            L44 21
            L48 23
            L48 18
            L14 18
            Z
          "
          fill="#2563EB"
        />

        {/* Crawl nodes */}
        <circle cx="20" cy="24" r="1.8" fill="#F9FAFB" />
        <circle cx="26" cy="26" r="1.8" fill="#F9FAFB" />
        <circle cx="32" cy="22" r="1.8" fill="#F9FAFB" />
        <circle cx="38" cy="24" r="1.8" fill="#F9FAFB" />
        <circle cx="44" cy="21" r="1.8" fill="#F9FAFB" />
      </g>
    </svg>
  );
};
