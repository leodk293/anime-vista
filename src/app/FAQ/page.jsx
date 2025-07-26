"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      id: 1,
      category: "General",
      question: "What is this anime website about?",
      answer:
        "Our website is a comprehensive platform dedicated to anime enthusiasts. We provide reviews, recommendations, news, episode guides, and a community space for anime fans to discuss their favorite series and discover new ones.",
    },
    {
      id: 2,
      category: "General",
      question: "Is this website free to use?",
      answer:
        "Yes, our website is completely free to use. You can browse anime reviews, read articles, and access most of our content without any subscription or payment required.",
    },
    {
      id: 3,
      category: "Account",
      question: "Do I need to create an account?",
      answer:
        "While you can browse most content without an account, creating one allows you to save your favorite anime, write reviews, participate in discussions, and receive personalized recommendations.",
    },
    {
      id: 4,
      category: "Content",
      question: "How often is new content added?",
      answer:
        "We update our content regularly! New anime reviews are published weekly, news articles are posted daily, and our database is continuously updated with the latest anime releases and information.",
    },
    {
      id: 5,
      category: "Content",
      question: "Can I request reviews for specific anime?",
      answer:
        "Absolutely! We love hearing from our community. You can submit anime review requests through our contact page or by participating in our community forums. We prioritize popular requests and trending series.",
    },
    {
      id: 6,
      category: "Content",
      question: "Do you have content in languages other than English?",
      answer:
        "Currently, our primary content is in English. However, we're working on expanding to include subtitles and content in other languages. Stay tuned for updates on multi-language support.",
    },
    {
      id: 7,
      category: "Technical",
      question: "Why is the website loading slowly?",
      answer:
        "Slow loading can be due to various factors including your internet connection, browser cache, or high traffic. Try clearing your browser cache, checking your internet connection, or accessing the site during off-peak hours.",
    },
    {
      id: 8,
      category: "Technical",
      question: "Which browsers are supported?",
      answer:
        "Our website works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience.",
    },
    {
      id: 9,
      category: "Community",
      question: "Can I contribute content to the website?",
      answer:
        "Yes! We welcome contributions from our community. You can submit anime reviews, write articles, or participate in our forums. Contact us through the contact page if you're interested in becoming a regular contributor.",
    },
    {
      id: 10,
      category: "Community",
      question: "What are the community guidelines?",
      answer:
        "We maintain a respectful and inclusive community. Be kind to other users, avoid spoilers without warnings, respect different opinions about anime, and keep discussions on-topic. Full guidelines are available in our community section.",
    },
    {
      id: 11,
      category: "Legal",
      question: "Do you stream anime episodes?",
      answer:
        "No, we do not stream anime episodes. We provide reviews, information, and discussions about anime series. We always encourage users to watch anime through official, legal streaming platforms.",
    },
  ];

  const categories = [...new Set(faqData.map((item) => item.category))];

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our anime website and
            services.
          </p>
        </div>

        
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-gray-200 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 bg-blue-800 text-white rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-200 text-lg">
                No questions found matching your search.
              </p>
            </div>
          ) : (
            filteredFAQ.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full px-6 py-4 text-left cursor-pointer "
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="inline-block px-3 py-1 bg-gray-600 text-white text-xs rounded-full mr-3 mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-100">
                        {item.question}
                      </h3>
                    </div>
                    {openQuestion === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                </button>

                {openQuestion === item.id && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-100 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-white/5 rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <Link href={"/contact"}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 px-6 rounded-lg transition-colors">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
