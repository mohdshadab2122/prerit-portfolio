import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ExternalLink,
  Mail,
  Phone,
  Send,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useAppData } from "../Context/DataContext";
import { getContactSideInfo, getPageIntro } from "../config/pageContent";

/*
 * Contact page
 *
 * This page renders a controlled contact form and posts it to the Apps
 * Script/endpoint URL stored in VITE_CONTACT_FORM_URL. The UI is split into
 * small components so form behavior, status rendering, and side information are
 * easy for a new developer to follow.
 */

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

interface TextInputConfig {
  name: keyof ContactFormData;
  label: string;
  type: "text" | "email";
  placeholder: string;
  icon?: ReactNode;
  required?: boolean;
}

interface SideInfoCard {
  title: string;
  body: string;
}

const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: "",
};

const FALLBACK_ERROR_MESSAGE =
  "The contact form is temporarily unavailable. Please use the fallback contact option below.";

// First two rows are configured data-first to avoid repeating the same input
// markup four times.
const CONTACT_FIELD_ROWS: TextInputConfig[][] = [
  [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      icon: (
        <User className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
      ),
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email address",
      icon: (
        <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
      ),
      required: true,
    },
  ],
  [
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter phone number",
      icon: (
        <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
      ),
    },
    {
      name: "company",
      label: "Company / Organization",
      type: "text",
      placeholder: "Enter company name",
      icon: (
        <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
      ),
    },
  ],
];

const ContactHeader = ({ intro }: { intro: string }) => (
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
      {intro}
    </p>
  </motion.div>
);

const FieldLabel = ({ children }: { children: ReactNode }) => (
  <label className="block text-xs md:text-sm font-medium text-[#0D0D0D]/80 mb-1.5 md:mb-2">
    {children}
  </label>
);

const TextInput = ({
  field,
  value,
  onChange,
}: {
  field: TextInputConfig;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <FieldLabel>{field.label}</FieldLabel>
    <div className="relative">
      {field.icon}
      <input
        type={field.type}
        name={field.name}
        value={value}
        onChange={onChange}
        required={field.required}
        className={`w-full ${
          field.icon ? "pl-10 md:pl-11" : "px-4"
        } pr-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 text-sm md:text-base`}
        placeholder={field.placeholder}
      />
    </div>
  </div>
);

const SubjectInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <FieldLabel>Subject</FieldLabel>
    <input
      type="text"
      name="subject"
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 text-sm md:text-base"
      placeholder="Enter subject"
    />
  </div>
);

const MessageInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div>
    <FieldLabel>Message</FieldLabel>
    <textarea
      name="message"
      value={value}
      onChange={onChange}
      required
      rows={6}
      className="w-full px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:border-[#0D0D0D]/20 resize-none text-sm md:text-base"
      placeholder="Write your message..."
    />
  </div>
);

const FormStatus = ({
  submitted,
  error,
  fallbackHref,
}: {
  submitted: boolean;
  error: string;
  fallbackHref?: string;
}) => (
  <>
    {submitted && (
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl md:rounded-2xl">
        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
        <span className="text-xs md:text-sm font-medium">
          Your message has been submitted successfully.
        </span>
      </div>
    )}

    {error && (
      <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl md:rounded-2xl">
        <div className="flex items-start gap-2 text-red-700">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0 mt-[1px]" />
          <span className="text-xs md:text-sm font-medium">{error}</span>
        </div>

        {fallbackHref ? (
          <a
            href={fallbackHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#0D0D0D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#FF6B00]"
          >
            Contact on LinkedIn
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <p className="mt-2 text-xs text-red-700/80">
            You can also use the professional links in the footer.
          </p>
        )}
      </div>
    )}
  </>
);

const SubmitButton = ({ loading }: { loading: boolean }) => (
  <button
    type="submit"
    disabled={loading}
    className="inline-flex items-center gap-2 bg-black text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium hover:bg-black/90 transition-all disabled:opacity-60"
  >
    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
    {loading ? "Submitting..." : "Send Message"}
  </button>
);

const ContactForm = ({
  formData,
  loading,
  submitted,
  error,
  fallbackHref,
  onChange,
  onSubmit,
}: {
  formData: ContactFormData;
  loading: boolean;
  submitted: boolean;
  error: string;
  fallbackHref?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) => (
  <div className="bg-white border border-[#E5E7EB] rounded-2xl md:rounded-3xl p-5 sm:p-7 md:p-8 lg:p-10">
    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
      {CONTACT_FIELD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        >
          {row.map((field) => (
            <TextInput
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}
        </div>
      ))}

      <SubjectInput value={formData.subject} onChange={onChange} />
      <MessageInput value={formData.message} onChange={onChange} />
      <FormStatus
        submitted={submitted}
        error={error}
        fallbackHref={fallbackHref}
      />
      <SubmitButton loading={loading} />
    </form>
  </div>
);

const SideInfo = ({ cards }: { cards: SideInfoCard[] }) => (
  <div className="hidden md:flex md:flex-col space-y-3 md:space-y-5">
    {cards.map((card, index) => (
      <div
        key={index}
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
);

// Entry point: hold controlled form state, submit to the configured endpoint,
// then render the form and desktop side information.
export default function Contact() {
  const { data } = useAppData();
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const scriptURL = import.meta.env.VITE_CONTACT_FORM_URL;
  const fallbackLinkedIn = data?.home?.[0]?.links?.linkedin || "";
  const intro = getPageIntro(data?.pageContent, "contact");
  const sideInfoCards = getContactSideInfo(data?.pageContent);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    if (!scriptURL) {
      setError(FALLBACK_ERROR_MESSAGE);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(Object.entries(formData)).toString(),
      });

      if (!response.ok) {
        throw new Error(`Contact form failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData(INITIAL_FORM_DATA);
      } else {
        setError(FALLBACK_ERROR_MESSAGE);
      }
    } catch (err) {
      setError(FALLBACK_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="pt-3 md:pt-8 pb-8 md:pb-12">
          <ContactHeader intro={intro} />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px] gap-6 md:gap-10 items-start">
            <ContactForm
              formData={formData}
              loading={loading}
              submitted={submitted}
              error={error}
              fallbackHref={fallbackLinkedIn}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
            <SideInfo cards={sideInfoCards} />
          </div>
        </div>
      </div>
    </div>
  );
}
