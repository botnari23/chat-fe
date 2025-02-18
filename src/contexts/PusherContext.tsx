"use client";
import { createContext, useEffect, useState, useContext } from "react";
import Pusher from "pusher-js";
type Message = { sender: string; message: string };
type PusherContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};
const PusherContext = createContext<PusherContextType | null>(null);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    console.log("Connecting to Pusher...");
    console.log("Pusher Key:", process.env.NEXT_PUBLIC_PUSHER_KEY);
    console.log("Pusher Cluster:", process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true, // Ensure HTTPS connection
    });

    const channel = pusher.subscribe("chat-channel");
    channel.bind("new-message", (data: { sender: string; message: string }) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <PusherContext.Provider value={{ messages, setMessages }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => useContext(PusherContext);
