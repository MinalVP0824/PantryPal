import toast from 'react-hot-toast';

export const showUndoToast = ({ message, onUndo, onConfirm, duration = 4000 }) => {
  let undone = false;

  const id = toast.custom(
    (t) => (
      <div className="bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.15)] px-4 py-3 flex items-center gap-4 font-typewriter text-sm text-ink">
        <span>{message}</span>
        <button
          onClick={() => {
            undone = true;
            onUndo();
            toast.dismiss(t.id);
          }}
          className="text-gingham font-bold hover:underline"
        >
          Undo
        </button>
      </div>
    ),
    { duration }
  );

  setTimeout(() => {
    if (!undone) {
      onConfirm();
    }
  }, duration);

  return id;
};