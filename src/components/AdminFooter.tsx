"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Database, ArrowUp, Github, Mail, User, MessageSquare, Users, Activity, LayoutDashboard } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminFooter() {
  const { role, isSuperAdmin, isSystemAdmin } = useAdminAuth();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Role-specific configurations
  const getRoleConfig = () => {
    if (isSuperAdmin) {
      return {
        title: "Super Admin Panel",
        description: "Ultimate administration dashboard with full system control and user management.",
        icon: Shield,
        color: "from-purple-500 to-pink-500",
        links: [
          { icon: LayoutDashboard, href: "/super", label: "Dashboard" },
          { icon: MessageSquare, href: "/super/messages", label: "Messages" },
          { icon: Users, href: "/super/users", label: "User Management" },
          { icon: Shield, href: "/super/profile", label: "Profile" }
        ]
      };
    } else if (isSystemAdmin) {
      return {
        title: "System Admin Panel",
        description: "System administration dashboard for infrastructure management and communications.",
        icon: Settings,
        color: "from-blue-500 to-cyan-500",
        links: [
          { icon: LayoutDashboard, href: "/system", label: "Dashboard" },
          { icon: MessageSquare, href: "/system/messages", label: "Messages" },
          { icon: Shield, href: "/system/profile", label: "Profile" }
        ]
      };
    } else {
      return {
        title: "Admin Panel",
        description: "Secure administration dashboard for portfolio management and analytics.",
        icon: Settings,
        color: "from-indigo-500 to-cyan-500",
        links: [
          { icon: LayoutDashboard, href: "/admin", label: "Dashboard" },
          { icon: MessageSquare, href: "/admin/messages", label: "Messages" },
          { icon: Database, href: "/admin/portfolio", label: "Portfolio" },
          { icon: Activity, href: "/admin/analytics", label: "Analytics" }
        ]
      };
    }
  };

  const roleConfig = getRoleConfig();

  const supportLinks = [
    { icon: Github, href: "https://github.com", label: "Documentation" },
    { icon: Mail, href: "mailto:support@ejceex.tk", label: "Support" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-auto w-screen relative left-1/2 right-1/2 -translate-x-1/2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Role Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${roleConfig.color} rounded-lg flex items-center justify-center`}>
                <roleConfig.icon className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">{roleConfig.title}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              {roleConfig.description}
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Shield size={14} />
              <span>Secure Access</span>
              {isSuperAdmin && <span>• Full Permissions</span>}
              {isSystemAdmin && <span>• System Control</span>}
              {!isSuperAdmin && !isSystemAdmin && <span>• Limited Access</span>}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Quick Access</h4>
            <ul className="space-y-2">
              {roleConfig.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    <link.icon size={16} />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    <link.icon size={16} />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Portfolio Admin Panel. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Version 2.1.0 | Built with Next.js & TypeScript | Role: {role || 'Guest'}
            </p>
          </div>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        </motion.div>
      </div>
    </footer>
  );
}
