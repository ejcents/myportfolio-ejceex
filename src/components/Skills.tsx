"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Database, Globe, Smartphone, Palette, Server } from "lucide-react";

export default function Skills() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -30]);
  
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Globe,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Backend Development", 
      icon: Server,
      skills: ["Node.js", "Express", "Python", "Django", "REST APIs", "GraphQL"],
      color: "from-indigo-400 to-indigo-600",
    },
    {
      title: "Database",
      icon: Database,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Mobile Development",
      icon: Smartphone,
      skills: ["React Native", "Flutter", "iOS", "Android"],
      color: "from-pink-400 to-pink-600"
    },
    {
      title: "UI/UX Design",
      icon: Palette,
      skills: ["Figma", "Adobe XD", "Sketch", "Responsive Design", "Wireframing"],
      color: "from-orange-400 to-orange-600"
    },
    {
      title: "Tools & Others",
      icon: Code,
      skills: ["Git", "Docker", "AWS", "CI/CD", "Agile", "Jest"],
      color: "from-indigo-400 to-indigo-600"
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and the technologies I work with.
          </p>
        </motion.div>

        <motion.div 
          style={{ y }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                <category.icon className="text-white" size={28} />
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
            {[
              { name: "Frontend Development", level: 90 },
              { name: "Backend Development", level: 85 },
              { name: "Database Management", level: 80 },
              { name: "UI/UX Design", level: 75 },
              { name: "Mobile Development", level: 70 },
            ].map((skill) => (
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
