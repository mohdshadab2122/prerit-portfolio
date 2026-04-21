import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAppData } from "../Context/DataContext";

const countries = ["ALL", "US", "DE", "CN", "EP"];

export default function IntellectualProperty() {
  const [activeTab, setActiveTab] = useState("Patents");
  const { data } = useAppData();
  const patentFamilies = data?.patents || [];
  const defensivePublications = data?.defensivePublications || [];
  const tradeSecrets = data?.tradeSecrets || [];
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("ALL");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  console.log("RAW TRADE SECRETS 👉", tradeSecrets);

  const stats = useMemo(() => {
    let totalFamilies = patentFamilies.length;

    let totalFilings = 0;
    let grantedCount = 0;
    let jurisdictions = new Set();

    patentFamilies.forEach((family) => {
      (family.members || []).forEach((m: any) => {
        totalFilings++;

        if (m.status?.toLowerCase() === "grant") {
          grantedCount++;
        }

        jurisdictions.add(m.jurisdiction);
      });
    });

    return {
      totalFamilies,
      totalFilings,
      grantedCount,
      jurisdictions: jurisdictions.size,
    };
  }, [patentFamilies]);

  // 🔥 FILTER
  const filtered = useMemo(() => {
    if (activeTab === "Patents") {
      return patentFamilies.filter((family) => {
        const matchSearch =
          (family.familyTitle || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (family.inventors || [])
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCountry =
          country === "ALL" ||
          (family.members || []).some(
            (m: any) =>
              m.jurisdiction === country ||
              (country === "EP" && m.jurisdiction === "WO"),
          );

        return matchSearch && matchCountry;
      });
    }

    if (activeTab === "Defensive Publications") {
      return defensivePublications.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (activeTab === "Formal Trade Secrets") {
      return tradeSecrets.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return [];
  }, [
    search,
    country,
    activeTab,
    patentFamilies,
    defensivePublications,
    tradeSecrets,
  ]);

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  console.log("STEP 7: PAGINATED 👉", paginated);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, country, activeTab]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-16">
        {/* HEADER */}
        <div className="pt-12 pb-12">
          {/* HEADING */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
            INTELLECTUAL <span className="text-[#FF6B00]">PROPERTY</span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-xl md:text-2xl text-[#0D0D0D]/40 max-w-4xl leading-relaxed font-light mb-12">
            A structured portfolio of patent families, defensive publications,
            and formal trade secrets spanning motion control, power electronics,
            electric drive systems, steer-by-wire, and advanced embedded
            engineering.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {/* CARD 1 */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                Across Jurisdictions
              </p>
              <div className="text-3xl font-semibold tracking-tight">
                {stats.totalFamilies}
                <span className="text-[#FF6B00]">+</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Patent Families
              </p>
            </div>

            {/* CARD 2 */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                US · DE · CN · EP
              </p>
              <div className="text-3xl font-semibold tracking-tight">
                {stats.totalFilings}
                <span className="text-[#FF6B00]">+</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Total Filings
              </p>
            </div>

            {/* CARD 3 */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                Confirmed by Office
              </p>
              <div className="text-3xl font-semibold tracking-tight">
                {stats.grantedCount}
                <span className="text-[#FF6B00]">+</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Granted Patents
              </p>
            </div>

            {/* CARD 4 */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                Global Coverage
              </p>
              <div className="text-3xl font-semibold tracking-tight">
                {stats.jurisdictions}
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Jurisdictions
              </p>
            </div>
          </div>

          {/* SUB TABS */}
          <div className="flex gap-3">
            {["Patents", "Defensive Publications", "Formal Trade Secrets"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearch("");
                    setPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          {/* 🔥 COUNTRY FILTER */}
          {activeTab === "Patents" && (
            <div className="flex gap-2 flex-wrap mt-4 mb-6">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCountry(c);
                    setPage(1);
                  }}
                  className={`px-4 py-2 text-sm border rounded-md ${
                    country === c
                      ? "border-[#FF6B00] text-[#FF6B00]"
                      : "border-[#E5E7EB] text-gray-500"
                  }`}
                >
                  {c === "EP" ? "EP & WO" : c}
                </button>
              ))}
            </div>
          )}

          {/* 🔍 SEARCH */}
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              className="w-full border border-[#E5E7EB] rounded-full pl-10 pr-4 py-2 bg-white focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
              placeholder={
                activeTab === "Patents"
                  ? "Search patents..."
                  : activeTab === "Defensive Publications"
                    ? "Search publications..."
                    : "Search trade secrets..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* PATENTS */}
        {activeTab === "Patents" && (
          <div className="mt-4 border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[40px_2fr_1.6fr_1.6fr_1.6fr_1.6fr_2fr] gap-x-6 px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
              <div>#</div>
              <div>Title</div>
              <div>USA</div>
              <div>Germany</div>
              <div>China</div>
              <div>Europe & World</div>
              <div>Inventors</div>
            </div>

            {paginated.map((family: any, i) => {
              const get = (j: string) => {
                if (j === "EP") {
                  return (
                    family.members.find((m: any) => m.jurisdiction === "EP") ||
                    family.members.find((m: any) => m.jurisdiction === "WO")
                  );
                }
                return family.members.find((m: any) => m.jurisdiction === j);
              };

              const us = get("US");
              const de = get("DE");
              const cn = get("CN");
              const ep = get("EP");

              const grants = family.members.length;

              return (
                <div
                  key={i}
                  className="grid grid-cols-[40px_2fr_1.6fr_1.6fr_1.6fr_1.6fr_2fr] gap-x-6 px-6 py-5 border-b border-[#E5E7EB]"
                >
                  <div>{(page - 1) * itemsPerPage + i + 1}</div>

                  <div className="text-[13px] pr-4">
                    {(() => {
                      const selected =
                        country === "ALL" ? us || de || cn || ep : get(country);

                      return selected?.title || family.familyTitle;
                    })()}
                  </div>

                  {[us, de, cn, ep].map((m, idx) => (
                    <div
                      key={idx}
                      className="text-sm leading-tight pr-3 min-w-0"
                    >
                      {m ? (
                        <>
                          <div className="text-[13px] whitespace-nowrap">
                            {m.number}
                          </div>
                          <div className="text-[10px] text-[#FF6B00]">
                            {m.status}
                          </div>
                          {m.link && (
                            <a
                              href={m.link}
                              target="_blank"
                              className="text-[11px] text-blue-600 hover:underline"
                            >
                              PDF
                            </a>
                          )}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  ))}

                  <div className="text-[13px]">
                    {family.inventors.map((inv: any, idx: any) => (
                      <span key={idx}>
                        {inv.toLowerCase() === "prerit pramod" ? (
                          <span className="font-semibold">Prerit Pramod</span>
                        ) : (
                          inv
                        )}
                        {idx !== family.inventors.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DEFENSIVE PUBLICATIONS */}
        {activeTab === "Defensive Publications" && (
          <div className="mt-10 border border-[#E5E7EB] rounded-xl">
            <div className="grid grid-cols-[2fr_1fr_1fr_2fr] px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
              <div>Title</div>
              <div>Number</div>
              <div>Status</div>
              <div>Inventors</div>
            </div>

            {paginated.map((p: any, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_2fr] px-6 py-4 border-b border-[#E5E7EB]"
              >
                <div>{p.title}</div>
                <div>{p.number}</div>
                <div>{p.status}</div>
                <div>{p.inventors.join(", ")}</div>
              </div>
            ))}
          </div>
        )}

        {/* TRADE SECRETS */}
        {activeTab === "Formal Trade Secrets" && (
          <div className="mt-10 border border-[#E5E7EB] rounded-xl">
            <div className="grid grid-cols-[2fr_1fr_2fr] px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
              <div>Title</div>
              <div>Date</div>
              <div>Inventors</div>
            </div>

            {paginated.map((t: any, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_2fr] px-6 py-4 border-b border-[#E5E7EB]"
              >
                <div className="break-words pr-6">{t.title}</div>
                <div>{t.date}</div>
                <div>{t.inventors.join(", ")}</div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* PREV */}
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm"
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-sm rounded-md ${
                page === i + 1
                  ? "bg-black text-white"
                  : "border border-[#E5E7EB] text-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* NEXT */}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
