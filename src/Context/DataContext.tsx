import { createContext, useContext, useEffect, useState } from "react";

type AppDataType = {
  patents: any[];
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
      // ✅ CACHE HIT
      setData(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=patents",
      );

      const text = await res.text();
      const json = JSON.parse(text);

      // 🔥 FORMAT DATA (IMPORTANT)
      const formattedPatents = json.patents.map((row: any) => ({
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

      const finalData = {
        patents: formattedPatents,
      };

      // ✅ SAVE CACHE
      localStorage.setItem("appData", JSON.stringify(finalData));

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
