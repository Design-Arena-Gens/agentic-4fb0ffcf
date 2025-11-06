"use client";

export function LectureControls({ playerRef }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button onClick={() => playerRef.current?.play?.()}>Play</button>
      <button onClick={() => playerRef.current?.pause?.()}>Pause</button>
      <button onClick={() => playerRef.current?.stop?.()}>Stop</button>
      <button onClick={() => playerRef.current?.prev?.()}>Prev</button>
      <button onClick={() => playerRef.current?.next?.()}>Next</button>
    </div>
  );
}
