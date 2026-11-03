export function BrandLogo({ mark = false, onDark = false, className = '' }: { mark?: boolean; onDark?: boolean; className?: string }) {
  // onDark uses the transparent derivative of the official artwork for dark, image-based surfaces.
  const file = `/logos/nextaura-fit-${mark ? 'mark' : 'full'}${onDark ? '-transparent' : ''}.png`;
  return <img src={file} alt="NextAura FIT" className={`brand-logo ${mark ? 'brand-mark' : 'brand-wordmark'} ${className}`} />;
}
