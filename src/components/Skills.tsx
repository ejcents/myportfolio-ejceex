"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Database, Globe, Smartphone, Palette, Server } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

const iconMap = {
  Globe,
  Server,
  Database,
  Smartphone,
  Palette,
  Code
};

export default function Skills() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -30]);
  const { portfolioData } = usePortfolio();

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {portfolioData.skills?.description || "Skills & Technologies"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {portfolioData.skills?.subtitle || "A comprehensive overview of my creative design skills and artistic capabilities."}
          </p>
        </motion.div>

        <motion.div 
          style={{ y }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {portfolioData.skills?.categories?.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                {iconMap[category.icon as keyof typeof iconMap] && (
                  React.createElement(iconMap[category.icon as keyof typeof iconMap], { className: "text-white", size: 28 })
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Proficiency Levels
          </h3>
          <div className="space-y-6">
            {portfolioData.skills?.proficiency?.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-gray-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
