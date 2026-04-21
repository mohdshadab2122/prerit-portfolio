import { createContext, useContext, useEffect, useState } from "react";

type AppDataType = {
  patents: any[];
  defensivePublications: any[];
  tradeSecrets: any[];
  experiences: any[]; // ✅ ADD THIS
};

const DataContext = createContext<{
  data: AppDataType | null;
  loading: boolean;
} | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("appData");

    if (cached) {
      const parsed = JSON.parse(cached);

      if (!parsed.timestamp || !parsed.data) {
        localStorage.removeItem("appData");
      } else {
        const isExpired = Date.now() - parsed.timestamp > 1 * 60 * 60 * 1000; // 1 hour

        if (!isExpired) {
          setData(parsed.data);
          setLoading(false);
          return;
        }
      }
    }

    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [patentsRes, defensiveRes, tradeRes, experienceRes] =
        await Promise.all([
          fetch(
            "https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=patents",
          ),
          fetch(
            "https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=defensive_publications",
          ),
          fetch(
            "https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=trade_secrets",
          ),
          fetch(
            "https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=experience",
          ),
        ]);

      const patentsJson = JSON.parse(await patentsRes.text());
      const defensiveJson = JSON.parse(await defensiveRes.text());
      const tradeJson = JSON.parse(await tradeRes.text());
      const experienceJson = JSON.parse(await experienceRes.text());
      // 🔥 PATENTS FORMAT
      const formattedPatents = patentsJson.patents.map((row: any) => ({
        familyTitle: row.usTitle || row.deTitle || row.cnTitle || row.epTitle,

        members: [
          row.usNumber &&
            row.usNumber !== "-" && {
              jurisdiction: "US",
              number: row.usNumber.replace(/[, ]/g, ""),
              date: row.usDate,
              title: row.usTitle,
              status: row.usStatus,
              link: row.usPdf?.[0],
            },
          row.deNumber &&
            row.deNumber !== "-" && {
              jurisdiction: "DE",
              number: row.deNumber.replace(/[, ]/g, ""),
              date: row.deDate,
              title: row.deTitle,
              status: row.deStatus,
              link: row.dePdf?.[0],
            },
          row.cnNumber &&
            row.cnNumber !== "-" && {
              jurisdiction: "CN",
              number: row.cnNumber.replace(/[, ]/g, ""),
              date: row.cnDate,
              title: row.cnTitle,
              status: row.cnStatus,
              link: row.cnPdf?.[0],
            },
          row.epNumber &&
            row.epNumber !== "-" && {
              jurisdiction: "EP",
              number: row.epNumber.replace(/[, ]/g, ""),
              date: row.epDate,
              title: row.epTitle,
              status: row.epStatus,
              link: row.epPdf?.[0],
            },
        ].filter(Boolean),

        inventors: row.inventors
          ? row.inventors.split(",").map((i: string) => i.trim())
          : [],
      }));

      // 🔥 DEFENSIVE PUBLICATIONS FORMAT
      const formattedDefensive = defensiveJson.defensivePublications.map(
        (row: any) => ({
          title: row.title,
          number: row.number?.replace(/[, ]/g, ""),
          date: row.date,
          status: row.status,
          inventors: row.inventors
            ? row.inventors.split(",").map((i: string) => i.trim())
            : [],
        }),
      );

      const formattedTradeSecrets = tradeJson.tradeSecrets.map((row: any) => ({
        title: row.title,
        date: row.date,
        inventors: row.inventors
          ? row.inventors.split(",").map((i: string) => i.trim())
          : [],
      }));

      const formattedExperiences = experienceJson.experiences.map(
        (row: any) => ({
          company: row.company,
          role: row.role,
          type: row.type,
          period: row.period,
          location: row.location,
          team: row.team,
          department: row.department,
          roleDesc: row.roleDesc,
          companyDesc: row.companyDesc,
          contribution: row.contribution,
          externalLinks: row.externalLinks,
          mediaLinks: Array.isArray(row.mediaLinks) ? row.mediaLinks : [],
        }),
      );

      const finalData = {
        patents: formattedPatents,
        defensivePublications: formattedDefensive,
        tradeSecrets: formattedTradeSecrets,
        experiences: formattedExperiences,
      };

      // ✅ CACHE SAVE
      localStorage.setItem(
        "appData",
        JSON.stringify({
          data: finalData,
          timestamp: Date.now(),
        }),
      );

      setData(finalData);
      setLoading(false);
    } catch (err) {
      console.error("DATA FETCH ERROR:", err);
    }
  };

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAppData must be used inside DataProvider");
  }
  return context;
};
