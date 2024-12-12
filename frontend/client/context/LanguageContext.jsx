"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getDictionary } from "@/app/[lang]/dictionaries";

const LanguageContext = createContext();

export const LanguageProvider = ({ children, initialLang }) => {
  const [currentLang, setCurrentLang] = useState(initialLang || "en");
  const [dict, setDict] = useState({});

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(currentLang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, dict }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
