// src/pages/Contact.tsx
import React, { useState } from "react";
import { Mail, Send, MapPin, Phone, Clock } from "lucide-react";
import toast from "react-hot-toast";

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">ebubeokechukwu13@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">+234 (814) 415-2544</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-600">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="glass-input w-full"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="glass-input w-full"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="glass-input w-full"
                  placeholder="How can we help?"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="glass-input w-full resize-none"
                  placeholder="Tell us what you need help with..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                We'll get back to you within 24 hours
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center gradient-text mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">Is Aloud free to use?</h3>
              <p className="text-gray-600">
                Yes! We offer a free tier with 25 words per session. Premium
                plans are coming soon.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">What languages are supported?</h3>
              <p className="text-gray-600">
                Currently supporting English, with more languages coming soon.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">Can I use Aloud offline?</h3>
              <p className="text-gray-600">
                Not yet, but we're working on an offline mode for premium users.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold mb-2">Is my data private?</h3>
              <p className="text-gray-600">
                Absolutely. We don't store your text content. See our privacy
                policy for details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
