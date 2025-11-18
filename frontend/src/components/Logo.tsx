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
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="faircrawl-clip">
          <circle cx="60" cy="60" r="52" />
        </clipPath>
      </defs>

      {/* Outer ring */}
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="#020617"
        stroke="#FFFFFF"
        strokeWidth={6}
      />

      <g clipPath="url(#faircrawl-clip)">
        {/* Base dark circle */}
        <circle cx="60" cy="60" r="52" fill="#0F172A" />

        {/* Blue area above zig-zag */}
        <path
          d="
            M8 8
            H112
            V60
            L96 56
            L78 68
            L60 52
            L42 64
            L24 58
            L8 64
            Z
          "
          fill="#2563EB"
        />

        {/* White zig-zag line (same lower edge as blue area) */}
        <path
          d="
            M8 64
            L24 58
            L42 64
            L60 52
            L78 68
            L96 56
            L112 60
          "
          stroke="#FFFFFF"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Nodes */}
        <circle cx="24" cy="58" r={4.5} fill="#FFFFFF" />
        <circle cx="42" cy="64" r={4.5} fill="#FFFFFF" />
        <circle cx="60" cy="52" r={4.5} fill="#FFFFFF" />
        <circle cx="78" cy="68" r={4.5} fill="#FFFFFF" />
        <circle cx="96" cy="56" r={4.5} fill="#FFFFFF" />
      </g>
    </svg>
  );
};
