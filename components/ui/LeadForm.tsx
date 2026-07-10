"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function LeadForm({
  title,
  subtitle,
  submitLabel = "Submit",
  thankYou = "Thank you. Our team will be in touch shortly.",
  compact = false,
  dark = false,
  onSuccess,
}: {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  thankYou?: string;
  compact?: boolean;
  dark?: boolean;
  onSuccess?: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSuccess?.();
  };

  const fieldClass = `w-full bg-transparent border-b outline-none py-3 text-sm transition-colors ${
    dark
      ? "border-surface/25 focus:border-accent text-surface placeholder:text-surface/40"
      : "border-divider focus:border-accent-hover text-ink placeholder:text-muted"
  }`;

  if (submitted) {
    return (
      <div
        className={`p-6 md:p-8 text-center border ${
          dark ? "border-surface/20 bg-ink/90 backdrop-blur-sm" : "border-divider bg-surface"
        }`}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 bg-accent text-ink">
          <Check size={18} />
        </span>
        <p className={`font-display text-lg ${dark ? "text-surface" : "text-ink"}`}>{thankYou}</p>
      </div>
    );
  } 

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? ""
          : dark
          ? "p-6 md:p-8 border border-surface/20 bg-ink/90 backdrop-blur-sm"
          : "p-6 md:p-8 card"
      }
    >
      {title && <h3 className={`font-display text-2xl mb-1 ${dark ? "text-surface" : "text-ink"}`}>{title}</h3>}
      {subtitle && <p className={`text-sm mb-6 ${dark ? "text-surface/60" : "text-muted"}`}>{subtitle}</p>}

      <div className={compact ? "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" : "grid grid-cols-1 gap-4"}>
        <input required type="text" name="name" placeholder="Full Name" className={fieldClass} />
        <input required type="tel" name="phone" placeholder="Phone Number" className={fieldClass} />
        <input required type="email" name="email" placeholder="Email" className={fieldClass} />
      </div>

      <label className={`mt-5 flex items-start gap-2 text-xs cursor-pointer ${dark ? "text-surface/60" : "text-muted"}`}>
        <input
          required
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 accent-accent"
        />
        I agree to be contacted regarding Fortune Hestia and accept the privacy policy.
      </label>

      <button type="submit" className="mt-6 btn-primary">
        {submitLabel} <ArrowRight size={14} />
      </button>
    </form>
  );
}