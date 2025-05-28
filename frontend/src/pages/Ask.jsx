// src/AskPage.js
import React, { useState } from "react";
import axios from "axios";
import { ArrowUp, UserCircle2Icon, Sparkles } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const AskPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [active, setActive] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setActive(false);
    setIsTyping(true);

    // Simulate delay before bot responds
    setTimeout(async () => {
      try {
        const response = await axios.post(`${BASE_URL}/ask`, { query: input });

        const botMessage = {
          text: response.data.result,
          sender: "bot",
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { text: "Error fetching response", sender: "bot" },
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mt-8">
        AI-Powered Smart Assistent
      </h1>
      <div className="w-full max-w-3xl h-full flex flex-col rounded overflow-hidden">
        {/* Message List */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 fade-in-up ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot Icon */}
              {message.sender === "bot" && (
                <div className="mt-1">
                  <Sparkles
                    className="text-gray-500"
                    fill="#111"
                    strokeWidth={1}
                  />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-3 rounded-lg max-w-[75%] ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex items-start space-x-2 fade-in-up">
              <Sparkles className="text-gray-600 mt-1 animate-pulse" />
              <div className="p-3 bg-gray-200 text-gray-700 rounded-lg typing-dots max-w-[75%]"></div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-6 bg-gray-900 flex space-x-2 rounded-3xl mb-8">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-2xl focus:outline-none focus:ring-0 focus:border-gray-600"
            placeholder="Ask me about PDS..."
            value={input}
            onChange={(e) => {
              const value = e.target.value;
              setInput(value);
              setActive(value.trim().length > 0);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className={`p-3 rounded-full ${
              active
                ? "bg-blue-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={!active}
          >
            <ArrowUp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskPage;
