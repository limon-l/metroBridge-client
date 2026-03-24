import Card from "../ui/Card";

export default function MetricCard({ title, value, subtitle }) {
  return (
    <Card className="card-hover p-5">
      <p className="text-small font-medium text-neutral">{title}</p>
      <h3 className="mt-2 text-h2">{value}</h3>
      {subtitle ? (
        <p className="mt-2 text-small text-neutral">{subtitle}</p>
      ) : null}
    </Card>
  );
}
