"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
    "Who is ScrapSetu for?",
    "ScrapSetu connects local scrap collectors with authorized recycling facilities. Collectors can classify materials and compare rates; recyclers can review incoming lots and manage handovers.",
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
        <a href="#main" className={styles.skip}>
          Skip to content
        </a>
        <header className={styles.nav}>
          <Link href="/" className={styles.brand}>
            <Recycle size={27} strokeWidth={1.7} />
            ScrapSetu<span>®</span>
          </Link>
          <nav
            className={`${styles.links} ${menu ? styles.menuOpen : ""}`}
            aria-label="Main navigation"
          >
            <a href="#how-it-works" onClick={() => setMenu(false)}>
              The process
            </a>
            <a href="#materials" onClick={() => setMenu(false)}>
              Materials & rates
            </a>
            <a href="#our-purpose" onClick={() => setMenu(false)}>
              Our purpose
            </a>
          </nav>
          <Link href="/auth" className={styles.navCta}>
            Get started <ArrowUpRight size={17} />
          </Link>
          <button
            className={styles.menuToggle}
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </header>
        <main id="main">
          <section className={styles.hero}>

            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <span className={styles.dot} /> A BETTER WAY TO BEGIN AGAIN
              </div>
              <h1>
                Nothing wasted.
                <br />
                Everything
                <br />
                <em>worth more.</em>
              </h1>
              <p>
                A new chapter for your scrap. Connecting local collectors with
                responsible recyclers, one fair exchange at a time.
              </p>
              <Link href="/auth" className={styles.limeButton}>
                Give your scrap a new life <ArrowUpRight size={20} />
              </Link>
              <Link href="/auth" className={styles.demoLink}>
                Explore the demo <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.heroFlow}>
              <MaterialFlow />
            </div>
<div className={styles.heroBottom}>
              <span>
                <MapPin size={14} /> Rooted in Delhi NCR
              </span>
              <a href="#how-it-works">
                A little scroll. A bigger change. <ArrowDown size={15} />
              </a>
              <span>THE CIRCULAR ECONOMY, CONNECTED</span>
            </div>
          </section>
          <div className={styles.trustStrip}>
            <span>
              Good for your business.
              <br />
              <strong>Better for what comes next.</strong>
            </span>
            <span>
              <Scale /> Transparent pricing
            </span>
            <span>
              <ShieldCheck /> Responsible recycling
            </span>
            <span>
              <Recycle /> Traceable handovers
            </span>
          </div>
          <section id="how-it-works" className={styles.process}>
            <div className={styles.sectionHead} data-reveal>
              <div>
                <span className={styles.label}>01 / A SIMPLER CYCLE</span>
                <h2>
                  Less friction.
                  <br />
                  <span>More possibility.</span>
                </h2>
              </div>
              <p>
                Recycling should feel like a natural next step.
                <br />
                We make the connections. You keep moving.
              </p>
            </div>
            <div className={styles.steps}>
              {steps.map((s, i) => (
                <article key={s.title} data-reveal>
                  <div className={styles.stepTop}>
                    <s.icon size={29} strokeWidth={1.3} />
                    <span>0{i + 1}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className={styles.stepLine} />
                </article>
              ))}
            </div>
          </section>
          <section id="materials" className={styles.materialSection}>
            <div className={styles.materialIntro} data-reveal>
              <span className={styles.label}>02 / VALUE, OUT IN THE OPEN</span>
              <h2>
                Old materials.
                <br />
                <em>Fresh potential.</em>
              </h2>
              <p>
                No guesswork. Start with an indicative price for your materials
                and see what your next collection could be worth.
              </p>
              <Link href="/auth" className={styles.textLink}>
                Explore the price board <ArrowUpRight size={18} />
              </Link>
              <span className={styles.sampleNote}>
                DELHI NCR PILOT · SAMPLE RATES
              </span>
            </div>
            <div className={styles.priceCard} data-reveal>
              <div className={styles.priceHead}>
                <span>Know your scrap’s worth</span>
                <Scale size={22} />
              </div>
              <div className={styles.materialChoices}>
                {materials.map((m, i) => (
                  <button
                    key={m.name}
                    aria-pressed={material === i}
                    className={material === i ? styles.materialActive : ""}
                    onClick={() => setMaterial(i)}
                  >
                    <m.icon size={22} />
                    <span>{m.name}</span>
                    <strong>
                      ₹{m.rate}
                      <small> / kg</small>
                    </strong>
                  </button>
                ))}
              </div>
              <div className={styles.estimate}>
                <label htmlFor="scrap-weight">
                  Your estimated weight
                  <div className={styles.weightInput}>
                    <input
                      id="scrap-weight"
                      type="number"
                      min="0"
                      max="100000"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                    <span>kg</span>
                  </div>
                </label>
                <div>
                  <span>Estimated value</span>
                  <output>
                    ₹
                    {(
                      Math.max(0, Number(weight) || 0) *
                      materials[material].rate
                    ).toLocaleString("en-IN")}
                  </output>
                </div>
              </div>
              <p className={styles.disclaimer}>
                An estimate, not a quote. Final value depends on grade and
                verified weight.
              </p>
            </div>
          </section>
          <section id="our-purpose" className={styles.purpose}>
            <div className={styles.manifesto} data-reveal>
              <span>A CHANGE OF PERSPECTIVE</span>
              <p>
                Waste is a<br />
                material
                <br />
                in the{" "}
                <em>
                  wrong
                  <br />
                  place.
                </em>
              </p>
              <div>
                <ArrowUpRight size={43} strokeWidth={1} />
                <span>LET’S FIND IT A BETTER ONE.</span>
              </div>
            </div>
            <div className={styles.purposeCopy} data-reveal>
              <span className={styles.label}>
                03 / PROGRESS IS A COLLECTIVE EFFORT
              </span>
              <h2>
                A small bridge.
                <br />A lasting <em>difference.</em>
              </h2>
              <p>
                Behind every recovered material is someone who saw its value.
                We’re here to give that work a better connection.
              </p>
              <p>
                ScrapSetu brings local collectors and recycling facilities
                together with clearer prices, safer handling, and a shared
                record of the journey.
              </p>
              <Link href="/auth" className={styles.darkButton}>
                Find your place in the loop <ArrowUpRight size={18} />
              </Link>
            </div>
          </section>
          <section className={styles.faq}>
            <div data-reveal>
              <span className={styles.label}>A FEW THINGS, ANSWERED</span>
              <h2>
                Good questions.
                <br />
                Clear answers.
              </h2>
            </div>
            <div>
              {faqs.map(([q, a], i) => (
                <div className={styles.faqItem} key={q}>
                  <button
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {q}
                    {openFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  <div id={`faq-${i}`} hidden={openFaq !== i}>
                    <p>{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.closing}>
            <span className={styles.label}>
              THE NEXT CHAPTER STARTS WITH YOU
            </span>
            <h2>
              Let’s make
              <br />
              <em>good things go round.</em>
            </h2>
            <Link href="/auth" className={styles.limeButton}>
              Join the loop <ArrowUpRight size={20} />
            </Link>
            <Recycle className={styles.closingIcon} strokeWidth={0.6} />
          </section>
        </main>
        <footer className={styles.footer}>
          <Link href="/" className={styles.brand}>
            <Recycle size={25} />
            ScrapSetu<span>®</span>
          </Link>
          <span>Made for a world that wastes less.</span>
          <span>Delhi NCR pilot · 2026</span>
          <a href="#main">Back to the top ↑</a>
        </footer>
      </div>
    </SmoothScroll>
  );
}
