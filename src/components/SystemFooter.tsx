"use client";

import { motion } from "framer-motion";
import { Shield, Settings, Mailbox, User, Github, Linkedin, Twitter } from "lucide-react";

interface SystemFooterProps {
  currentPage?: string;
}

export default function SystemFooter({ currentPage }: SystemFooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Dashboard', href: '/system', icon: Settings },
    { name: 'Messages', href: '/system/messages', icon: Mailbox },
    { name: 'Profile', href: '/system/profile', icon: User },
  ];

  return (
    <footer className="bg-white/90 backdrop-blur-lg border-t border-blue-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">System Admin</h3>
                <p className="text-xs text-slate-500">Management Portal</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Secure system administration and management platform for enterprise operations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      currentPage === link.href
                        ? 'text-blue-600 font-medium'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    <link.icon size={16} />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* System Info */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">System Info</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Version: 2.0.1</li>
              <li>Status: <span className="text-green-600 font-medium">Operational</span></li>
              <li>Security: <span className="text-blue-600 font-medium">Enhanced</span></li>
              <li>Uptime: 99.9%</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Support</h4>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Need assistance? Contact your Super Administrator.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <Github size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <Twitter size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">
              © {currentYear} System Administrator Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
