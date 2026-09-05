"use client";
import { useState } from "react";
import { Truck, ScanLine, Scale, Recycle, ArrowUpRight } from "lucide-react";
import styles from "./MaterialFlow.module.css";
const stages = [
  {
    name: "Collect",
    icon: Truck,
    title: "A new beginning.",
    text: "Local collectors bring valuable materials back into the loop.",
  },
  {
    name: "Identify",
    icon: ScanLine,
    title: "See the potential.",
    text: "Understand the material, its grade, and how to handle it safely.",
  },
  {
    name: "Value",
    icon: Scale,
    title: "Make it a fair exchange.",
    text: "Compare indicative rates before you choose your next connection.",
  },
  {
    name: "Recycle",
    icon: Recycle,
    title: "Keep the value moving.",
    text: "Connect with a facility and record the next chapter for your materials.",
  },
];
export default function MaterialFlow({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  return (
    <div
      className={`${styles.diagram} ${compact ? styles.compact : ""}`}
      aria-label="Explore the four stages of the material cycle"
    >
      <div className={styles.cycle}>
        <svg
          className={styles.track}
          viewBox="0 0 500 500"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="250"
            cy="250"
            r="177"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="250"
            cy="250"
            r="211"
            stroke="currentColor"
            strokeDasharray="2 9"
            strokeWidth="1"
          />
          <path
            className={styles.movingLine}
            d="M250 73a177 177 0 1 1-177 177"
            stroke="#bddb7c"
            strokeWidth="1.5"
            strokeDasharray="5 24"
          />
          <path
            d="m413 218 14 32 12-31M279 413l-29 14 31 12M87 282l-14-32-12 31M218 87l32-14-31-12"
            stroke="#98b86a"
            strokeWidth="1.5"
          />
        </svg>
        <div className={styles.center}>
          <Recycle size={35} strokeWidth={1} />
          <span>
            Materials
            <br />
            <em>in motion.</em>
          </span>
          <small>NOTHING ENDS HERE.</small>
        </div>
        {stages.map((stage, i) => (
          <button
            type="button"
            key={stage.name}
            className={`${styles.node} ${styles["node" + i]} ${active === i ? styles.selected : ""}`}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            <span className={styles.number}>0{i + 1}</span>
            <stage.icon size={23} strokeWidth={1.3} />
            <span>{stage.name}</span>
          </button>
        ))}
      </div>
      <div className={styles.description} aria-live="polite">
        <span className={styles.descriptionNumber}>0{active + 1}</span>
        <div>
          <strong>{stages[active].title}</strong>
          <p>{stages[active].text}</p>
        </div>
      </div>
    </div>
  );
}
