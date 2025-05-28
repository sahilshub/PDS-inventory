const ChatInput = ({ input, setInput, handleSend, handleKeyDown }) => {
  return (
    <div className="px-6 py-4 bg-gray-900 border-t border-gray-800">
      <div className="flex items-center gap-3">
        <textarea
          rows={1}
          className="flex-1 resize-none p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask about PDS..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
