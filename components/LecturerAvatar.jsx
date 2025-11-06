"use client";

import styles from '../app/page.module.css';

export function LecturerAvatar({ speaking }) {
  return (
    <div className={styles.avatar}>
      <svg viewBox="0 0 200 200" role="img" aria-label="Lecturer avatar">
        <defs>
          <clipPath id="headClip">
            <circle cx="100" cy="70" r="40" />
          </clipPath>
        </defs>
        {/* Body */}
        <rect x="40" y="110" width="120" height="70" rx="14" fill="#334155" />
        {/* Head */}
        <circle cx="100" cy="70" r="40" fill="#f1c27d" />
        {/* Hair */}
        <g clipPath="url(#headClip)">
          <ellipse cx="100" cy="50" rx="42" ry="24" fill="#0f172a" />
        </g>
        {/* Eyes */}
        <circle cx="85" cy="70" r="4" fill="#0f172a" />
        <circle cx="115" cy="70" r="4" fill="#0f172a" />
        {/* Mouth */}
        <g>
          {speaking ? (
            <rect x="88" y="85" width="24" height="16" rx="3" fill="#b91c1c">
              <animate attributeName="height" values="6;16;6" dur="0.4s" repeatCount="indefinite" />
            </rect>
          ) : (
            <rect x="88" y="90" width="24" height="6" rx="3" fill="#b91c1c" />
          )}
        </g>
        {/* Pointer stick */}
        <rect x="50" y="150" width="6" height="40" rx="3" fill="#a16207" />
      </svg>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 14, color: 'var(--muted)' }}>
        {speaking ? 'Speaking?' : 'Idle'}
      </div>
    </div>
  );
}
