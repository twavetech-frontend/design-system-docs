// Plain data module (no 'use client') so the array can be imported by both the
// client TabBar component and server-rendered MDX. Data exports from a
// 'use client' module become opaque client references on the server.
export const defaultTabBarItems = [
  { key: 'home', label: '홈', icon: 'home' },
  { key: 'community', label: '커뮤니티', icon: 'community' },
  { key: 'stage', label: '스테이지', icon: 'stage' },
  { key: 'lounge', label: '라운지', icon: 'lounge' },
  { key: 'my', label: '나', icon: 'my' },
];
