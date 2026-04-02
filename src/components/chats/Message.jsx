import React, { useState } from "react";
import moment from "moment";

const Message = ({ msg, currentUserId }) => {
  const isSender = msg.sender?.id === currentUserId;
  const [mediaModal, setMediaModal] = useState(null);
  const isVideo = msg.file?.match(/\.(mp4|mov|webm)$/i);

  return (
    <>
      <div className={isSender ? "self-end" : "self-start"}>
        <div className="bg-gray-700 p-2 rounded">
          {msg.content}

          {msg.file && (
            <div onClick={() => setMediaModal(msg.file)}>
              {isVideo ? (
                <video src={msg.file} className="w-40" />
              ) : (
                <img src={msg.file} className="w-40" />
              )}
            </div>
          )}
        </div>

        <span className="text-xs text-gray-400">
          {msg.sender?.name} • {moment(msg.createdAt).format("HH:mm")}
        </span>
      </div>

      {mediaModal && (
        <div onClick={() => setMediaModal(null)} className="fixed inset-0 bg-black/80 flex items-center justify-center">
          {isVideo ? (
            <video src={mediaModal} controls autoPlay />
          ) : (
            <img src={mediaModal} />
          )}
        </div>
      )}
    </>
  );
};

export default Message;