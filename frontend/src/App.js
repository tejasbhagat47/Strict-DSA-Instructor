import React, { useState, useRef, useEffect } from 'react';
import { Send, GraduationCap, User, Bot } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "I am your DSA Instructor. Ask me a problem, or get out of my sight." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error: My brain is faster than your internet connection. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };
return (
  <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-mono">
    {/* Header */}
    <header className="p-4 border-b border-red-900 bg-slate-950 flex items-center gap-4 shadow-xl">
      {/* Custom Logo Image */}
      <div className="shrink-0">
        <img 
          src="/logo.png" 
          alt="DSA Logo" 
          className="h-12 w-12 object-contain rounded-md" 
        />
      </div>
      
      <div>
        <h1 className="text-xl font-bold tracking-tighter text-red-500 uppercase leading-none">
          Strict DSA Instructor
        </h1>
        <p className="text-xs text-slate-400 font-sans italic mt-1">
          Algorithms or Nothing.
        </p>
      </div>
    </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-red-600'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-3 rounded-2xl shadow-md ${
                msg.role === 'user' 
                ? 'bg-blue-700 text-white rounded-tr-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse italic text-slate-500 text-sm">
            Instructor is judging your question...
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Explain Merge Sort or don't talk to me..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white p-3 rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;