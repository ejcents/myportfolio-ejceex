"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  age: string;
  experience: string;
}

interface About {
  subtitle: string;
  heading: string;
  description: string;
  education: string;
  interests: string[];
}

interface Availability {
  available: boolean;
  message: string;
}

interface Contact {
  email: string;
  phone: string;
  address: string;
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  about: About;
  availability: Availability;
  contact: Contact;
}

interface PortfolioContextType {
  portfolioData: PortfolioData;
  updatePortfolioData: (data: Partial<PortfolioData>) => void;
}

const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Efren Jacob Centillas",
    title: "Creative Designer",
    location: "Buenavista, Bohol",
    age: "21 years",
    experience: "4+ years"
  },
  about: {
    subtitle: "Learn more about my creative skills.",
    heading: "Creative Designer with a Passion for Innovation",
    description: "As a creative designer, I use my passion for design to create visually stunning and user-friendly ",
    education: "University of Technology, 2018-2022",
    interests: ["Web Development", "Machine Learning", "UI/UX Design", "Open Source", "Cloud Computing", "Mobile Development"]
  },
  availability: {
    available: true,
    message: "I'm currently available for freelance work and full-time opportunities. My typical response time is within 24 hours."
  },
  contact: {
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA"
  }
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      try {
        setPortfolioData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      }
    }
  }, []);

  // Listen for portfolio data updates from admin panel
  useEffect(() => {
    const handlePortfolioUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setPortfolioData(event.detail);
      }
    };

    // Add event listener
    window.addEventListener('portfolioDataUpdated', handlePortfolioUpdate as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('portfolioDataUpdated', handlePortfolioUpdate as EventListener);
    };
  }, []);

  // Update portfolio data
  const updatePortfolioData = (newData: Partial<PortfolioData>) => {
    setPortfolioData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("portfolioData", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <PortfolioContext.Provider value={{ portfolioData, updatePortfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
