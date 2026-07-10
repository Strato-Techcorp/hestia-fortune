"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const fieldClass = `
  w-full bg-transparent border-b border-divider text-ink py-1.5 text-sm outline-none
  placeholder:text-muted focus:border-accent-hover transition-colors duration-300
  [&:-webkit-autofill]:bg-transparent
  [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent]
  [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]
`;

export default function QuickEnquiry() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <section id="enquiry" className="bg-canvas py-12 md:py-14 border-t border-divider">
      <div className="container-px max-w-content mx-auto">
        <Reveal>
         <div className="relative overflow-hidden border-4 border-ink px-8 py-8 md:px-14 md:py-10 shadow-[0_18px_45px_-24px_rgba(18,18,18,0.15)]">
            {!submitted ? (
              <div className="grid items-center gap-8 md:grid-cols-[0.7fr_1.8fr]">
                {/* Left */}
                <div>
                  <span className="label-text !text-[9px] !tracking-[0.4em] text-accent-hover">
                    Fortune Hestia
                  </span>

                  <h2 className="mt-2 font-display text-[2rem] md:text-[2.4rem] leading-none italic font-normal text-ink">
                    Begin your
                    <br />
                    <span className="not-italic font-semibold text-accent-hover">
                      journey home.
                    </span>
                  </h2>

                  <p className="mt-3 max-w-[240px] text-xs leading-relaxed text-muted">
                    Leave your details and our team will reach out with everything you need to know.
                  </p>
                </div>

                {/* Right */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name | Phone | Email | Submit — single inline row */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
                    <div className="flex-1">
                      <label className="label-text !text-[9px] !tracking-[0.3em] text-muted mb-1 block">
                        Name
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={fieldClass}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="label-text !text-[9px] !tracking-[0.3em] text-muted mb-1 block">
                        Phone
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className={fieldClass}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="label-text !text-[9px] !tracking-[0.3em] text-muted mb-1 block">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={fieldClass}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !agreed}
                      className="label-text !text-[9px] !tracking-[0.4em] whitespace-nowrap border border-ink px-6 py-3 text-ink transition-all duration-500 hover:bg-ink hover:text-surface disabled:opacity-40 flex items-center justify-center gap-1.5"
                    >
                      {submitting ? "Sending..." : (
                        <>
                          Submit <ArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* checkbox row */}
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      required
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-3 w-3 accent-accent-hover"
                    />
                    <span className="text-[10px] leading-relaxed text-muted">
                      I agree to the privacy policy and consent to being contacted regarding this enquiry.
                    </span>
                  </label>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="label-text !text-base !tracking-[0.45em] text-accent-hover">
                  Thank You
                </span>

                <h3 className="mt-2 font-display text-3xl italic font-normal text-ink">
                  We&rsquo;ll be in touch shortly.
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Our team has received your enquiry and will reach out soon.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}