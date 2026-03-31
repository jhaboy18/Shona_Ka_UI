import React, { useState } from "react";
import api from "../Api/Api";

const FileUploadCompact = ({ socket, text, setText }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSend = async () => {
    if (!text && !file) return;

    setLoading(true);
    try {
      let fileUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file); // key MUST be "file"
        const res = await api.post("/upload", formData);
        fileUrl = res.data.url;
      }

      socket.emit("send_message", { content: text, file: fileUrl });
      setText("");
      setFile(null);
    } catch (err) {
      console.log(err);
      alert("File send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-3 py-2 rounded-full border border-purple-700 bg-purple-900 text-white outline-none focus:ring-2 focus:ring-purple-500"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <label className="cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="p-2 bg-purple-700 hover:bg-purple-600 rounded-full text-white text-lg">
          📎
        </span>
      </label>

      <button
        onClick={handleSend}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
};

export default FileUploadCompact;