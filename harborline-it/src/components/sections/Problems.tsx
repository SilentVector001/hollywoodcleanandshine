import { brand } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FeatureGrid } from "./FeatureGrid";

export function Problems() {
  const { problems } = brand;
  return (
    <Section id="problems" tone="light">
      <SectionHeading eyebrow={problems.eyebrow} title={problems.title} intro={problems.intro} />
      <FeatureGrid items={problems.items} />
    </Section>
  );
}
