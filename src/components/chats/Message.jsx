import React, { useState } from "react";
import moment from "moment";

const Message = ({ msg, currentUserId }) => {
  const isSender = msg.sender?._id === currentUserId;
  const [mediaModal, setMediaModal] = useState(null);

  // check if file is video
  const isVideo = msg.file?.match(/\.(mp4|mov|webm)$/i);

  return (
    <>
      <div
        className={`flex flex-col max-w-xs break-words ${
          isSender ? "self-end items-end" : "self-start items-start"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-2xl ${
            isSender ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-100"
          }`}
        >
          {msg.content && <p>{msg.content}</p>}

          {msg.file && (
            <div className="mt-2 cursor-pointer" onClick={() => setMediaModal(msg.file)}>
              {isVideo ? (
                <video
                  src={msg.file}
                  className="rounded-lg max-w-xs"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={msg.file}
                  alt="attachment"
                  className="rounded-lg max-w-xs"
                />
              )}
            </div>
          )}
        </div>

        <span className="text-xs text-gray-400 mt-1">
          {msg.sender?.name || "Unknown"} • {moment(msg.createdAt).format("HH:mm")}
        </span>
      </div>

      {/* Media Modal */}
      {mediaModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setMediaModal(null)}
        >
          {isVideo ? (
            <video src={mediaModal} controls autoPlay className="max-h-full max-w-full rounded-lg" />
          ) : (
            <img src={mediaModal} className="max-h-full max-w-full rounded-lg" />
          )}
          <a
            href={mediaModal}
            download
            className="absolute top-5 right-5 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 z-50"
          >
            Download
          </a>
        </div>
      )}
    </>
  );
};

export default Message;