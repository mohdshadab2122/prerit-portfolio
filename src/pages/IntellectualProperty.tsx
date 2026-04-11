import { useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ExternalLink, Search, Shield, FileText, Lock } from 'lucide-react';
import {
  patentFamilies,
  defensivePublications,
  tradeSecrets,
  type PatentFamily,
} from '../data/intellectualProperty';

type TabType = 'Patents' | 'Defensive Publications' | 'Formal Trade Secrets';

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function PatentCard({ item }: { item: PatentFamily }) {
  const [open, setOpen] = useState(false);

  const sortedMembers = [...item.members].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const grantedCount = item.members.filter((m) => m.status === 'Granted').length;
  const otherCount = item.members.length - grantedCount;

  return (
    <div className="border border-[#E5E7EB] rounded-3xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-7 md:p-8 hover:bg-[#FAFAFA] transition"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#FFF4EC] text-[#FF6B00]">
                <Shield className="w-3.5 h-3.5" />
                Patent Family
              </span>

              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#0D0D0D]/40">
                {item.jurisdictions.join(' • ')}
              </span>

              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#0D0D0D]/40">
                {item.members.length} members
              </span>
            </div>

            <h3 className="text-2xl md:text-[30px] font-semibold tracking-tight text-[#0D0D0D] leading-snug max-w-5xl">
              {item.familyTitle}
            </h3>

            <p className="mt-4 text-base text-[#0D0D0D]/62 leading-relaxed max-w-4xl flex flex-wrap items-center">
              <span>{item.earliestYear} – {item.latestYear}</span>
              <span className="mx-4 text-[#0D0D0D]/30">•</span>
              <span>{grantedCount} granted</span>
              {otherCount > 0 && (
                <>
                  <span className="mx-4 text-[#0D0D0D]/30">•</span>
                  <span>{otherCount} filed</span>
                </>
              )}
            </p>
          </div>

          <ChevronDown
            className={`w-5 h-5 text-[#0D0D0D]/40 mt-2 shrink-0 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-7 md:px-8 pb-8">
              <div className="border-t border-[#E5E7EB] pt-6">
                <div className="mb-6">
                  <p className="text-[13px] font-mono uppercase tracking-[0.18em] text-[#0D0D0D]/35 mb-2">
                    Inventors
                  </p>
                  <p className="text-[15px] text-[#0D0D0D]/72 leading-relaxed">
                    {item.inventors.join(', ')}
                  </p>
                </div>

                <div className="space-y-4">
                  {sortedMembers.map((member, idx) => (
                    <div
                      key={`${member.number}-${idx}`}
                      className="border border-[#E5E7EB] rounded-2xl p-5 bg-[#FCFCFC]"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-sm font-semibold text-[#0D0D0D]">
                              {member.number}
                            </span>

                            <span className="text-xs uppercase tracking-[0.16em] font-mono text-[#0D0D0D]/40">
                              {member.jurisdiction}
                            </span>

                            <span className="text-xs uppercase tracking-[0.16em] font-mono text-[#0D0D0D]/40">
                              {member.status}
                            </span>
                          </div>

                          <h4 className="text-lg font-medium text-[#0D0D0D] leading-snug">
                            {member.title}
                          </h4>

                          <p className="mt-2 text-sm text-[#0D0D0D]/60">
                            {formatDate(member.date)}
                          </p>
                        </div>

                        {member.link?.trim() ? (
                          <a
                            href={member.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#0A5CE6] hover:opacity-80 transition"
                          >
                            View Document
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimpleCard({
  icon,
  title,
  meta,
  description,
}: {
  icon: ReactNode;
  title: string;
  meta: string;
  description: ReactNode;
}) {
  return (
    <div className="border border-[#E5E7EB] rounded-3xl bg-white p-7 md:p-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#F6F7F8] text-[#0D0D0D]/70 mb-4">
            {icon}
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-[#0D0D0D] leading-snug">
            {title}
          </h3>

          <p className="mt-3 text-sm font-mono uppercase tracking-[0.16em] text-[#0D0D0D]/40">
            {meta}
          </p>

          <div className="mt-5 text-[15px] text-[#0D0D0D]/72 leading-[1.9] max-w-5xl">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntellectualProperty() {
  const [activeTab, setActiveTab] = useState<TabType>('Patents');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatents = useMemo(() => {
    return [...patentFamilies]
      .sort((a, b) => b.latestYear - a.latestYear)
      .filter((item) =>
        `${item.familyTitle} ${item.inventors.join(' ')} ${item.jurisdictions.join(' ')} ${item.members
          .map((m) => `${m.number} ${m.title}`)
          .join(' ')}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  const filteredDP = useMemo(() => {
    return [...defensivePublications]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((item) =>
        `${item.title} ${item.number} ${item.inventors.join(' ')}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  const filteredTS = useMemo(() => {
    return [...tradeSecrets]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((item) =>
        `${item.title} ${item.inventors.join(' ')}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  return (
    <div className="bg-[#F7F7F5] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-14">
        <div className="max-w-5xl">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF6B00] mb-5">
            Innovation Portfolio
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-[#0D0D0D]">
            INTELLECTUAL <span className="text-[#FF6B00]">PROPERTY</span>
          </h1>

          <p className="mt-8 text-[18px] md:text-[20px] text-[#0D0D0D]/45 leading-[1.9] max-w-4xl">
            A structured portfolio of patent families, defensive publications, and formal trade secrets
            spanning motion control, power electronics, electric drive systems, steer-by-wire, and
            advanced embedded engineering.
          </p>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
          <div className="flex flex-wrap gap-3">
            {(['Patents', 'Defensive Publications', 'Formal Trade Secrets'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-[#0D0D0D] text-white'
                    : 'bg-white text-[#0D0D0D]/65 border border-[#E5E7EB] hover:text-[#0D0D0D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-[360px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/35" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 rounded-full border border-[#E5E7EB] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#0D0D0D]/20"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="space-y-5">
          {activeTab === 'Patents' &&
            filteredPatents.map((item) => <PatentCard key={item.familySlug} item={item} />)}

          {activeTab === 'Defensive Publications' &&
            filteredDP.map((item, idx) => (
              <SimpleCard
                key={`${item.number}-${idx}`}
                icon={<FileText className="w-4 h-4" />}
                title={item.title}
                meta={`${item.number} • ${formatDate(item.date)} • ${item.status}`}
                description={
                  <>
                    <p>
                      Defensive publication documenting a technical concept in electrical drive and motion
                      control systems.
                    </p>
                    <p className="mt-4">
                      <strong>Inventors:</strong> {item.inventors.join(', ')}
                    </p>
                  </>
                }
              />
            ))}

          {activeTab === 'Formal Trade Secrets' &&
            filteredTS.map((item, idx) => (
              <SimpleCard
                key={`${item.title}-${idx}`}
                icon={<Lock className="w-4 h-4" />}
                title={item.title}
                meta={formatDate(item.date)}
                description={
                  <>
                    <p>
                      Protected technical know-how and proprietary engineering methodology maintained as a
                      formal trade secret.
                    </p>
                    <p className="mt-4">
                      <strong>Inventors:</strong> {item.inventors.join(', ')}
                    </p>
                  </>
                }
              />
            ))}
        </div>
      </section>
    </div>
  );
}