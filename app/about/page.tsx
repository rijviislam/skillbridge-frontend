"use client";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useEffect, useRef, useState } from "react";

// ── EXACT colors from EduCore landing page screenshot ──
// Orange primary:    #f97316  (buttons, highlights, logo)
// Orange dark:       #ea6c00  (hover)
// Orange light bg:   #fff7ed  (badge bg)
// Orange text:       #c2410c  (badge text)
// Cream hero bg:     #fdf6ee  (hero section warm bg)
// Dark section:      #111827  (CTA dark bg)
// Text heading:      #111827
// Text body:         #6b7280
// Text muted:        #9ca3af
// Border:            #e5e7eb
// Card bg:           #ffffff
// Subtle bg:         #f9fafb

const stats = [
  { value: "500+", label: "Expert Tutors" },
  { value: "25K+", label: "Sessions Completed" },
  { value: "50+", label: "Subjects Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  {
    icon: "🎯",
    title: "Access for Everyone",
    desc: "Quality tutoring shouldn't depend on your location or budget. We make expert guidance reachable for every learner.",
  },
  {
    icon: "🤝",
    title: "Real Connections",
    desc: "Learning happens between people. We build tools that get out of the way and let meaningful teaching happen.",
  },
  {
    icon: "📈",
    title: "Growth Mindset",
    desc: "Every session is a step forward — for students, tutors, and our platform. We never stop improving.",
  },
  {
    icon: "🔒",
    title: "Trust & Safety",
    desc: "Verified tutors, transparent reviews, and a support team that actually responds when you reach out.",
  },
];

const team = [
  {
    name: "Anika Rahman",
    role: "Co-Founder & CEO",
    bio: "Former educator turned tech builder. Passionate about closing the access gap in quality tutoring.",
    initials: "AR",
  },
  {
    name: "Farhan Hossain",
    role: "Co-Founder & CTO",
    bio: "Full-stack engineer obsessed with building products that make learning frictionless and joyful.",
    initials: "FH",
  },
  {
    name: "Nusrat Jahan",
    role: "Head of Tutor Success",
    bio: "Dedicated to helping tutors thrive — from onboarding and support to building our tutor community.",
    initials: "NJ",
  },
];

const journey = [
  {
    num: "1",
    title: "We started with a problem",
    desc: "Finding the right tutor was harder than the subject itself. We knew there had to be a better way.",
  },
  {
    num: "2",
    title: "We built the bridge",
    desc: "SkillBridge launched as a simple marketplace. Within months, thousands of students found their perfect match.",
  },
  {
    num: "3",
    title: "We keep growing",
    desc: "Today we serve 25,000+ sessions with tutors across 50+ subjects — and we're just getting started.",
  },
];

function useCountUp(numericTarget: any, trigger: any) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let cur = 0;
    const inc = Math.ceil(numericTarget / 50);
    const t = setInterval(() => {
      cur = Math.min(cur + inc, numericTarget);
      setVal(cur);
      if (cur >= numericTarget) clearInterval(t);
    }, 24);
    return () => clearInterval(t);
  }, [trigger, numericTarget]);
  return val;
}

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const numeric = parseInt(value.replace(/\D/g, ""));
  const suffix = value.replace(/[0-9]/g, "");
  const count = useCountUp(numeric, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
        {count}
        {suffix}
      </span>
      <span
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          display: "block",
          marginTop: 2,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function About() {
  return (
    <div
      style={{
        fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        color: "#111827",
      }}
    >
      <Navbar />

      {/* ── HERO — cream bg matching landing page ── */}
      <section
        style={{
          background:
            "linear-gradient(160deg, #fdf6ee 0%, #fef9f4 60%, #fff 100%)",
          padding: "80px 24px 72px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* badge — same pill style as landing "Trusted by 10,000+ students" */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 100,
              padding: "5px 14px",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: "0.75rem" }}>⭐</span>
            <span
              style={{ fontSize: "0.78rem", fontWeight: 600, color: "#c2410c" }}
            >
              Trusted by 10,000+ students
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.1,
                  margin: "0 0 20px",
                }}
              >
                We connect learners with the{" "}
                <span style={{ color: "#f97316" }}>best tutors</span>, anywhere
              </h1>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#6b7280",
                  lineHeight: 1.8,
                  maxWidth: 480,
                  margin: "0 0 36px",
                }}
              >
                SkillBridge was born from a simple frustration — finding the
                right tutor was harder than the subject itself. So we built the
                platform we always wished existed.
              </p>
              {/* stats row — same layout as landing page hero stats */}
              <div style={{ display: "flex", gap: 32 }}>
                {stats.slice(0, 3).map((s) => (
                  <StatItem key={s.label} {...s} />
                ))}
              </div>
            </div>

            {/* right side — mission card */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 20,
                padding: "36px 32px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  marginBottom: 20,
                }}
              >
                🎓
              </div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  margin: "0 0 14px",
                  color: "#111827",
                }}
              >
                Our Mission
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                  margin: "0 0 20px",
                }}
              >
                To close the gap between potential and opportunity by making
                expert tutoring accessible to every learner — regardless of
                location or budget.
              </p>
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 20 }}>
                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: 1.8,
                    fontSize: "0.95rem",
                    margin: 0,
                  }}
                >
                  We believe the right teacher at the right time can change
                  everything. SkillBridge makes that match possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW WE GOT HERE — same "How EduCore Works" 3-step layout ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 10px",
              }}
            >
              How EduCore Started
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
              From a single idea to thousands of sessions
            </p>
          </div>

          {/* connector steps — mirrors the "How EduCore Works" section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 0,
              position: "relative",
            }}
          >
            {/* connector line */}
            <div
              style={{
                position: "absolute",
                top: 36,
                left: "16%",
                right: "16%",
                height: 2,
                background:
                  "linear-gradient(to right, #fed7aa, #f97316, #fed7aa)",
                zIndex: 0,
              }}
            />

            {journey.map((s, i) => (
              <div
                key={s.num}
                style={{
                  textAlign: "center",
                  padding: "0 20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* number circle — same as landing how-it-works */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#fff7ed",
                    border: "2px solid #f97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#f97316",
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#111827",
                    margin: "0 0 10px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section
        style={{
          background: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 10px",
              }}
            >
              What We Stand For
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
              The principles that guide every decision we make
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: "28px 24px",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    marginBottom: 16,
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#111827",
                    margin: "0 0 8px",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 10px",
              }}
            >
              Who's Behind SkillBridge
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
              A small team with a big mission
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {team.map((m) => (
              <div
                key={m.name}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: "32px 26px",
                  textAlign: "center",
                }}
              >
                {/* avatar — same circle style as tutor cards on landing */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#fff7ed",
                    border: "2px solid #fed7aa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 18px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#f97316",
                  }}
                >
                  {m.initials}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    margin: "0 0 4px",
                    color: "#111827",
                  }}
                >
                  {m.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#f97316",
                    fontWeight: 600,
                    margin: "0 0 14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {m.role}
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — dark section matching landing page exactly ── */}
      <section
        style={{
          background: "#111827",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 14px",
            }}
          >
            Ready to start learning?
          </h2>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "1.05rem",
              margin: "0 0 36px",
            }}
          >
            Join thousands of students already learning with EduCore tutors.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* orange filled button — same as landing CTA */}
            <a
              href="/tutors"
              style={{
                background: "#f97316",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "13px 30px",
                borderRadius: 10,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Find a Tutor
            </a>
            {/* outlined button — same as "Teach on EduCore" on landing */}
            <a
              href="/auth/register"
              style={{
                background: "transparent",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "13px 30px",
                borderRadius: 10,
                textDecoration: "none",
                display: "inline-block",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              Teach on EduCore
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .sb-hero-grid   { grid-template-columns: 1fr !important; }
          .sb-step-grid   { grid-template-columns: 1fr !important; }
          .sb-step-line   { display: none !important; }
        }
        @media (max-width: 640px) {
          .sb-stats-row   { gap: 20px !important; }
        }
      `}</style>
      <Footer />
    </div>
  );
}
