import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { TextReveal } from "@/components/landing/TextReveal";

const testimonials = [
  {
    quote: "INVENTROX replaced three separate billing and inventory apps across our roastery and 4 cafes. Our stockouts dropped by 90% in the first month.",
    author: "Vikram Mehta",
    role: "Head of Operations",
    company: "Artisanal Roast Co.",
    rating: 5,
  },
  {
    quote: "The barcode POS and automated GST invoicing save our baristas 45 minutes every single shift. It just works seamlessly during weekend rushes.",
    author: "Ananya Sharma",
    role: "Founder & Lead Roaster",
    company: "Single Origin Roasters",
    rating: 5,
  },
  {
    quote: "The AI forecast alerts us exactly 4 days before green coffee bean reserves hit critical levels. It's like having a co-founder managing stock 24/7.",
    author: "Rohan Kapoor",
    role: "Supply Chain Manager",
    company: "BrewCraft Coffee Estate",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  const current = testimonials[index];

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center">
      <ScrollReveal variant="fade-up">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]">
            Customer Success Stories
          </span>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white">
            <TextReveal text="Trusted by India's leading" />
            <br />
            <TextReveal className="bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold" text="fast-growing enterprises" delay={300} />
          </h2>
        </div>
      </ScrollReveal>

      <div className="mt-14 max-w-3xl mx-auto w-full">
        <div className="glass-card p-8 md:p-12 relative border-[#00f0ff]/30 bg-[#030712]/90 shadow-[0_0_40px_rgba(0,240,255,0.15)] text-center">
          <Quote className="size-12 text-[#00f0ff]/30 mx-auto mb-6" />
          
          <div className="flex justify-center gap-1 text-[#00f0ff] mb-6">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="size-5 fill-[#00f0ff]" />
            ))}
          </div>

          <p className="text-xl md:text-2xl font-medium text-white leading-relaxed italic">
            "{current.quote}"
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="text-lg font-bold text-white">{current.author}</div>
            <div className="text-sm text-[#00f0ff]">{current.role} — <span className="text-slate-300">{current.company}</span></div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={prev}
              className="flex size-10 items-center justify-center rounded-full glass text-white hover:bg-white/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="text-xs font-mono text-slate-400">
              {index + 1} / {testimonials.length}
            </div>
            <button
              onClick={next}
              className="flex size-10 items-center justify-center rounded-full glass text-white hover:bg-white/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
