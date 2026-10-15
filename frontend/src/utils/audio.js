// Web Audio API Synthesizer & Speech Synthesis for Queue Chimes and Announcements
// Zero external asset dependencies - works instantly and reliably in all modern browsers

export const playChime = (type = 'alert') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    if (type === 'call') {
      // Pleasant airport/counter 3-tone chime (F5 -> A5 -> C6)
      const notes = [698.46, 880.00, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.2);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.2);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + index * 0.2 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.2 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.2);
        osc.stop(ctx.currentTime + index * 0.2 + 0.6);
      });
    } else if (type === 'near') {
      // 2-tone urgency chime (A5 -> D6)
      const notes = [880.00, 1174.66];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.15);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + index * 0.15 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.15 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.15);
        osc.stop(ctx.currentTime + index * 0.15 + 0.4);
      });
    } else {
      // Subtle gentle blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    console.warn("Audio playback not permitted or unavailable:", e);
  }
};

/**
 * Natural voice announcement for counter calls (Airport / Banking style)
 * e.g., "Token F-031, please proceed to Counter 2"
 */
export const announceToken = (tokenNumber, counterNumber) => {
  // First play the 3-tone chime
  playChime('call');

  // Then speak after 700ms chime delay
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    setTimeout(() => {
      try {
        window.speechSynthesis.cancel(); // clear previous queue

        // Formulate spoken token (e.g. "F 0 3 1" so letter isn't rushed)
        const parts = tokenNumber.split('-');
        const spokenToken = parts.length === 2 
          ? `${parts[0].split('').join(' ')}, ${parts[1]}` 
          : tokenNumber;

        const phrase = `Token ${spokenToken}, please proceed to Counter ${counterNumber}`;
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.lang = 'en-US';

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech synthesis error:", err);
      }
    }, 650);
  }
};
