import toast from 'react-hot-toast';

/**
 * Shows a small "X deleted — Undo" toast instead of asking for confirmation
 * up front. The caller should already have optimistically removed/cleared
 * the item from UI state before calling this.
 *
 * - If the user clicks Undo (or the toast is dismissed via undo), `onUndo()`
 *   runs and the real change is never sent.
 * - If the toast times out without Undo being clicked, `onConfirm()` runs
 *   (this is where the actual delete/clear API call should happen).
 *
 * @param {Object} opts
 * @param {string} opts.message - Text shown before the Undo button.
 * @param {() => void} opts.onUndo - Called if the user undoes the action.
 * @param {() => void | Promise<void>} opts.onConfirm - Called once the undo window passes.
 * @param {number} [opts.duration=4500] - How long the user has to undo, in ms.
 */
export function showUndoToast({ message, onUndo, onConfirm, duration = 4500 }) {
  let settled = false;

  const timer = setTimeout(() => {
    if (settled) return;
    settled = true;
    onConfirm();
  }, duration);

  toast.custom(
    (t) => (
      <div
        className="flex items-center gap-4 bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.15)] pl-4 pr-3 py-2.5 font-typewriter text-sm text-ink transition-all duration-200"
        style={{ opacity: t.visible ? 1 : 0, transform: t.visible ? 'translateY(0)' : 'translateY(-4px)' }}
      >
        <span>{message}</span>
        <button
          onClick={() => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            onUndo();
            toast.dismiss(t.id);
          }}
          className="text-gingham font-typewriter text-sm underline decoration-dashed underline-offset-2 hover:text-[#8f3630] active:scale-95 transition-transform shrink-0"
        >
          Undo
        </button>
      </div>
    ),
    { duration }
  );
}