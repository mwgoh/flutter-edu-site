// 사이트 로고 마크 (src/app/icon.svg와 같은 도안)
export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0468D7" />
          <stop offset="1" stopColor="#042B59" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-gradient)" />
      <rect x="18" y="15" width="30" height="8" rx="4" fill="#fff" />
      <rect x="18" y="15" width="8" height="34" rx="4" fill="#fff" />
      <rect x="18" y="29" width="22" height="8" rx="4" fill="#13B9FD" />
    </svg>
  );
}
