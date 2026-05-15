"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  service: "Brand Identity",
  message: "",
};

const serviceOptions = [
  "Brand Identity",
  "Website Design",
  "Packaging Design",
  "Social Media Design",
  "Agency Support",
  "Other",
];

const WEB3FORMS_ACCESS_KEY = "7bb52ddc-9781-4bbc-8a3f-7223cedd59a0";

export default function ContactFormPanel() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("subject", "New project brief from Owalistic contact page");
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("company", form.company);
      formData.append("service", form.service);
      formData.append("message", form.message);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data?.message || "Couldn't send your project brief. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Success! Your project brief has been sent.");
      setForm(initialState);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="ctc-form-panel">
      <form onSubmit={handleSubmit} className="ctc-form">
        <div className="ctc-form-row">
          <div className="ctc-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="ctc-input"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
              required
            />
          </div>
          <div className="ctc-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="ctc-input"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="ctc-form-row">
          <div className="ctc-form-group">
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              className="ctc-input"
              placeholder="Company or brand (optional)"
              value={form.company}
              onChange={(e) => setForm((c) => ({ ...c, company: e.target.value }))}
            />
          </div>
          <div className="ctc-form-group">
            <label htmlFor="service">Service of Interest</label>
            <select
              id="service"
              name="service"
              className="ctc-input ctc-select"
              value={form.service}
              onChange={(e) => setForm((c) => ({ ...c, service: e.target.value }))}
            >
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ctc-form-group">
          <label htmlFor="message">Project Details</label>
          <textarea
            id="message"
            name="message"
            className="ctc-input ctc-textarea"
            placeholder="Share your goals, timeline and any references…"
            rows={6}
            value={form.message}
            onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary ctc-submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send Project Brief"}
        </button>
      </form>

      <div className={`ctc-form-note${status === "success" || status === "error" ? " is-visible" : ""}`} aria-live="polite">
        <p>{message}</p>
      </div>
    </div>
  );
}
