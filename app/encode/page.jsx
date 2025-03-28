'use client';

import { useState } from 'react';

export default function Encode() {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');

  const handleEncode = () => {
    setEncoded(btoa(input));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-xl shadow-xl text-white">
        <h1 className="text-3xl font-bold mb-4 text-center">🔐 Encode Message</h1>
        <textarea
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white mb-4 text-white"
          rows={4}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleEncode}
          className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition"
        >
          Encode
        </button>
        {encoded && (
          <div className="mt-4">
            <p className="font-semibold mb-1">Encoded Output:</p>
            <pre className="bg-black/30 p-3 rounded-lg overflow-auto break-all">{encoded}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
