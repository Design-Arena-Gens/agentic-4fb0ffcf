"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import styles from '../app/page.module.css';

function supportsSpeech() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export const SlidePlayer = forwardRef(function SlidePlayer(
  { slides, onSpeakingChange },
  ref
) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const utteranceRef = useRef(null);
  const startedAtRef = useRef(0);
  const durationMsRef = useRef(0);
  const timerRef = useRef(null);

  const currentSlide = slides[index];
  const words = useMemo(() => currentSlide?.narration?.split(/\s+/) ?? [], [currentSlide]);

  useImperativeHandle(ref, () => ({
    play,
    pause,
    stop,
    next: () => goTo(index + 1),
    prev: () => goTo(index - 1),
  }));

  useEffect(() => () => stop(), []);

  function goTo(i) {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    setIndex(clamped);
    setCurrentWordIndex(-1);
    setProgress(0);
    if (isPlaying) {
      // re-start speech on slide change
      stop();
      setTimeout(() => play(), 0);
    }
  }

  function play() {
    if (!currentSlide) return;
    if (!supportsSpeech()) {
      // Fallback: just auto-advance with a timer based on length
      const est = Math.max(2500, currentSlide.narration.length * 40);
      startedAtRef.current = Date.now();
      durationMsRef.current = est;
      setIsPlaying(true);
      onSpeakingChange?.(true);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => updateProgress(), 100);
      setTimeout(() => finishUtterance(), est);
      return;
    }

    // Browser TTS
    const u = new SpeechSynthesisUtterance(currentSlide.narration);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.onstart = () => {
      startedAtRef.current = Date.now();
      durationMsRef.current = Math.max(2500, currentSlide.narration.length * 45);
      setIsPlaying(true);
      onSpeakingChange?.(true);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => updateProgress(), 100);
    };
    u.onend = () => finishUtterance();
    u.onerror = () => finishUtterance();
    u.onboundary = (e) => {
      if (e.name === 'word' && typeof e.charIndex === 'number') {
        // Approximate word index by counting spaces before charIndex
        try {
          const before = currentSlide.narration.slice(0, e.charIndex);
          const idx = before.trim().length ? before.trim().split(/\s+/).length : 0;
          setCurrentWordIndex(idx);
        } catch (_) {}
      }
    };
    utteranceRef.current = u;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function pause() {
    if (supportsSpeech()) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
    onSpeakingChange?.(false);
    clearInterval(timerRef.current);
  }

  function stop() {
    if (supportsSpeech()) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    onSpeakingChange?.(false);
    setProgress(0);
    setCurrentWordIndex(-1);
    clearInterval(timerRef.current);
  }

  function finishUtterance() {
    clearInterval(timerRef.current);
    setProgress(100);
    setIsPlaying(false);
    onSpeakingChange?.(false);
    setCurrentWordIndex(-1);
    // Auto advance
    setTimeout(() => {
      if (index < slides.length - 1) {
        setIndex((v) => v + 1);
        setTimeout(() => play(), 200);
      }
    }, 250);
  }

  function updateProgress() {
    const elapsed = Date.now() - startedAtRef.current;
    const total = durationMsRef.current || 1;
    const pct = Math.max(0, Math.min(100, (elapsed / total) * 100));
    setProgress(pct);
  }

  return (
    <div className={styles.slide}>
      <h2 className={styles.slideTitle}>{currentSlide?.title}</h2>
      <ul className={styles.bullets}>
        {currentSlide?.bullets?.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <div className={styles.captionBox} aria-live="polite">
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              background: i === currentWordIndex ? 'rgba(34,197,94,0.25)' : 'transparent',
              padding: i === currentWordIndex ? '2px 4px' : undefined,
              borderRadius: i === currentWordIndex ? 4 : undefined,
              marginRight: 4,
            }}
          >
            {w}
          </span>
        ))}
      </div>

      <div className={styles.progress}>
        <div className={styles.progressInner} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.controls}>
        {!isPlaying ? (
          <button onClick={play}>Play</button>
        ) : (
          <button onClick={pause}>Pause</button>
        )}
        <button onClick={stop}>Stop</button>
        <button onClick={() => goTo(index - 1)} disabled={index === 0}>
          Prev
        </button>
        <button onClick={() => goTo(index + 1)} disabled={index === slides.length - 1}>
          Next
        </button>
        <span style={{ marginLeft: 'auto' }}>
          Slide {index + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
});
