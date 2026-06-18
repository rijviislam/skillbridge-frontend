"use client";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { CSSProperties } from "react";
import { useState } from "react";

// ── EXACT colors from EduCore landing page screenshot ──
// Orange primary:    #f97316
// Orange hover:      #ea6c00
// Orange light bg:   #fff7ed
// Orange border:     #fed7aa
// Orange text:       #c2410c
// Cream hero bg:     #fdf6ee
// Dark section:      #111827
// Text heading:      #111827
// Text body:         #6b7280
// Text muted:        #9ca3af
// Border:            #e5e7eb
// Input border:      #d1d5db

const contactCards = [
  {
    icon: "✉️",
    title: "Email Support",
    detail: "support@skillbridge.io",
    sub: "We reply within 24 hours",
    href: "mailto:support@skillbridge.io",
  },
  {
    icon: "💬",
    title: "Live Chat",
    detail: "Chat with the team",
    sub: "Mon–Fri, 9am–6pm (GMT+6)",
    href: "#",
  },
  {
    icon: "🐦",
    title: "Twitter / X",
    detail: "@SkillBridgeHQ",
    sub: "Quick questions welcome",
    href: "https://twitter.com",
  },
];

const faqs = [
  {
    q: "How do I become a tutor on SkillBridge?",
    a: "Register with the Tutor role, complete your profile, set your availability, and you're live immediately — no approval wait required.",
  },
  {
    q: "Can I cancel a booked session?",
    a: "Yes. Students can cancel a session before it begins. Cancellations are reflected instantly in both the student and tutor dashboards.",
  },
  {
    q: "How are tutors verified?",
    a: "Tutors are rated by students after every session. Verified badges are awarded to tutors who maintain consistently high ratings over time.",
  },
  {
    q: "What subjects are available?",
    a: "We cover 50+ subjects across academics, languages, coding, music, and more. Browse our categories page to see the full list.",
  },
  {
    q: "Is it free to create a student account?",
    a: "Yes — creating a student account is completely free. You only pay for the sessions you book with tutors.",
  },
];

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: "0.9rem",
  color: "#111827",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: 500,
  color: "#374151",
  marginBottom: 6,
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    topic: "",
    message: "",
  });
  const [status, setStatus] = useState<"sending" | "sent" | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const set = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("sent");
  };

  const focusStyle = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    e.target.style.borderColor = "#f97316";
    e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.12)";
  };
  const blurStyle = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    e.target.style.borderColor = "#d1d5db";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        color: "#111827",
      }}
    >
      <Navbar />
      <section
        style={{
          background:
            "linear-gradient(160deg, #fdf6ee 0%, #fef9f4 60%, #fff 100%)",
          padding: "80px 24px 64px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 100,
              padding: "5px 14px",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: "0.75rem" }}>💬</span>
            <span
              style={{ fontSize: "0.78rem", fontWeight: 600, color: "#c2410c" }}
            >
              We typically reply within 24 hours
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
              margin: "0 0 16px",
            }}
          >
            Get in touch with <span style={{ color: "#f97316" }}>our team</span>
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "#6b7280",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Whether you have a question about bookings, want to join as a tutor,
            or just want to say hello — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS — card style mirrors tutor cards on landing ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: "-28px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {contactCards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: "26px 22px",
                textDecoration: "none",
                color: "inherit",
                display: "block",
                transition: "border-color 0.15s, box-shadow 0.15s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.background = "#ea6c00")
              }
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.background = "#f97316")
              }
            >
              {/* icon box — same warm bg as category icons on landing */}
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
                  fontSize: "1.2rem",
                  marginBottom: 14,
                }}
              >
                {c.icon}
              </div>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#111827",
                  margin: "0 0 4px",
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#f97316",
                  fontWeight: 500,
                  margin: "0 0 3px",
                }}
              >
                {c.detail}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: 0 }}>
                {c.sub}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ── FORM + FAQ ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "64px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 60,
          alignItems: "start",
        }}
      >
        {/* FORM */}
        <div>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              margin: "0 0 6px",
              color: "#111827",
            }}
          >
            Send us a message
          </h2>
          <p
            style={{
              color: "#6b7280",
              marginBottom: 28,
              fontSize: "0.9rem",
              lineHeight: 1.65,
            }}
          >
            Fill in the form and we'll get back to you within one business day.
          </p>

          {status === "sent" ? (
            <div
              style={{
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                borderRadius: 16,
                padding: "48px 36px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "#f97316",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  fontSize: "1.5rem",
                }}
              >
                ✅
              </div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "#111827",
                  margin: "0 0 8px",
                }}
              >
                Message sent!
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  margin: "0 0 24px",
                }}
              >
                We'll reply to{" "}
                <strong style={{ color: "#111827" }}>{form.email}</strong>{" "}
                within 24 hours.
              </p>
              <button
                onClick={() => {
                  setStatus(null);
                  setForm({
                    name: "",
                    email: "",
                    role: "",
                    topic: "",
                    message: "",
                  });
                }}
                style={{
                  background: "#f97316",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "11px 26px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={set}
                    placeholder="Tanvir Ahmed"
                    required
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={set}
                    placeholder="tanvir@email.com"
                    required
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>I am a…</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={set}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="other">Just browsing</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Topic</label>
                  <select
                    name="topic"
                    value={form.topic}
                    onChange={set}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select a topic</option>
                    <option value="booking">Booking help</option>
                    <option value="account">Account issue</option>
                    <option value="tutor-join">Becoming a tutor</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={set}
                  placeholder="Hi! I'm having trouble booking a session with..."
                  required
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.65,
                  }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>

              <div>
                {/* orange button — exact match to landing Search / Find a Tutor button */}
                <button
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                  style={{
                    background: status === "sending" ? "#fdba74" : "#f97316",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "13px 32px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "sending")
                      e.currentTarget.style.background = "#ea6c00";
                  }}
                  onMouseLeave={(e) => {
                    if (status !== "sending")
                      e.currentTarget.style.background = "#f97316";
                  }}
                >
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              margin: "0 0 6px",
              color: "#111827",
            }}
          >
            Frequently Asked
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 24, fontSize: "0.9rem" }}>
            Quick answers to common questions.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  border: `1px solid ${openFaq === i ? "#fed7aa" : "#e5e7eb"}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  transition: "border-color 0.15s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    background: openFaq === i ? "#fff7ed" : "#fff",
                    border: "none",
                    padding: "14px 16px",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: 12,
                    transition: "background 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#111827",
                      lineHeight: 1.5,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      color: "#f97316",
                      fontSize: "1.15rem",
                      flexShrink: 0,
                      fontWeight: 300,
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
                      transition: "transform 0.2s",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    style={{
                      padding: "0 16px 14px",
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      lineHeight: 1.75,
                      background: "#fff7ed",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* support hours card */}
          <div
            style={{
              marginTop: 20,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "18px 16px",
            }}
          >
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                margin: "0 0 8px",
                color: "#111827",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>🕐</span> Support Hours
            </h4>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#6b7280",
                margin: "0 0 6px",
                lineHeight: 1.7,
              }}
            >
              Mon – Fri: 9:00 AM – 6:00 PM (GMT+6)
              <br />
              Saturday: 10:00 AM – 2:00 PM
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#f97316",
                fontWeight: 500,
                margin: 0,
              }}
            >
              📍 Based in Dhaka, Bangladesh
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA — dark section matching landing page ── */}
      <section
        style={{
          background: "#111827",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 12px",
            }}
          >
            Ready to start learning?
          </h2>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "1.05rem",
              margin: "0 0 32px",
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
              onMouseEnter={(e) => {
                if (status !== "sending")
                  e.currentTarget.style.background = "#ea6c00";
              }}
              onMouseLeave={(e) => {
                if (status !== "sending")
                  e.currentTarget.style.background = "#f97316";
              }}
            >
              Find a Tutor
            </a>
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
          .sb-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 640px) {
          .sb-form-inner { grid-template-columns: 1fr !important; }
          .sb-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Footer />
    </div>
  );
}
