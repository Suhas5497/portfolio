import { forwardRef, useState } from 'react';
import { PROFILE } from '@/config/profile';

interface Props {
  className?: string;
  eager?: boolean;
}

/**
 * The one real portrait used across the site. If the image fails to load, a
 * clearly labelled placeholder is shown — never a stand-in photo.
 */
const Portrait = forwardRef<HTMLDivElement, Props>(function Portrait({ className = '', eager = false }, ref) {
  const [failed, setFailed] = useState(false);
  const { portrait } = PROFILE;
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-2 text-center" role="img" aria-label="Portrait placeholder">
          <span className="font-display text-3xl font-bold gradient-text">SD</span>
          <span className="px-3 text-[11px] text-ink-3">Portrait placeholder</span>
        </div>
      ) : (
        <picture>
          <source srcSet={portrait.webp} type="image/webp" />
          <img
            src={portrait.jpg}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            {...{ fetchpriority: eager ? 'high' : 'auto' }}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-[center_18%]"
          />
        </picture>
      )}
    </div>
  );
});

export default Portrait;
