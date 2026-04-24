import { createContext, useContext, useEffect, useState } from "react";

type AppDataType = {
  patents: any[];
  defensivePublications: any[];
  tradeSecrets: any[];
  experiences: any[];
  education: any[];
  publicationConferences: any[];
  publicationJournals: any[];
  publicationPreprints: any[];
  awards: any[];
  recognitions: any[];
  home: any[];
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
        const isExpired =
          Date.now() - parsed.timestamp > 1 * 60 * 60 * 1000; // 1 hour

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
      const [
        homeRes,
        awardsRes,
        recognitionsRes,
        experienceRes,
        educationRes,
        publicationRes,
        journalsRes,
        preprintsRes,
        patentsRes,
        defensiveRes,
        tradeRes
      ] = await Promise.all([
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=home"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=awards"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=recognitions"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=experience"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=education"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=publication_conferences"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=publication_journals"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=publication_preprints"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=patents"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=defensive_publications"),
        fetch("https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=trade_secrets")
      ]);

      const homeJson = await homeRes.json();
      const awardsJson = await awardsRes.json();
      const recognitionsJson = await recognitionsRes.json();
      const experienceJson = await experienceRes.json();
      const educationJson = await educationRes.json();
      const publicationJson = await publicationRes.json();
      const journalsJson = await journalsRes.json();
      const preprintsJson = await preprintsRes.json();
      const patentsJson = await patentsRes.json();
      const defensiveJson = await defensiveRes.json();
      const tradeJson = await tradeRes.json();

      // 🔥 PATENTS FORMAT
      // Ek helper function banayein fetchAllData ke upar
      // Ek helper function banayein fetchAllData ke upar
      const getValidLink = (pdfData: any) => {
        if (!pdfData) return "";
        
        let linksArray: string[] = [];

        // Agar AppScript ne single string bheji hai jisme enters (\n) ya commas hain
        if (typeof pdfData === 'string') {
          linksArray = pdfData.split(/[\n,; ]+/).filter(Boolean);
        } 
        // Agar pehle se array hai
        else if (Array.isArray(pdfData)) {
          linksArray = pdfData;
        }

        if (linksArray.length > 0) {
          // Sabse pehle woh link dhundo jisme 'http' aur '.pdf' dono ho
          const cleanLink = linksArray.find((l: string) => typeof l === 'string' && l.startsWith('http') && l.includes('.pdf'));
          if (cleanLink) return cleanLink.trim();
          
          // Agar .pdf wala nahi mila toh koi bhi http wala link
          const fallback = linksArray.find((l: string) => typeof l === 'string' && l.startsWith('http'));
          return fallback ? fallback.trim() : "";
        }

        return "";
      };

      // Phir apne mapping mein isko aise use karein:
      const formattedPatents = (patentsJson.patents || []).map((row: any) => ({
        familyTitle: row.usTitle || row.deTitle || row.cnTitle || row.epTitle,
        members: [
          row.usNumber && row.usNumber !== "-" && {
            jurisdiction: "US",
            number: row.usNumber.replace(/[, ]/g, ""),
            date: row.usDate,
            title: row.usTitle,
            status: row.usStatus,
            link: getValidLink(row.usPdf), // ✅ Cleaned Link
          },
          row.deNumber && row.deNumber !== "-" && {
            jurisdiction: "DE",
            number: row.deNumber.replace(/[, ]/g, ""),
            date: row.deDate,
            title: row.deTitle,
            status: row.deStatus,
            link: getValidLink(row.dePdf), // ✅ Cleaned Link
          },
          row.cnNumber && row.cnNumber !== "-" && {
            jurisdiction: "CN",
            number: row.cnNumber.replace(/[, ]/g, ""),
            date: row.cnDate,
            title: row.cnTitle,
            status: row.cnStatus,
            link: getValidLink(row.cnPdf), // ✅ Cleaned Link
          },
          row.epNumber && row.epNumber !== "-" && {
            jurisdiction: "EP",
            number: row.epNumber.replace(/[, ]/g, ""),
            date: row.epDate,
            title: row.epTitle,
            status: row.epStatus,
            link: getValidLink(row.epPdf), // ✅ Cleaned Link
          },
        ].filter(Boolean),
        inventors: row.inventors ? row.inventors.split(",").map((i: string) => i.trim()) : [],
      }));

      // 🔥 DEFENSIVE PUBLICATIONS FORMAT
      const formattedDefensive = (defensiveJson.defensivePublications || []).map((row: any) => ({
        title: row.title,
        number: row.number?.replace(/[, ]/g, ""),
        date: row.date,
        status: row.status,
        inventors: row.inventors
          ? row.inventors.split(",").map((i: string) => i.trim())
          : [],
      }));

      const formattedTradeSecrets = (tradeJson.tradeSecrets || []).map((row: any) => ({
        title: row.title,
        date: row.date,
        inventors: row.inventors
          ? row.inventors.split(",").map((i: string) => i.trim())
          : [],
      }));

      const formattedExperiences = (experienceJson.experiences || []).map((row: any) => ({
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
      }));

      const formattedEducation = (educationJson.education || []).map((row: any) => ({
        university: row.university,
        college: row.college,
        degree: row.degree,
        specialization: row.specialization,
        year: row.year,
        location: row.location,
        gpa: row.gpa,

        universityDesc: row.universityDesc,
        preritDesc: row.preritDesc,
        degreeDesc: row.degreeDesc,

        mediaLinks: Array.isArray(row.mediaLinks) ? row.mediaLinks : [],
        externalLinks: row.externalLinks
      }));

      const formattedPublications = (publicationJson.publicationConferences || []).map((row: any) => ({
        title: row.title,
        organization: row.organization,
        event: row.event,
        year: row.year,
        link: row.externalLinks?.[0] || ""
      }));

      const formattedJournals = (journalsJson.publicationJournals || []).map((row: any) => ({
        title: row.title,
        organization: row.organization,
        division: row.division,
        year: row.year,
        link: row.externalLinks?.[0] || ""
      }));

      const formattedPreprints = (preprintsJson.publicationPreprints || []).map((row: any) => ({
        platform: row.platform,
        date: row.date,
        title: row.title,
        link: row.externalLinks?.[0] || ""
      }));

      const formattedAwards = (awardsJson.awards || []).map((row: any) => ({
        year: row.year,
        organization: row.organization,
        title: row.title,
        summary: row.summary,
        description: row.description
      }));

      const formattedRecognitions = (recognitionsJson.recognitions || []).map((row: any) => ({
        organization: row.organization,
        title: row.title,
        summary: row.summary,
        description: row.description
      }));

      const formattedHome = (homeJson.home || []).map((row: any) => ({
        name: row.name || "",
        tags: row.tags
          ? row.tags.split(",").map((t: string) => t.trim())
          : [],
        domain: row.domain || "",
        shortBio: row.shortBio || "",
        achievements: row.achievements || "",

        // 🔗 SAFE LINKS
        links: {
          linkedin: Array.isArray(row.linkedin) ? row.linkedin[0] : row.linkedin || "",
          scholar: Array.isArray(row.scholar) ? row.scholar[0] : row.scholar || "",
          patents: Array.isArray(row.patents) ? row.patents[0] : row.patents || "",
        },
        // 🧱 CARDS CLEAN STRUCTURE
        cards: [
          row.card1 || "",
          row.card2 || "",
          row.card3 || "",
        ].filter(Boolean),

        // 🖼️ PHOTO
        photo: Array.isArray(row.photo) ? row.photo[0] : row.photo || "",
      }));

      const finalData = {
        patents: formattedPatents,
        defensivePublications: formattedDefensive,
        tradeSecrets: formattedTradeSecrets,
        experiences: formattedExperiences,
        education: formattedEducation,
        publicationConferences: formattedPublications,
        publicationJournals: formattedJournals,
        publicationPreprints: formattedPreprints,
        awards: formattedAwards,
        recognitions: formattedRecognitions,
        home: formattedHome
      };

      // ✅ CACHE SAVE
      localStorage.setItem(
        "appData",
        JSON.stringify({
          data: finalData,
          timestamp: Date.now(),
        })
      );

      setData(finalData);
      setLoading(false);
    } catch (err) {
      console.error("DATA FETCH ERROR:", err);
      setLoading(false); // 🔥 FIX
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