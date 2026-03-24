import Card from "./Card";

export default function FeatureShowcase({ features }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="card-hover p-6">
          <div className="text-4xl">{feature.icon}</div>
          <h3 className="mt-4 text-body font-semibold text-primary">
            {feature.title}
          </h3>
          <p className="mt-2 text-small text-neutral">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}
