import Button from "./Button";
import Card from "./Card";

export default function EmptyState({
  title,
  description,
  action,
  actionLabel,
  onAction,
}) {
  return (
    <Card className="text-center">
      <h3 className="text-h3">{title}</h3>
      <p className="mt-2 text-small text-neutral">{description}</p>
      {action ? (
        <div className="mt-5">{action}</div>
      ) : actionLabel ? (
        <Button className="mt-5" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
