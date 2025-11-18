import React from "react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={32}
        height={32}
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="30" cy="30" r="18" fill="#0F172A" />

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

        <circle cx="18" cy="24" r="1.6" fill="#F9FAFB" />
        <circle cx="24" cy="26" r="1.6" fill="#F9FAFB" />
        <circle cx="30" cy="22" r="1.6" fill="#F9FAFB" />
        <circle cx="36" cy="24" r="1.6" fill="#F9FAFB" />
        <circle cx="42" cy="20" r="1.6" fill="#F9FAFB" />

        <path
          d="M12 30
             C18 36 24 38 30 38
             C36 38 42 36 48 30
             L48 34
             C42 40 36 42 30 42
             C24 42 18 40 12 34
             Z"
          fill="#F59E0B"
          opacity="0.22"
        />
      </svg>

      <span className="text-[18px] font-semibold tracking-[0.04em] text-slate-50">
        FairCrawl
      </span>
    </div>
  );
}
