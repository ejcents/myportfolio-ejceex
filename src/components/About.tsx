"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { User, MapPin, Calendar, Briefcase } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

export default function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);
  const { portfolioData } = usePortfolio();
  
  const personalInfo = [
    { icon: User, label: "Name", value: portfolioData.personalInfo.name },
    { icon: MapPin, label: "Location", value: portfolioData.personalInfo.location },
    { icon: Calendar, label: "Age", value: portfolioData.personalInfo.age },
    { icon: Briefcase, label: "Experience", value: portfolioData.personalInfo.experience },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Me
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {portfolioData.about.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ y: y1 }}
          >
            <div className="relative">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={80} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ y: y2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {portfolioData.about.heading}
            </h3>
            <p className="text-gray-600 mb-6">
              {portfolioData.about.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {personalInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <info.icon className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">{info.label}</p>
                    <p className="font-medium text-gray-900">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
              <p className="text-gray-600">
                Bachelor of Science in Information Technology
              </p>
              <p className="text-gray-600 mb-4">
                {portfolioData.about.education}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.about.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
