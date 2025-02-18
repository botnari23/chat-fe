"use client";
import { usePusher } from "@/contexts/PusherContext";

import { useState } from "react";
const axios = require("axios");

export default function Chat() {
  const { messages } = usePusher();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const sendMessage = async () => {
    console.log("API URL:", API_URL); // Debugging

    try {
      await axios.post(
        `${API_URL}/api/chat/message`,
        {
          sender: name || "Anon",
          message,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage("");
    } catch (error: any) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg text-black">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <input
        type="text"
        placeholder="Nume..."
        className="border p-2 w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="border h-60 p-2 overflow-y-auto mb-2">
        {messages.map((msg: any, index: any) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Scrie un mesaj..."
        className="border p-2 w-full mb-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Trimite
      </button>
    </div>
  );
}
