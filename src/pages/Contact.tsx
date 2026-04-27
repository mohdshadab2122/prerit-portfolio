import { useState } from "react";
import { Mail, Phone, Building2, User, Send, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const scriptURL = import.meta.env.VITE_CONTACT_FORM_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
        });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-6xl mx-auto">
        <div className="pt-6 md:pt-12 pb-8 md:pb-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-14 lg:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter leading-none text-[#0D0D0D] mb-4 md:mb-6">
              GET IN <span className="text-[#FF6B00]">TOUCH</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#0D0D0D]/50 max-w-3xl leading-relaxed font-light">
              For consulting, technical advisory, collaboration, speaking
              opportunities, or professional inquiries, use the form below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px] gap-6 md:gap-10 items-start">
            {/* Contact Form */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl md:rounded-3xl p-5 sm:p-7 md:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[#0D0D0D]/80 mb-1.5 md:mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 text-sm md:text-base"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[#0D0D0D]/80 mb-1.5 md:mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 text-sm md:text-base"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[#0D0D0D]/80 mb-1.5 md:mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 text-sm md:text-base"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[#0D0D0D]/80 mb-1.5 md:mb-2">
                      Company / Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 text-sm md:text-base"
                        placeholder="Enter company name"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#0D0D0D]/80 mb-1.5 md:mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 text-sm md:text-base"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#0D0D0D]/80 mb-1.5 md:mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 resize-none text-sm md:text-base"
                    placeholder="Write your message..."
                  />
                </div>

                {/* Status Messages */}
                {submitted && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl md:rounded-2xl">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    <span className="text-xs md:text-sm font-medium">
                      Your message has been submitted successfully.
                    </span>
                  </div>
                )}

                {error && (
                  <div className="text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-black text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium hover:bg-black/90 transition-all disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {loading ? "Submitting..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Side Info — hidden on mobile */}
            <div className="hidden md:flex md:flex-col space-y-3 md:space-y-5">
              {[
                {
                  title: "Professional Inquiries",
                  body: "Open to engineering consulting, product strategy, innovation advisory, patent and IP discussions, research collaborations, and speaking engagements.",
                },
                {
                  title: "Response Window",
                  body: "Most professional inquiries are typically reviewed within 2–5 business days.",
                },
                {
                  title: "Advisory & Collaboration",
                  body: "Particularly relevant for mobility, electric motors, steering systems, autonomous sensing, deep-tech innovation, and IP strategy.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="border border-[#E5E7EB] rounded-2xl md:rounded-3xl p-5 md:p-7 bg-[#FAFAFA]"
                >
                  <h3 className="text-base md:text-xl font-semibold text-[#0D0D0D] mb-2 md:mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#0D0D0D]/65 leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
