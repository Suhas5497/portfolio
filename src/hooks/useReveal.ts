import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades/raises (opacity only, so content stays in the accessibility tree) every `[data-reveal]` element inside `scope` as it scrolls into view.
 * No-op under prefers-reduced-motion (content is simply visible).
 */
export function useReveal(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !scope.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: true },
          ),
      });
      // Hide only what is below the fold so above-the-fold content never flashes.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.88) gsap.set(el, { opacity: 0, y: 28 });
      });
    }, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}
