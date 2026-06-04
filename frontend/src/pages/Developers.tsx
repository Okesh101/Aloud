// src/pages/Developers.tsx
import React from "react";
import { Globe, Code, GitBranch } from "lucide-react";

const developers = [
  {
    name: "Okechukwu Goodluck",
    role: "Lead Full Stack Developer",
    bio: "Passionate about creating accessible tech solutions that make life easier for everyone.",
    image:
      "https://ui-avatars.com/api/?background=8B5CF6&color=fff&bold=true&size=120&name=OG",
    github: "https://github.com/Okesh101",
    linkedin: "#",
    twitter: "https://x.com/goodluckdev",
    website: "https://okesh101.github.io/My-Portfolio/",
  },
  // {
  //   name: "Sarah Johnson",
  //   role: "AI/ML Engineer",
  //   bio: "Specializes in natural language processing and speech synthesis technologies.",
  //   image:
  //     "https://ui-avatars.com/api/?background=EC4899&color=fff&bold=true&size=120&name=SJ",
  //   github: "#",
  //   linkedin: "#",
  //   twitter: "#",
  //   website: "#",
  // },
  // {
  //   name: "Michael Chen",
  //   role: "Frontend Developer",
  //   bio: "Creates beautiful, responsive interfaces with focus on user experience.",
  //   image:
  //     "https://ui-avatars.com/api/?background=06B6D4&color=fff&bold=true&size=120&name=MC",
  //   github: "#",
  //   linkedin: "#",
  //   twitter: "#",
  //   website: "#",
  // },
];

export const Developers: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold gradient-text mb-4">Meet the Team</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The passionate minds behind Aloud, dedicated to making content
          accessible to everyone.
        </p>
      </div>

      {/* Team Grid */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="glass-card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative inline-block mb-4">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-32 h-32 rounded-2xl mx-auto border-4 border-white shadow-lg"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition"></div>
              </div>
              <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
              <p className="text-purple-600 font-semibold mb-3">{dev.role}</p>
              <p className="text-gray-600 text-sm mb-4">{dev.bio}</p>
              <div className="flex justify-center space-x-3">
                <a
                  href={dev.github}
                  className="p-2 glass-card rounded-lg hover:bg-white/40 transition"
                >
                  <GitBranch className="w-5 h-5" />
                </a>
                <a
                  href={dev.website}
                  className="p-2 glass-card rounded-lg hover:bg-white/40 transition"
                >
                  <Globe className="w-5 h-5" />
                </a>
                <a
                  href={dev.linkedin}
                  className="p-2 glass-card rounded-lg hover:bg-white/40 transition"
                >
                  <Code className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold gradient-text mb-8">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Python",
              "Flask",
              "PostgreSQL",
              "Piper TTS",
              "Web Audio API",
            ].map((tech) => (
              <div key={tech} className="glass-card p-3">
                <span className="font-semibold">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source */}
        <div className="glass-card p-8 text-center max-w-3xl mx-auto">
          <Code className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Open Source</h2>
          <p className="text-gray-600 mb-6">
            Aloud is proudly open source. Check out our GitHub repository to
            contribute or self-host.
          </p>
          <a href="https://github.com/Okesh101/Aloud" className="glass-button inline-flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Star on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
