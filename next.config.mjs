/** @type {import('next').NextConfig} */
const nextConfig = {
  // 상위 폴더(홈 디렉터리)의 lockfile을 프로젝트 루트로 오인하지 않도록 고정한다.
  turbopack: {
    root: import.meta.dirname,
  },
  // 강의 본문(.md)은 런타임에 fs로 읽으므로 배포 번들에 포함시킨다.
  outputFileTracingIncludes: {
    '/courses/**': ['./src/content/lessons/**/*.md'],
  },
};

export default nextConfig;
