import Button from "./Button";

export default function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/60 p-4">
      <div className="w-full max-w-lg rounded-card border border-border bg-white p-6 shadow-soft">
        <h3 className="text-h3">{title}</h3>
        {description ? (
          <p className="mt-2 text-small text-neutral">{description}</p>
        ) : null}
        <div className="mt-6">{children}</div>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="cta" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
