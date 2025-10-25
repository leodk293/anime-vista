"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Logo from "../../components/logo/Logo";
import { Onest } from "next/font/google";

const onest = Onest({
  subsets: ["latin"],
  weight: "400",
});

export default function AiAssistant() {
  const { status, data: session } = useSession();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollRef = useRef(null);

  async function fetchAiResponse() {
    try {
      const response = await fetch(`/api/ai-process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI");
      }

      const result = await response.json();
      const aiResponse =
        result.message || "Sorry, I couldn't generate a response.";

      await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRequest: input,
          aiResponse,
          userId: session?.user?.id,
          userName: session?.user?.name,
        }),
      });

      return aiResponse;
    } catch (error) {
      console.error("Error fetching AI response:", error.message);
      return "Sorry, there was an error processing your request. Please try again.";
    }
  }

  async function loadChatHistory() {
    if (!session?.user?.id) return;

    try {
      setIsLoadingHistory(true);
      const response = await fetch(`/api/chats?userId=${session.user.id}`);

      if (!response.ok) {
        throw new Error("Failed to load chat history");
      }

      const result = await response.json();
      const chats = result.chats || [];

      // Convert chat history to messages format
      const chatMessages = [];

      if (chats.length === 0) {
        chatMessages.push({
          sender: "bot",
          text: "Hello! How can I help you today?",
        });
      } else {
        chats.forEach((chat) => {
          chatMessages.push({ sender: "user", text: chat.userRequest });
          chatMessages.push({ sender: "bot", text: chat.aiResponse });
        });
      }

      setMessages(chatMessages);
    } catch (error) {
      console.error("Error loading chat history:", error.message);

      setMessages([
        { sender: "bot", text: "Hello! How can I help you today?" },
      ]);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function deleteChats() {
    const confirmed = window.confirm(
      "Are you sure you want to delete the chat? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/chats?userId=${session?.user?.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chats");
      }

      // Reset messages to initial state
      setMessages([
        { sender: "bot", text: "Hello! How can I help you today?" },
      ]);
    } catch (error) {
      console.error("Error deleting chats:", error.message);
      alert("Failed to delete chats. Please try again.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !session?.user?.id) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      
      const aiResponse = await fetchAiResponse();

      setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadChatHistory();
    } else if (status === "unauthenticated") {
      setIsLoadingHistory(false);
    }
  }, [status, session?.user?.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "loading" || isLoadingHistory) {
    return (
      <div className="w-full p-5 rounded-[10px] bg-gray-900 text-white">
        <div className="flex flex-col h-[400px] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="w-full p-5 rounded-[10px] bg-gray-900 text-white">
        <div className="flex flex-col h-[400px] items-center justify-center">
          <Bot className="w-16 h-16 mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">Please sign in</p>
          <p className="text-sm text-gray-400 text-center">
            You need to be signed in to use the AI assistant
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5 rounded-[10px] bg-gray-900 text-white">
      <div className="flex flex-col h-[400px]">
        {messages.length > 1 && (
          <div className="flex justify-between items-center mb-3">
            <Logo mobileSize={'text-lg'} LaptopSize={'text-xl'}/>
            <Button
              onClick={deleteChats}
              variant="outline"
              size="sm"
              className="border-red-600 bg-transparent text-red-600 cursor-pointer hover:bg-red-600 hover:text-white"
            >
              <Trash2 size={14} className="mr-1" />
              Clear Chat
            </Button>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 overflow-y-auto pr-2 mb-3">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg ${onest.className} px-3 py-2 leading-6 max-w-[80%] text-sm ${
                    msg.sender === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="object-cover rounded-full"
                    width={40}
                    height={40}
                  />
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 justify-start">
                <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-800 rounded-lg px-3 py-2 max-w-[80%] text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            placeholder="Type your message..."
            className="flex-1 h-[80px] rounded-[10px] p-1 bg-slate-800 border-slate-700 text-white placeholder:text-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-sky-600 self-center cursor-pointer hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
