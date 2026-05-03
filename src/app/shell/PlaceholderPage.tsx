import { ArrowLeft } from "lucide-react";
import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({ eyebrow, title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="p-6 sm:p-8">
        <Badge tone="support">{eyebrow}</Badge>
        <h1 className="mt-5 text-4xl font-black tracking-normal text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{description}</p>
        <div className="mt-8">
          <LinkButton icon={<ArrowLeft className="size-4" />} to="/" variant="primary">
            Back to dashboard
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
