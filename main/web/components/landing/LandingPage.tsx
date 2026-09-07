"use client";
import { T, useLocale } from '@/components/language/Language';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language/Language";
import MaterialFlow from "@/components/material-flow/MaterialFlow";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Recycle,
  Menu,
  X,
  ScanLine,
  Scale,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  Cpu,
  Cable,
  Battery,
  MapPin,
} from "lucide-react";
import styles from "./LandingPage.module.css";
import SmoothScroll from "@/components/SmoothScroll";
const materials = [
  { name: "Circuit boards", rate: 450, icon: Cpu },
  { name: "Copper cables", rate: 385, icon: Cable },
  { name: "Batteries", rate: 180, icon: Battery },
];
const steps = [
  {
    icon: ScanLine,
    title: "Show us your scrap.",
    text: "Take a photo. Get an assisted material classification and guidance on safe handling.",
  },
  {
    icon: Scale,
    title: "Know what it’s worth.",
    text: "Compare indicative rates and see an estimated value before choosing a recycler.",
  },
  {
    icon: Truck,
    title: "Close the loop.",
    text: "Connect with a recycling facility and keep a digital record of every handover.",
  },
];
const faqs = [
  [
    "Who is SmartScrapSetu for?",
    "SmartScrapSetu connects local scrap collectors with authorized recycling facilities. Collectors can classify materials and compare rates; recyclers can review incoming lots and manage handovers.",
  ],
  [
    "What materials can I recycle?",
    "The pilot supports electronic waste including circuit boards, cables, batteries, screens, motors, and whole devices. The collector workspace includes material-specific handling guidance.",
  ],
  [
    "Are the prices guaranteed?",
    "The preview shows sample indicative rates. Final prices depend on material grade, actual weight, and the rate agreed with your recycler.",
  ],
  [
    "Can I explore before signing up?",
    "Yes. Choose Explore the demo, then open the collector, recycler, or admin workspace. Demo activity uses sample data and does not arrange a real pickup.",
  ],
];
export default function LandingPage() {
 const {t:translate}=useLocale();

  const [menu, setMenu] = useState(false),
    [openFaq, setOpenFaq] = useState<number | null>(0),
    [material, setMaterial] = useState(0),
    [weight, setWeight] = useState("10");
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-visible", "true");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    root.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <SmoothScroll>
      <div className={styles.site} ref={root}>
        <a href="#main" className={styles.skip}><T>
          Skip to content
        </T></a>
        <header className={styles.nav}>
          <Link href="/" className={styles.brand}>
            <Recycle size={27} strokeWidth={1.7} /><T>
            SmartScrapSetu</T><span><T>®</T></span>
          </Link>
          <nav
            className={`${styles.links} ${menu ? styles.menuOpen : ""}`}
            aria-label={translate("Main navigation")}
          >
            <a href="#how-it-works" onClick={() => setMenu(false)}><T>
              The process
            </T></a>
            <a href="#materials" onClick={() => setMenu(false)}><T>
              Materials & rates
            </T></a>
            <a href="#our-purpose" onClick={() => setMenu(false)}><T>
              Our purpose
            </T></a>
          </nav>
          <div className={styles.navActions}>
            <LanguageSwitcher/>
            <Link href="/auth" className={styles.navCta}><T>
              Get started </T><ArrowUpRight size={17} />
            </Link>
          </div>
          <button
            className={styles.menuToggle}
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <T>{menu ? <X /> : <Menu />}</T>
          </button>
        </header>
        <main id="main">
          <section className={styles.hero}>

            <div className={styles.heroCopy}>
              <h1><T>
                Nothing wasted.
                </T><br /><T>
                Everything
                </T><br />
                <em><T>worth more.</T></em>
              </h1>
              <p><T>
                A new chapter for your scrap. Connecting local collectors with
                responsible recyclers, one fair exchange at a time.
              </T></p>
              <Link href="/auth" className={styles.limeButton}><T>
                Give your scrap a new life </T><ArrowUpRight size={20} />
              </Link>
              <Link href="/auth" className={styles.demoLink}><T>
                Explore the demo </T><ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.heroFlow}>
              <MaterialFlow />
            </div>
<div className={styles.heroBottom}>
              <span>
                <MapPin size={14} /><T> Rooted in Delhi NCR
              </T></span>
              <a href="#how-it-works"><T>
                A little scroll. A bigger change. </T><ArrowDown size={15} />
              </a>
              <span><T>THE CIRCULAR ECONOMY, CONNECTED</T></span>
            </div>
          </section>
          <div className={styles.trustStrip}>
            <span><T>
              Good for your business.
              </T><br />
              <strong><T>Better for what comes next.</T></strong>
            </span>
            <span>
              <Scale /><T> Transparent pricing
            </T></span>
            <span>
              <ShieldCheck /><T> Responsible recycling
            </T></span>
            <span>
              <Recycle /><T> Traceable handovers
            </T></span>
          </div>
          <section id="how-it-works" className={styles.process}>
            <div className={styles.sectionHead} data-reveal>
              <div>
                <span className={styles.label}><T>01 / A SIMPLER CYCLE</T></span>
                <h2><T>
                  Less friction.
                  </T><br />
                  <span><T>More possibility.</T></span>
                </h2>
              </div>
              <p><T>
                Recycling should feel like a natural next step.
                </T><br /><T>
                We make the connections. You keep moving.
              </T></p>
            </div>
            <div className={styles.steps}>
              <T>{steps.map((s, i) => (
                <article key={s.title} data-reveal>
                  <div className={styles.stepTop}>
                    <s.icon size={29} strokeWidth={1.3} />
                    <span><T>0</T><T>{i + 1}</T></span>
                  </div>
                  <h3><T>{s.title}</T></h3>
                  <p><T>{s.text}</T></p>
                  <div className={styles.stepLine} />
                </article>
              ))}</T>
            </div>
          </section>
          <section id="materials" className={styles.materialSection}>
            <div className={styles.materialIntro} data-reveal>
              <h2><T>
                Old materials.
                </T><br />
                <em><T>Fresh potential.</T></em>
              </h2>
              <p><T>
                No guesswork. Start with an indicative price for your materials
                and see what your next collection could be worth.
              </T></p>
              <Link href="/auth" className={styles.textLink}><T>
                Explore the price board </T><ArrowUpRight size={18} />
              </Link>
              <span className={styles.sampleNote}><T>
                DELHI NCR PILOT · SAMPLE RATES
              </T></span>
            </div>
            <div className={styles.priceCard} data-reveal>
              <div className={styles.priceHead}>
                <span><T>Know your scrap’s worth</T></span>
                <Scale size={22} />
              </div>
              <div className={styles.materialChoices}>
                <T>{materials.map((m, i) => (
                  <button
                    key={m.name}
                    aria-pressed={material === i}
                    className={material === i ? styles.materialActive : ""}
                    onClick={() => setMaterial(i)}
                  >
                    <m.icon size={22} />
                    <span><T>{m.name}</T></span>
                    <strong><T>
                      ₹</T><T>{m.rate}</T>
                      <small><T> / kg</T></small>
                    </strong>
                  </button>
                ))}</T>
              </div>
              <div className={styles.estimate}>
                <label htmlFor="scrap-weight"><T>
                  Your estimated weight
                  </T><div className={styles.weightInput}>
                    <input
                      id="scrap-weight"
                      type="number"
                      min="0"
                      max="100000"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                    <span><T>kg</T></span>
                  </div>
                </label>
                <div>
                  <span><T>Estimated value</T></span>
                  <output><T>
                    ₹
                    </T><T>{(
                      Math.max(0, Number(weight) || 0) *
                      materials[material].rate
                    ).toLocaleString("en-IN")}</T>
                  </output>
                </div>
              </div>
              <p className={styles.disclaimer}><T>
                An estimate, not a quote. Final value depends on grade and
                verified weight.
              </T></p>
            </div>
          </section>
          <section id="our-purpose" className={styles.purpose}>
            <figure className={styles.recoveryVisual} data-reveal aria-label={translate("Discarded circuit boards become recovered copper, then useful materials again")}>
              <svg viewBox="0 0 480 480" role="img" aria-label={translate("Circuit board to copper to a new material")}>
                <defs><pattern id="board-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 12H24M12 0V24" fill="none" stroke="#b3c59d" strokeWidth="0.5" /></pattern></defs>
                <circle cx="240" cy="240" r="176" fill="none" stroke="#adbc98" strokeDasharray="3 9" />
                <g transform="translate(88 70) rotate(-12 100 80)">
                  <rect width="190" height="140" rx="12" fill="#214d38" />
                  <rect x="10" y="10" width="170" height="120" rx="6" fill="url(#board-grid)" />
                  <rect x="62" y="37" width="68" height="66" rx="5" fill="#dce8c9" />
                  <path d="M72 47H120V93H72Z" fill="#315b42" />
                  <path d="M20 118H170" stroke="#d8c17a" strokeWidth="8" strokeDasharray="4 4" />
                </g>
                <path d="M319 145Q392 180 350 263" fill="none" stroke="#50784f" strokeWidth="2" />
                <path d="M338 250L348 270L367 257" fill="none" stroke="#50784f" strokeWidth="2" />
                <g transform="translate(265 282) rotate(-16)"><T>{[0, 1, 2, 3, 4].map(i => <rect key={i} x={i * 17} width="12" height="96" rx="6" fill={i % 2 ? '#b78355' : '#ce9e6f'} />)}</T></g>
                <path d="M248 370Q126 385 112 259" fill="none" stroke="#50784f" strokeWidth="2" />
                <path d="M100 275L111 254L127 270" fill="none" stroke="#50784f" strokeWidth="2" />
                <circle cx="134" cy="305" r="31" fill="#d2dfb9" />
                <path d="M124 318Q119 292 147 289Q150 314 124 318ZM125 317L142 296" fill="none" stroke="#4c7247" strokeWidth="2" />
              </svg>
              <figcaption><T>Recovered. Ready for what’s next.</T></figcaption>
            </figure>
            <div className={styles.purposeCopy} data-reveal>
              <h2><T>
                A small bridge.
                </T><br /><T>A lasting </T><em><T>difference.</T></em>
              </h2>
              <p><T>
                Behind every recovered material is someone who saw its value.
                We’re here to give that work a better connection.
              </T></p>
              <p><T>
                SmartScrapSetu brings local collectors and recycling facilities
                together with clearer prices, safer handling, and a shared
                record of the journey.
              </T></p>
              <Link href="/auth" className={styles.darkButton}><T>
                Find your place in the loop </T><ArrowUpRight size={18} />
              </Link>
            </div>
          </section>
          <section className={styles.faq}>
            <div data-reveal>
              <span className={styles.label}><T>A FEW THINGS, ANSWERED</T></span>
              <h2><T>
                Good questions.
                </T><br /><T>
                Clear answers.
              </T></h2>
            </div>
            <div>
              <T>{faqs.map(([q, a], i) => (
                <div className={styles.faqItem} key={q}>
                  <button
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <T>{q}</T>
                    <T>{openFaq === i ? <Minus size={18} /> : <Plus size={18} />}</T>
                  </button>
                  <div id={`faq-${i}`} hidden={openFaq !== i}>
                    <p><T>{a}</T></p>
                  </div>
                </div>
              ))}</T>
            </div>
          </section>
          <section className={styles.closing}>
            <span className={styles.label}><T>
              THE NEXT CHAPTER STARTS WITH YOU
            </T></span>
            <h2><T>
              Let’s make
              </T><br />
              <em><T>good things go round.</T></em>
            </h2>
            <Link href="/auth" className={styles.limeButton}><T>
              Join the loop </T><ArrowUpRight size={20} />
            </Link>
            <Recycle className={styles.closingIcon} strokeWidth={0.6} />
          </section>
        </main>
        <footer className={styles.footer}>
          <Link href="/" className={styles.brand}>
            <Recycle size={25} /><T>
            SmartScrapSetu</T><span><T>®</T></span>
          </Link>
          <span><T>Made for a world that wastes less.</T></span>
          <span><T>Delhi NCR pilot · 2026</T></span>
          <a href="#main"><T>Back to the top ↑</T></a>
        </footer>
      </div>
    </SmoothScroll>
  );
}
