import Card from "./Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FeatureShowcase({ features }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="card-hover p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-2xl text-primary">
            <FontAwesomeIcon icon={feature.icon} />
          </div>
          <h3 className="mt-4 text-body font-semibold text-primary">
            {feature.title}
          </h3>
          <p className="mt-2 text-small text-neutral">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}
