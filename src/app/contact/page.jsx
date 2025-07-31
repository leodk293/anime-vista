"use client";
import React, { useState } from "react";
import { Mail, MessageSquare, Phone, Send, Heart } from "lucide-react";
import Medias from "../../../components/Medias";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: `Anime Website Contact: ${formData.subject}`,
          message: `Subject: ${formData.subject}\n\nMessage: ${formData.message}`,
          from_name: "Anime Website Contact Form",
          to_name: "Anime Website Team",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent mb-4 animate-pulse">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Got questions about anime? Want to suggest a series? We'd love to
            hear from you!
            <Heart
              className="inline ml-2 text-blue-400 animate-pulse"
              size={20}
            />
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
         
          <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <MessageSquare className="mr-3 text-cyan-400" />
              Send us a Message
            </h2>

            {submitted && (
              <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 mb-6 animate-pulse">
                <p className="text-green-300 flex items-center">
                  <Send className="mr-2" size={16} />
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 mb-6">
                <p className="text-red-300 flex items-center">
                  <MessageSquare className="mr-2" size={16} />
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="hidden"
                name="access_key"
                value="YOUR_WEB3FORMS_ACCESS_KEY"
              />
              <input
                type="hidden"
                name="subject"
                value="New Contact Form Submission from Anime Website"
              />
              <input
                type="hidden"
                name="from_name"
                value="Anime Website Contact Form"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    placeholder="Your otaku name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                >
                  <option value="" className="bg-gray-800">
                    Select a topic
                  </option>
                  <option value="anime-recommendation" className="bg-gray-800">
                    Anime Recommendation
                  </option>
                  <option value="website-feedback" className="bg-gray-800">
                    Website Feedback
                  </option>
                  <option value="partnership" className="bg-gray-800">
                    Partnership Inquiry
                  </option>
                  <option value="technical-issue" className="bg-gray-800">
                    Technical Issue
                  </option>
                  <option value="other" className="bg-gray-800">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                  placeholder="Tell us about your favorite anime or what's on your mind..."
                ></textarea>
              </div>

              {/* Honeypot field for spam protection */}
              <input
                type="checkbox"
                name="botcheck"
                style={{ display: "none" }}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="mr-2" size={18} />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6">
                Get in Touch
              </h2>

              <div className="space-y-4">
                <div className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors">
                  <Mail className="mr-4 text-cyan-400" size={20} />
                  <span>atnumberone61@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors">
                  <Phone className="mr-4 text-pink-400" size={20} />
                  <span>+212 0684301801</span>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Quick Answers
              </h3>

              <div className="space-y-4">
                <div className="border-l-4 border-cyan-400 pl-4">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                    Response Time
                  </h4>
                  <p className="text-gray-300">
                    We typically respond within 24 hours during weekdays!
                  </p>
                </div>

                <div className="border-l-4 border-pink-400 pl-4">
                  <h4 className="text-lg font-semibold text-pink-400 mb-2">
                    Anime Requests
                  </h4>
                  <p className="text-gray-300">
                    Got a series you want us to cover? We love suggestions!
                  </p>
                </div>

                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">
                    Partnerships
                  </h4>
                  <p className="text-gray-300">
                    Interested in collaborating? We're always open to new ideas!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
              <Medias />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
