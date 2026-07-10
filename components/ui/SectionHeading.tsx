import TextReveal from "./TextReveal";
import Reveal from "./Reveal";
import clsx from "clsx";

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  subtitle,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  subtitle?: string;
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Reveal>
        <div className={clsx("flex items-center gap-3", align === "center" && "justify-center")}>
        
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>
      <TextReveal
        as="h2"
        text={title}
        className="mt-5 text-section-sm md:text-section-md lg:text-section font-display text-ink"
      />
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="mt-6 body-text">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
