"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  age: string;
  experience: string;
  profileImage?: string;
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

interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
  color: string;
}

interface Skills {
  subtitle: string;
  description: string;
  categories: SkillCategory[];
  proficiency: Array<{ name: string; level: number }>;
}

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

interface Projects {
  subtitle: string;
  description: string;
  projects: Project[];
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  about: About;
  skills: Skills;
  projects: Projects;
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
    experience: "4+ years",
    profileImage: "/profile-placeholder.jpg"
  },
  about: {
    subtitle: "Explore my creative design journey and artistic vision.",
    heading: "Creative Designer with a Passion for Innovation",
    description: "As a creative designer, I bring ideas to life through innovative visual solutions that blend artistry with functionality. I specialize in creating compelling brand experiences, digital art, and creative designs that inspire, engage, and transform concepts into memorable visual stories.",
    education: "Bachelor of Fine Arts in Creative Design, 2018-2022",
    interests: ["Creative Direction", "Visual Storytelling", "Digital Art", "Brand Innovation", "Design Thinking", "Creative Strategy"]
  },
  skills: {
    subtitle: "A comprehensive overview of my creative design skills and artistic capabilities.",
    description: "Creative Design Skills",
    categories: [
      {
        title: "Creative Direction",
        icon: "Palette",
        skills: ["Brand Strategy", "Creative Strategy", "Art Direction", "Visual Storytelling", "Design Thinking", "Concept Development"],
        color: "from-purple-400 to-purple-600"
      },
      {
        title: "Digital Art & Design", 
        icon: "Globe",
        skills: ["Digital Illustration", "Vector Art", "Character Design", "Digital Painting", "Concept Art", "Visual Effects"],
        color: "from-pink-400 to-pink-600",
      },
      {
        title: "Brand & Identity",
        icon: "Code",
        skills: ["Logo Design", "Brand Identity", "Visual Systems", "Brand Guidelines", "Packaging Design", "Creative Branding"],
        color: "from-orange-400 to-orange-600"
      },
      {
        title: "Interactive Design",
        icon: "Smartphone",
        skills: ["UI/UX Design", "Web Design", "Mobile Design", "Interactive Prototypes", "User Experience", "Design Systems"],
        color: "from-red-400 to-red-600"
      },
      {
        title: "Motion & Animation",
        icon: "Database",
        skills: ["Motion Graphics", "Animation Design", "Video Editing", "3D Design", "Visual Effects", "Dynamic Content"],
        color: "from-indigo-400 to-indigo-600"
      },
      {
        title: "Traditional Art",
        icon: "Server",
        skills: ["Drawing", "Painting", "Sketching", "Watercolor", "Mixed Media", "Art Fundamentals"],
        color: "from-teal-400 to-teal-600"
      }
    ],
    proficiency: [
      { name: "Creative Direction", level: 95 },
      { name: "Digital Art & Illustration", level: 92 },
      { name: "Brand Identity Design", level: 90 },
      { name: "Interactive Design", level: 85 },
      { name: "Motion & Animation", level: 80 },
      { name: "Visual Storytelling", level: 94 },
    ]
  },
  projects: {
    subtitle: "A selection of my recent creative design projects that showcase my artistic vision and innovative solutions.",
    description: "Featured Creative Work",
    projects: [
      {
        title: "Creative Brand Reimagining",
        description: "Complete creative brand transformation including visual identity, brand strategy, and creative direction for a innovative lifestyle company seeking to reimagine their market presence.",
        image: "/api/placeholder/400/250",
        technologies: ["Creative Direction", "Brand Strategy", "Visual Identity", "Art Direction", "Design Systems"],
        liveUrl: "",
        githubUrl: "",
        featured: true
      },
      {
        title: "Digital Art Exhibition",
        description: "A comprehensive digital art collection featuring original illustrations, concept art, and visual storytelling pieces that explore modern themes through creative expression.",
        image: "/api/placeholder/400/250",
        technologies: ["Digital Art", "Concept Art", "Visual Storytelling", "Digital Illustration", "Creative Direction"],
        liveUrl: "",
        githubUrl: "",
        featured: true
      },
      {
        title: "Interactive Design Experience",
        description: "An innovative interactive design project combining UX/UI design with creative visual elements to create an engaging user experience for a digital platform.",
        image: "/api/placeholder/400/250",
        technologies: ["Interactive Design", "UX/UI Design", "Creative Prototyping", "Visual Design", "User Experience"],
        liveUrl: "",
        githubUrl: "",
        featured: false
      },
      {
        title: "Motion Design Campaign",
        description: "Dynamic motion design campaign featuring animated graphics, visual effects, and creative storytelling for a brand's digital marketing initiative.",
        image: "/api/placeholder/400/250",
        technologies: ["Motion Design", "Animation", "Visual Effects", "Creative Direction", "Video Production"],
        liveUrl: "",
        githubUrl: "",
        featured: false
      },
      {
        title: "Creative Packaging Design",
        description: "Innovative packaging design project that combines creative visual concepts with functional design principles for a sustainable product line.",
        image: "/api/placeholder/400/250",
        technologies: ["Creative Design", "Packaging Design", "Brand Identity", "Visual Systems", "Sustainable Design"],
        liveUrl: "",
        githubUrl: "",
        featured: false
      },
      {
        title: "Art Direction Editorial",
        description: "Complete art direction for a digital editorial publication, featuring creative layouts, visual storytelling, and innovative design concepts.",
        image: "/api/placeholder/400/250",
        technologies: ["Art Direction", "Creative Design", "Editorial Design", "Visual Storytelling", "Layout Design"],
        liveUrl: "",
        githubUrl: "",
        featured: false
      }
    ]
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
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem("portfolioData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setPortfolioData(prev => ({
            ...prev,
            ...parsedData,
            // Ensure nested objects are properly merged with defaults
            skills: {
              ...defaultPortfolioData.skills,
              ...(parsedData.skills || {})
            },
            projects: {
              ...defaultPortfolioData.projects,
              ...(parsedData.projects || {})
            }
          }));
        } catch (error) {
          console.error("Error loading portfolio data:", error);
        }
      }
    }
  }, []);

  // Listen for portfolio data updates from admin panel
  useEffect(() => {
    const handlePortfolioUpdate = (event: CustomEvent<Partial<PortfolioData>>) => {
      setPortfolioData(prev => ({
        ...prev,
        ...event.detail,
        // Ensure nested objects are properly merged with defaults
        skills: {
          ...defaultPortfolioData.skills,
          ...(event.detail.skills || {})
        },
        projects: {
          ...defaultPortfolioData.projects,
          ...(event.detail.projects || {})
        }
      }));
    };

    // Add event listener only on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('portfolioDataUpdated', handlePortfolioUpdate as EventListener);

      // Cleanup
      return () => {
        window.removeEventListener('portfolioDataUpdated', handlePortfolioUpdate as EventListener);
      };
    }
  }, []);

  // Update portfolio data
  const updatePortfolioData = (newData: Partial<PortfolioData>) => {
    setPortfolioData(prev => {
      const updated = { ...prev, ...newData };
      if (typeof window !== 'undefined') {
        localStorage.setItem("portfolioData", JSON.stringify(updated));
      }
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
