import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import apiUpload from "../Api/apiUpload";
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

  // ✅ LOAD USER
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser({
          id: savedUser._id,
          name: savedUser.name,
          profilePic: savedUser.profilePic || DEFAULT_IMG,
        });
      }
    } catch {}
  }, []);

  // ✅ SOCKET
  useEffect(() => {
    if (!token || !user.id) return;

    socket.current = io("https://shona-backend-ea93.onrender.com", {
      transports: ["websocket"],
      auth: { token },
    });

    socket.current.on("connect", () => {
      socket.current.emit("join", {
        name: user.name,
        profilePic: user.profilePic,
      });
    });

    socket.current.on("load_messages", setMessages);

    socket.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.current.on("delete_message", (id) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    });

    return () => socket.current.disconnect();
  }, [token, user]);

  // ✅ SCROLL
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // ✅ SEND
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
        name: user.name,
        profilePic: user.profilePic,
      });

      setText("");
      setFile(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-screen p-4 bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white relative">

      {/* HEADER */}
      <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-2xl mb-4 shadow-md">
        <img
          src="a"
          onClick={toggleProfile}
          className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>
      </div>

      {/* PROFILE */}
      {isProfileOpen && (
        <div onClick={toggleProfile} className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <img src={user.profilePic} className="w-72 h-72 rounded-full border-4 border-purple-500" />
        </div>
      )}

      {/* MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} currentUserId={user.id} />
        ))}
      </div>

      {/* INPUT */}
      <div className="relative">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="w-full pl-12 pr-16 py-2 rounded-full bg-gray-800"
        />

        <label className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          📎
        </label>

        <button
          onClick={handleSend}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 px-4 py-1 rounded-full"
        >
          {loading ? "..." : "send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;