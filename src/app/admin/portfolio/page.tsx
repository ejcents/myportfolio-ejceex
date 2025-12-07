"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, LogOut, User, Mail, MapPin, Calendar, Briefcase, Edit2, Check, MessageSquare, Clock, CheckCircle, AlertCircle, Settings, BarChart3, Users, FileText, ArrowRight, Plus, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";
import AdminLayout from "@/components/AdminLayout";

export default function PortfolioPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, login, logout } = useAdminAuth();
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {
      name: "Efren Jacob Centillas",
      title: "Graphic Designer",
      location: "Buenavista, Bohol",
      age: "21 years",
      experience: "4+ years",
      profileImage: "/profile-placeholder.jpg"
    },
    about: {
      subtitle: "Explore my design journey and artistic vision.",
      heading: "Graphic Designer with a Passion for Visual Storytelling",
      description: "As a passionate graphic designer, I create stunning visual experiences that bring brands to life. I specialize in brand identity, digital illustrations, and creative design solutions that help businesses communicate their unique story and stand out in today's competitive market.",
      education: "Bachelor of Fine Arts in Graphic Design, 2018-2022",
      interests: ["Brand Design", "Digital Illustration", "Typography", "Color Theory", "Logo Design", "Print Design"]
    },
    skills: {
      subtitle: "A comprehensive overview of my design skills and creative tools.",
      description: "Design Skills & Tools",
      categories: [
        {
          title: "Brand Identity",
          icon: "Palette",
          skills: ["Logo Design", "Brand Guidelines", "Visual Identity", "Brand Strategy", "Color Systems", "Typography"],
          color: "from-purple-400 to-purple-600"
        },
        {
          title: "Digital Design", 
          icon: "Globe",
          skills: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Sketch", "Canva Pro", "Affinity Designer"],
          color: "from-pink-400 to-pink-600",
        },
        {
          title: "Print Design",
          icon: "Code",
          skills: ["Adobe InDesign", "Print Layout", "Package Design", "Editorial Design", "Brochure Design"],
          color: "from-orange-400 to-orange-600"
        },
        {
          title: "Illustration",
          icon: "Smartphone",
          skills: ["Digital Illustration", "Vector Art", "Character Design", "Icon Design", "Infographic Design"],
          color: "from-red-400 to-red-600"
        },
        {
          title: "Motion Graphics",
          icon: "Database",
          skills: ["Adobe After Effects", "Motion Design", "Animation Principles", "Video Editing", "3D Design"],
          color: "from-indigo-400 to-indigo-600"
        },
        {
          title: "Traditional Art",
          icon: "Server",
          skills: ["Drawing", "Painting", "Sketching", "Watercolor", "Mixed Media", "Art Theory"],
          color: "from-teal-400 to-teal-600"
        }
      ],
      proficiency: [
        { name: "Brand Identity Design", level: 95 },
        { name: "Digital Illustration", level: 90 },
        { name: "Print Design", level: 85 },
        { name: "Motion Graphics", level: 75 },
        { name: "Typography", level: 88 },
      ]
    },
    projects: {
      subtitle: "A selection of my recent design work and creative projects that showcase my skills and artistic vision.",
      description: "Featured Design Work",
      projects: [
        {
          title: "Brand Identity for Tech Startup",
          description: "Complete brand identity design including logo, color palette, typography guidelines, and marketing materials for a innovative tech startup.",
          image: "/api/placeholder/400/250",
          technologies: ["Logo Design", "Brand Guidelines", "Typography", "Color Theory", "Adobe Illustrator"],
          liveUrl: "",
          githubUrl: "",
          featured: true
        },
        {
          title: "Digital Illustration Series",
          description: "A series of digital illustrations for a children's book, featuring vibrant characters and engaging visual storytelling.",
          image: "/api/placeholder/400/250",
          technologies: ["Digital Illustration", "Character Design", "Adobe Photoshop", "Procreate", "Color Theory"],
          liveUrl: "",
          githubUrl: "",
          featured: true
        },
        {
          title: "Print Design Campaign",
          description: "Comprehensive print design campaign including brochures, flyers, and packaging design for a sustainable fashion brand.",
          image: "/api/placeholder/400/250",
          technologies: ["Print Design", "Adobe InDesign", "Layout Design", "Typography", "Package Design"],
          liveUrl: "",
          githubUrl: "",
          featured: false
        },
        {
          title: "Motion Graphics Reel",
          description: "Dynamic motion graphics reel showcasing animation skills, logo animations, and visual effects for various client projects.",
          image: "/api/placeholder/400/250",
          technologies: ["Motion Graphics", "Adobe After Effects", "Animation", "Video Editing", "3D Design"],
          liveUrl: "",
          githubUrl: "",
          featured: false
        },
        {
          title: "UI/UX Design for Mobile App",
          description: "User interface and experience design for a mobile application, including wireframes, prototypes, and design system.",
          image: "/api/placeholder/400/250",
          technologies: ["UI Design", "UX Design", "Figma", "Prototyping", "Design Systems"],
          liveUrl: "",
          githubUrl: "",
          featured: false
        },
        {
          title: "Editorial Design Magazine",
          description: "Complete editorial design for a quarterly magazine, including layout design, typography, and cover artwork.",
          image: "/api/placeholder/400/250",
          technologies: ["Editorial Design", "Adobe InDesign", "Typography", "Layout Design", "Print Design"],
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
  });
  const [interestsInput, setInterestsInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  // Redirect non-admin users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // Load portfolio data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPortfolioData(prev => ({
          ...prev,
          ...parsedData,
          // Ensure skills data exists, merge with defaults if missing
          skills: {
            ...prev.skills,
            ...(parsedData.skills || {})
          },
          // Ensure projects data exists, merge with defaults if missing
          projects: {
            ...prev.projects,
            ...(parsedData.projects || {})
          }
        }));
        // Initialize interests input
        if (parsedData.about?.interests && Array.isArray(parsedData.about.interests)) {
          setInterestsInput(parsedData.about.interests.join(', '));
        }
      } catch (error) {
        console.error('Error parsing portfolio data:', error);
      }
    } else {
      // Initialize interests input from default data
      setInterestsInput(portfolioData.about.interests.join(', '));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    setSaveStatus("saved");
    addToast('success', 'Portfolio data saved successfully!');
    
    // Trigger a custom event to notify other components of data changes
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: portfolioData }));
    
    setTimeout(() => {
      setSaveStatus("");
      setIsEditing(false);
    }, 1500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to saved data
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPortfolioData(prev => ({
          ...prev,
          ...parsedData,
          // Ensure skills data exists, merge with defaults if missing
          skills: {
            ...prev.skills,
            ...(parsedData.skills || {})
          }
        }));
        // Reset interests input
        if (parsedData.about?.interests && Array.isArray(parsedData.about.interests)) {
          setInterestsInput(parsedData.about.interests.join(', '));
        }
      } catch (error) {
        console.error('Error parsing portfolio data:', error);
      }
    }
  };

  const updateData = (section: string, field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      addToast('error', 'Please upload a JPEG or PNG image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        updateData('personalInfo', 'profileImage', base64String);
        addToast('success', 'Profile image uploaded successfully!');
        setUploadingImage(false);
      };
      reader.onerror = () => {
        addToast('error', 'Failed to read image file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      addToast('error', 'Failed to upload image');
      setUploadingImage(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout 
      title="Portfolio Editor" 
      subtitle="Manage your portfolio content" 
      currentPage="/admin/portfolio"
    >
      <div className="max-w-7xl mx-auto">
        {/* Save Status */}
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              saveStatus === "saved" 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}
          >
            {saveStatus === "saved" ? "Changes saved successfully!" : "Error saving changes"}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                    <p className="text-slate-500 text-sm">Basic profile details</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo?.name || ''}
                    onChange={(e) => updateData('personalInfo', 'name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo?.title || ''}
                    onChange={(e) => updateData('personalInfo', 'title', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo?.location || ''}
                    onChange={(e) => updateData('personalInfo', 'location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo?.age || ''}
                    onChange={(e) => updateData('personalInfo', 'age', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo?.experience || ''}
                    onChange={(e) => updateData('personalInfo', 'experience', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleImageUpload}
                          disabled={!isEditing || uploadingImage}
                          className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      {uploadingImage && (
                        <div className="flex items-center space-x-2 text-indigo-600">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Preview */}
                    {portfolioData.personalInfo?.profileImage && (
                      <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                        <img 
                          src={portfolioData.personalInfo.profileImage} 
                          alt="Profile preview"
                          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">
                            {portfolioData.personalInfo.profileImage.startsWith('data:') 
                              ? 'Custom uploaded image' 
                              : `Using: ${portfolioData.personalInfo.profileImage}`}
                          </p>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => updateData('personalInfo', 'profileImage', '/profile-placeholder.jpg')}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Alternative URL Input */}
                    <div className="border-t border-slate-200 pt-4">
                      <label className="block text-xs font-medium text-slate-500 mb-2">Or enter image URL:</label>
                      <input
                        type="text"
                        value={portfolioData.personalInfo?.profileImage?.startsWith('data:') ? '' : portfolioData.personalInfo?.profileImage || ''}
                        onChange={(e) => updateData('personalInfo', 'profileImage', e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FileText className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">About Section</h2>
                    <p className="text-slate-500 text-sm">Professional summary</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={portfolioData.about?.subtitle || ''}
                    onChange={(e) => updateData('about', 'subtitle', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Heading</label>
                  <input
                    type="text"
                    value={portfolioData.about?.heading || ''}
                    onChange={(e) => updateData('about', 'heading', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={portfolioData.about?.description || ''}
                    onChange={(e) => updateData('about', 'description', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Education</label>
                  <input
                    type="text"
                    value={portfolioData.about?.education || ''}
                    onChange={(e) => updateData('about', 'education', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interests (comma-separated)</label>
                  <input
                    type="text"
                    defaultValue={interestsInput}
                    onBlur={(e) => {
                      setInterestsInput(e.target.value);
                      const interestsArray = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                      setPortfolioData(prev => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          interests: interestsArray.length > 0 ? interestsArray : []
                        }
                      }));
                    }}
                    disabled={!isEditing}
                    placeholder="Brand Design, Digital Illustration, Typography..."
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {portfolioData.about?.interests && Array.isArray(portfolioData.about.interests) && portfolioData.about.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {portfolioData.about.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FileText className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Skills Section</h2>
                    <p className="text-slate-500 text-sm">Technical skills and technologies</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={portfolioData.skills?.description || ''}
                      onChange={(e) => updateData('skills', 'description', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Section Subtitle</label>
                    <input
                      type="text"
                      value={portfolioData.skills?.subtitle || ''}
                      onChange={(e) => updateData('skills', 'subtitle', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skill Categories</label>
                  <div className="space-y-4">
                    {portfolioData.skills?.categories?.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="p-4 bg-slate-50 rounded-xl">
                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Category Title</label>
                            <input
                              type="text"
                              value={category.title}
                              onChange={(e) => {
                                const newCategories = [...(portfolioData.skills?.categories || [])];
                                newCategories[categoryIndex] = { ...category, title: e.target.value };
                                updateData('skills', 'categories', newCategories);
                              }}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Icon</label>
                            <select
                              value={category.icon}
                              onChange={(e) => {
                                const newCategories = [...(portfolioData.skills?.categories || [])];
                                newCategories[categoryIndex] = { ...category, icon: e.target.value };
                                updateData('skills', 'categories', newCategories);
                              }}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              <option value="Palette">Palette</option>
                              <option value="Globe">Globe</option>
                              <option value="Smartphone">Smartphone</option>
                              <option value="Code">Code</option>
                              <option value="Database">Database</option>
                              <option value="Server">Server</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Color</label>
                            <select
                              value={category.color}
                              onChange={(e) => {
                                const newCategories = [...(portfolioData.skills?.categories || [])];
                                newCategories[categoryIndex] = { ...category, color: e.target.value };
                                updateData('skills', 'categories', newCategories);
                              }}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              <option value="from-blue-400 to-blue-600">Blue</option>
                              <option value="from-indigo-400 to-indigo-600">Indigo</option>
                              <option value="from-pink-400 to-pink-600">Pink</option>
                              <option value="from-orange-400 to-orange-600">Orange</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Skills (comma-separated)</label>
                          <input
                            type="text"
                            defaultValue={Array.isArray(category.skills) ? category.skills.join(', ') : ''}
                            onBlur={(e) => {
                              const newCategories = [...(portfolioData.skills?.categories || [])];
                              const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                              newCategories[categoryIndex] = { 
                                ...category, 
                                skills: skillsArray
                              };
                              updateData('skills', 'categories', newCategories);
                            }}
                            disabled={!isEditing}
                            placeholder="React, Next.js, TypeScript..."
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Proficiency Levels</label>
                  <div className="space-y-3">
                    {portfolioData.skills?.proficiency?.map((skill, proficiencyIndex) => (
                      <div key={proficiencyIndex} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newProficiency = [...(portfolioData.skills?.proficiency || [])];
                              newProficiency[proficiencyIndex] = { ...skill, name: e.target.value };
                              updateData('skills', 'proficiency', newProficiency);
                            }}
                            disabled={!isEditing}
                            placeholder="Skill name"
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          />
                        </div>
                        <div className="w-24">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => {
                                const newProficiency = [...(portfolioData.skills?.proficiency || [])];
                                newProficiency[proficiencyIndex] = { ...skill, level: parseInt(e.target.value) || 0 };
                                updateData('skills', 'proficiency', newProficiency);
                              }}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            />
                            <span className="text-sm text-slate-600">%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
                    <p className="text-slate-500 text-sm">Contact details</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={portfolioData.contact?.email || ''}
                    onChange={(e) => updateData('contact', 'email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={portfolioData.contact?.phone || ''}
                    onChange={(e) => updateData('contact', 'phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={portfolioData.contact?.address || ''}
                    onChange={(e) => updateData('contact', 'address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FileText className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Projects Section</h2>
                    <p className="text-slate-500 text-sm">Manage your portfolio projects</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Section Headers */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={portfolioData.projects?.description || ''}
                      onChange={(e) => updateData('projects', 'description', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Section Subtitle</label>
                    <input
                      type="text"
                      value={portfolioData.projects?.subtitle || ''}
                      onChange={(e) => updateData('projects', 'subtitle', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Projects List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-slate-700">Projects</label>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newProject = {
                            title: "New Project",
                            description: "Project description",
                            image: "/api/placeholder/400/250",
                            technologies: ["React", "TypeScript"],
                            liveUrl: "https://example.com",
                            githubUrl: "https://github.com",
                            featured: false
                          };
                          setPortfolioData(prev => ({
                            ...prev,
                            projects: {
                              ...prev.projects,
                              projects: [...(prev.projects?.projects || []), newProject]
                            }
                          }));
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center space-x-1"
                      >
                        <Plus size={16} />
                        <span>Add Project</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {portfolioData.projects?.projects?.map((project, index) => (
                      <div key={index} className="border border-indigo-100 rounded-xl p-4 bg-slate-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-slate-600">Project {index + 1}</span>
                            {project.featured && (
                              <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full text-xs font-medium border border-orange-200">
                                Featured
                              </span>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => {
                                setPortfolioData(prev => ({
                                  ...prev,
                                  projects: {
                                    ...prev.projects,
                                    projects: prev.projects?.projects?.filter((_, i) => i !== index) || []
                                  }
                                }));
                              }}
                              className="text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => {
                                const newProjects = [...(portfolioData.projects?.projects || [])];
                                newProjects[index] = { ...project, title: e.target.value };
                                updateData('projects', 'projects', newProjects);
                              }}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Live URL</label>
                            <input
                              type="url"
                              value={project.liveUrl}
                              onChange={(e) => {
                                const newProjects = [...(portfolioData.projects?.projects || [])];
                                newProjects[index] = { ...project, liveUrl: e.target.value };
                                updateData('projects', 'projects', newProjects);
                              }}
                              disabled={!isEditing}
                              placeholder="https://example.com"
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">GitHub URL</label>
                            <input
                              type="url"
                              value={project.githubUrl}
                              onChange={(e) => {
                                const newProjects = [...(portfolioData.projects?.projects || [])];
                                newProjects[index] = { ...project, githubUrl: e.target.value };
                                updateData('projects', 'projects', newProjects);
                              }}
                              disabled={!isEditing}
                              placeholder="https://github.com"
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Image URL</label>
                            <input
                              type="text"
                              value={project.image}
                              onChange={(e) => {
                                const newProjects = [...(portfolioData.projects?.projects || [])];
                                newProjects[index] = { ...project, image: e.target.value };
                                updateData('projects', 'projects', newProjects);
                              }}
                              disabled={!isEditing}
                              placeholder="/api/placeholder/400/250"
                              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...(portfolioData.projects?.projects || [])];
                              newProjects[index] = { ...project, description: e.target.value };
                              updateData('projects', 'projects', newProjects);
                            }}
                            disabled={!isEditing}
                            rows={2}
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm resize-none"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-xs font-medium text-slate-600 mb-1">Technologies (comma-separated)</label>
                          <input
                            type="text"
                            value={project.technologies.join(', ')}
                            onChange={(e) => {
                              const techArray = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                              const newProjects = [...(portfolioData.projects?.projects || [])];
                              newProjects[index] = { ...project, technologies: techArray };
                              updateData('projects', 'projects', newProjects);
                            }}
                            disabled={!isEditing}
                            placeholder="React, TypeScript, Tailwind CSS"
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          />
                        </div>

                        <div className="mt-4 flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`featured-${index}`}
                            checked={project.featured}
                            onChange={(e) => {
                              const newProjects = [...(portfolioData.projects?.projects || [])];
                              newProjects[index] = { ...project, featured: e.target.checked };
                              updateData('projects', 'projects', newProjects);
                            }}
                            disabled={!isEditing}
                            className="w-4 h-4 text-indigo-600 border-indigo-200 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <label htmlFor={`featured-${index}`} className="text-sm font-medium text-slate-700">
                            Featured Project
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Availability</h2>
                    <p className="text-slate-500 text-sm">Work availability status</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={portfolioData.availability?.available || false}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        available: e.target.checked
                      }
                    }))}
                    disabled={!isEditing}
                    className="w-5 h-5 text-indigo-600 border-indigo-200 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-slate-700">
                    Available for work
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Availability Message</label>
                  <textarea
                    value={portfolioData.availability?.message || ''}
                    onChange={(e) => updateData('availability', 'message', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={18} />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Instructions</h2>
              
              <div className="space-y-3 text-sm text-slate-600">
                <p>• Click "Edit Portfolio" to enable editing</p>
                <p>• Make changes to any field</p>
                <p>• Click "Save Changes" to save your updates</p>
                <p>• Click "Cancel" to discard changes</p>
                <p>• Data is saved automatically to browser storage</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Edit/Save Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed bottom-8 right-8 z-50"
      >
        {!isEditing ? (
          <div>
            {/* Edit Button */}
          <motion.button
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full p-4 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <Edit2 size={20} className="relative z-10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
              Edit Portfolio
            </motion.div>
          </motion.button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {/* Save and Cancel Buttons */}
            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <Save size={20} className="relative z-10" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap"
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                Save Changes
              </motion.div>
            </motion.button>
            
            {/* Cancel Button */}
            <motion.button
              onClick={() => setIsEditing(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full p-3 shadow-2xl hover:shadow-slate-500/25 transition-all duration-300"
            >
              <X size={16} className="relative z-10" />
              
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap"
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                Cancel
              </motion.div>
            </motion.button>
          </div>  
        )}
      </motion.div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Admin Footer */}
      <AdminFooter />
    </AdminLayout>
  );
}
