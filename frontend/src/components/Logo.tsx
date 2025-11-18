// components/Logo.tsx
import React from "react";

type LogoProps = {
  size?: number;
};

export const Logo: React.FC<LogoProps> = ({ size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Circle background with thin white border */}
      <circle
        cx="30"
        cy="30"
        r="18"
        fill="#0F172A"
        stroke="#F9FAFB"
        strokeWidth="1"
      />

      {/* Crawl band */}
      <path
        d="M12 30
           L18 24
           L24 26
           L30 22
           L36 24
           L42 20
           L48 23
           L48 12
           L12 12
           Z"
        fill="#2563EB"
      />

      {/* Crawl nodes */}
      <circle cx="18" cy="24" r="1.6" fill="#F9FAFB" />
      <circle cx="24" cy="26" r="1.6" fill="#F9FAFB" />
      <circle cx="30" cy="22" r="1.6" fill="#F9FAFB" />
      <circle cx="36" cy="24" r="1.6" fill="#F9FAFB" />
      <circle cx="42" cy="20" r="1.6" fill="#F9FAFB" />
    </svg>
  );
};
