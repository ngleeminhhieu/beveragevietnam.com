// Type each word, pause, then backspace and repeat through data-words.
// Keep the requested text cycle running even with reduced motion enabled;
// the caret's blink still follows that preference in CSS.
const TICK_MS = 200;
const HOLD_MS = 2000;

export default function TypeCycleModule() {
  const targets = [...document.querySelectorAll(".typeCycleJS")];
  if (!targets.length) return;

  targets.forEach((target) => {
    const words = (target.dataset.words || "")
      .split("|")
      .map((word) => word.trim())
      .filter(Boolean);
    if (!words.length) return;

    // Persian joins its letters and carries ZWNJ inside words like
    // "نوشیدنی‌های", so step by code point rather than by UTF-16 unit.
    const letters = words.map((word) => [...word]);

    let wordIndex = 0;
    let count = 0;
    let erasing = false;

    const tick = () => {
      const word = letters[wordIndex];

      if (erasing) {
        count -= 1;
        target.textContent = word.slice(0, count).join("");

        if (count <= 0) {
          erasing = false;
          wordIndex = (wordIndex + 1) % letters.length;
        }
      } else {
        count += 1;
        target.textContent = word.slice(0, count).join("");

        // Whole word on screen: sit on it before backspacing.
        if (count >= word.length) {
          erasing = true;
          window.setTimeout(tick, HOLD_MS);
          return;
        }
      }

      window.setTimeout(tick, TICK_MS);
    };

    tick();
  });
}
