import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/data";
import LeadForm from "@/components/ui/LeadForm";

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-canvas text-muted overflow-hidden border-t border-divider">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/back.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-canvas/90" />
      </div>

      <CosmosMapBackground />

      <div className="relative container-px max-w-content mx-auto pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 pb-14 border-b border-divider">
          {/* Left: content */}
          <div>
            <Link href="/" className="relative inline-flex items-center h-16 w-56 mb-5">
              <Image
                src="/images/logo.png"
                alt="Fortune Hestia"
                fill
                className="object-contain object-left"
              />
            </Link>

            <p className="text-sm leading-relaxed text-muted max-w-sm">
              Limited edition villas set within 50 acres of Greek-inspired
              landscape, off Sarjapur Road, Bangalore.
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="label-text text-accent-hover mb-4">Explore</h4>
                <ul className="space-y-3 text-sm">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-ink/70 hover:text-accent-hover transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="label-text text-accent-hover mb-4">Contact</h4>
                <div className="text-sm text-muted [&>p]:leading-[35px] [&>p]:m-0">
                  <p>{SITE.address}</p>
                  <p>{SITE.phone}</p>
                  <p>{SITE.email}</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="label-text text-accent-hover mb-4">The Fortune Group</h4>
                <p className="text-sm text-muted leading-relaxed">
                  A project of Fortune Properties, flagship company of The
                  Fortune Group — building better homes since 1995.
                </p>
              </div>
            </div>
          </div>

          {/* Right: schedule a site visit */}
          <div className="flex items-start lg:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-accent-hover/30 hover:border-accent-hover/50 shadow-[0_0_0_1px_rgba(123,174,74,0.06),0_20px_60px_-20px_rgba(123,174,74,0.25)] transition-colors duration-500 p-1">
              <LeadForm
                title="Schedule a Site Visit"
                subtitle="Leave your details and our team will arrange a guided walk-through."
                submitLabel="Book a Private Tour"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-label text-muted/70">
          <span>&copy; {new Date().getFullYear()} The Fortune Group. {SITE.credo}.</span>
          <span>This site is conceptual and not a legal offering. Specifications subject to change.</span>
        </div>
      </div>
    </footer>
  );
}

function CosmosMapBackground() {
  const nodes = [
    { x: 60, y: 80 }, { x: 180, y: 40 }, { x: 320, y: 90 }, { x: 470, y: 50 },
    { x: 610, y: 110 }, { x: 90, y: 220 }, { x: 250, y: 200 }, { x: 400, y: 230 },
    { x: 540, y: 190 }, { x: 680, y: 240 }, { x: 140, y: 340 }, { x: 300, y: 320 },
    { x: 450, y: 350 }, { x: 600, y: 330 }, { x: 40, y: 400 }, { x: 700, y: 400 },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
    [5, 6], [6, 7], [7, 8], [8, 9], [5, 10], [6, 11], [7, 12], [8, 13], [9, 14],
    [10, 11], [11, 12], [12, 13], [10, 14], [13, 15],
  ];
  return (
    <svg
      viewBox="0 0 760 460"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
      aria-hidden
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#7BAE4A" strokeWidth="1"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i % 4 === 0 ? 5 : 3} fill="#7BAE4A" />
      ))}
    </svg>
  );
}