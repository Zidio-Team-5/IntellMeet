// Tiny WebAudio chimes — no audio assets needed. Used for join ("ding") and
// waiting-room knock ("ting"). Best-effort: silently no-ops if AudioContext is
// unavailable or blocked by autoplay policy (the user is already interacting).
let ctx = null;
const getCtx = () => {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
};

const tone = (freq, startOffset, duration, peak = 0.07) => {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + startOffset;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
};

// Pleasant two-note rising chime for someone joining.
export const playDing = () => { tone(660, 0, 0.18); tone(880, 0.12, 0.22); };

// Brighter single "ting" for a waiting-room knock (host attention).
export const playKnock = () => { tone(988, 0, 0.16, 0.09); tone(1319, 0.1, 0.2, 0.07); };
