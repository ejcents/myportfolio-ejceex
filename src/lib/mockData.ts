// Shared mock data store for announcements
export const mockAnnouncements = [
  {
    id: '1',
    title: 'Welcome to My Portfolio',
    content: 'Thank you for visiting my portfolio! I\'m excited to share my work with you.',
    authorName: 'Efren Jacob Centillas',
    authorEmail: 'contact@ejceex.tk',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'New Project Launch',
    content: 'I\'m excited to announce the launch of my latest project! Check it out in the portfolio section.',
    authorName: 'Efren Jacob Centillas',
    authorEmail: 'contact@ejceex.tk',
    isPublished: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];
