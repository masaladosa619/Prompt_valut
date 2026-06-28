import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import './ScrambledText.css';

gsap.registerPlugin(ScrambleTextPlugin);

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);
  // refs for each character span
  const charsRef = useRef([]);

  // split children string into characters (preserve spaces)
  const chars = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((c, i) => (
      <span
        key={i}
        className="char"
        ref={el => (charsRef.current[i] = el)}
        data-content={c}
      >
        {c}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    if (!rootRef.current) return;
    // ensure each char has inline-block display and data attribute
    charsRef.current.forEach(el => {
      if (!el) return;
      gsap.set(el, { display: 'inline-block' });
    });

    const handleMove = e => {
      charsRef.current.forEach(el => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const progress = 1 - dist / radius;
          gsap.to(el, {
            overwrite: true,
            duration: duration * progress,
            scrambleText: {
              text: el.dataset.content || '',
              chars: scrambleChars,
              speed
            },
            ease: 'none'
          });
        }
      });
    };

    const el = rootRef.current;
    el.addEventListener('pointermove', handleMove);
    return () => {
      el.removeEventListener('pointermove', handleMove);
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{chars}</p>
    </div>
  );
};

export default ScrambledText;
