export interface Solution {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string; // Lucide icon name or React node
  metrics: string;
  badge: string;
}

export interface Technology {
  name: string;
  category: 'frontend' | 'ai' | 'cloud' | 'iot' | 'devops' | 'security';
  description: string;
  proficiencyGauge: number; // 0-100
  infoUrl?: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  avatarSeed: string; // used for custom abstract geometric svg avatars
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface ProductVision {
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  timeline: string;
  status: 'Development' | 'Conceptual' | 'Prototype' | 'Alpha' | 'Beta';
  icon: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}
