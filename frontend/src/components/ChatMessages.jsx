const ChatMessages = ({ messages, loading }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`${
            msg.role === "user"
              ? "bg-blue-600 self-end text-right"
              : "bg-gray-700 self-start text-left"
          } max-w-[60%] break-words px-4 py-3 rounded-lg`}
        >
          {msg.text}
        </div>
      ))}
      {loading && (
        <div className="self-start px-4 py-3 rounded-lg bg-gray-700 animate-pulse w-24">
          Typing...
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
