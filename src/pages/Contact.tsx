import { useState } from 'react';
import { Mail, Phone, Building2, User, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const scriptURL = import.meta.env.VITE_CONTACT_FORM_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
        });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-[#0D0D0D]">
            GET IN <span className="text-[#FF6B00]">TOUCH</span>
          </h1>
          <p className="mt-4 text-xl text-[#0D0D0D]/50 max-w-3xl leading-relaxed">
            For consulting, technical advisory, collaboration, speaking opportunities,
            or professional inquiries, use the form below.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_420px] gap-10 items-start">

          {/* Contact Form */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#0D0D0D]/80 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0D0D0D]/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#0D0D0D]/80 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0D0D0D]/80 mb-2">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D0D0D]/80 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20"
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D0D0D]/80 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 resize-none"
                  placeholder="Write your message..."
                />
              </div>

              {/* Status Messages */}
              {submitted && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Your message has been submitted successfully.
                  </span>
                </div>
              )}

              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/90 transition-all disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Side Info */}
          <div className="space-y-5">
            <div className="border border-[#E5E7EB] rounded-3xl p-7 bg-[#FAFAFA]">
              <h3 className="text-xl font-semibold text-[#0D0D0D] mb-3">
                Professional Inquiries
              </h3>
              <p className="text-sm text-[#0D0D0D]/65 leading-relaxed">
                Open to engineering consulting, product strategy, innovation advisory,
                patent and IP discussions, research collaborations, and speaking engagements.
              </p>
            </div>

            <div className="border border-[#E5E7EB] rounded-3xl p-7 bg-[#FAFAFA]">
              <h3 className="text-xl font-semibold text-[#0D0D0D] mb-3">
                Response Window
              </h3>
              <p className="text-sm text-[#0D0D0D]/65 leading-relaxed">
                Most professional inquiries are typically reviewed within 2–5 business days.
              </p>
            </div>

            <div className="border border-[#E5E7EB] rounded-3xl p-7 bg-[#FAFAFA]">
              <h3 className="text-xl font-semibold text-[#0D0D0D] mb-3">
                Advisory & Collaboration
              </h3>
              <p className="text-sm text-[#0D0D0D]/65 leading-relaxed">
                Particularly relevant for mobility, electric motors, steering systems,
                autonomous sensing, deep-tech innovation, and IP strategy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}