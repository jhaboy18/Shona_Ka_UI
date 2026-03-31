import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../Api/Api";
import apiUpload from "../Api/ApiUpload";
import Message from "../components/chats/Message";

const DEFAULT_IMG =
  "https://res.cloudinary.com/dwfix3h3x/image/upload/v1774942046/tanudp_mrnu2r.jpg";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ id: "", name: "", profilePic: DEFAULT_IMG });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const socket = useRef(null);
  const scrollRef = useRef(null);
  const token = localStorage.getItem("token");

  // ✅ Load user safely
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      console.log("SAVED USER:", savedUser.name);

      if (savedUser) {
        let profile = savedUser.profilePic;

        // validate image
        if (!profile || profile.trim() === "" || !profile.startsWith("http")) {
          profile = DEFAULT_IMG;
        }

        setUser({
          id: savedUser._id,
          name: savedUser.name,
          profilePic: profile.trim(),
        });
      }
    } catch (err) {
      console.log("User parse error:", err);
    }
  }, []);

  // ✅ Socket.io
  useEffect(() => {
    if (!token) return;

    socket.current = io("http://localhost:8000", {
      auth: { token },
    });

    socket.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.current.disconnect();
  }, [token]);

  // ✅ Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/chat");
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, []);

  // ✅ Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  // ✅ Send message
  const handleSend = async () => {
    if (!text && !file) return;

    setLoading(true);

    try {
      let fileUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await apiUpload.post("/upload", formData);
        fileUrl = res.data.url;
      }

      socket.current.emit("send_message", {
        content: text,
        file: fileUrl,
      });

      setText("");
      setFile(null);
    } catch (err) {
      console.log("Send failed:", err);
      alert("File send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-screen p-4 bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white relative">
      
      {/* ✅ HEADER */}
      <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-2xl mb-4 shadow-md">
        <img
          src={user.profilePic}
          alt={user.name}
          onClick={toggleProfile}
          onError={(e) => (e.target.src = DEFAULT_IMG)}
          className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover cursor-pointer"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>
      </div>

      {/* ✅ PROFILE ZOOM */}
      {isProfileOpen && (
        <div
          onClick={toggleProfile}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
        >
          <img
            src={user.profilePic}
            alt={user.name}
            onError={(e) => (e.target.src = DEFAULT_IMG)}
            className="w-72 h-72 rounded-full object-cover border-4 border-purple-500 shadow-2xl"
          />
        </div>
      )}

      {/* ✅ MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 bg-gradient-to-b from-gray-900 via-purple-900 to-black rounded-3xl shadow-lg p-4 mb-4 overflow-y-auto flex flex-col space-y-3"
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((msg) => (
          <Message key={msg._id} msg={msg} currentUserId={user.id} />
        ))}
      </div>

      {/* ✅ INPUT */}
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="w-full pl-12 pr-16 py-2 rounded-full border border-purple-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* 📎 FILE */}
        <label className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <span className="text-xl text-purple-400">📎</span>
        </label>

        {/* 🚀 SEND */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 text-white rounded-full px-4 py-1"
        >
          {loading ? "..." : "send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;