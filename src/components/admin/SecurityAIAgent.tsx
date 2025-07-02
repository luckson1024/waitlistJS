import { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import axios from 'axios';

const GEMINI_MODELS = [
  { label: 'Gemini Pro', value: 'gemini-pro' },
  { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
];

const DEFAULT_SYSTEM_INSTRUCTIONS = [
  {
    title: 'Default Security',
    content: 'You are a security AI agent. Answer questions about hacking, security, and system analysis.'
  },
  {
    title: 'Strict Compliance',
    content: 'You are a security AI agent. Only answer questions that comply with strict security and legal guidelines.'
  },
  {
    title: 'Friendly Helper',
    content: 'You are a helpful AI assistant for security topics. Be friendly and concise.'
  }
];

export default function SecurityAIAgent() {
  const { settings } = useSettings();
  const [model, setModel] = useState(settings.geminiModels?.[0] || GEMINI_MODELS[0].value);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check Gemini API key and models
  const geminiApiKey = settings.geminiApiKey;
  const geminiModels = settings.geminiModels || [];

  const [systemInstructions, setSystemInstructions] = useState(() => {
    const saved = localStorage.getItem('systemInstructions');
    return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_INSTRUCTIONS;
  });
  const [selectedInstructionIdx, setSelectedInstructionIdx] = useState(0);
  const [newInstruction, setNewInstruction] = useState('');

  useEffect(() => {
    localStorage.setItem('systemInstructions', JSON.stringify(systemInstructions));
  }, [systemInstructions]);

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setSystemInstructions([
        ...systemInstructions,
        { title: `Custom #${systemInstructions.length + 1}`, content: newInstruction }
      ]);
      setNewInstruction('');
      setSelectedInstructionIdx(systemInstructions.length); // select new
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setMessages(msgs => [...msgs, { role: 'user', content: input }]);
    try {
      const res = await axios.post('/api/v1/ai/security', {
        model,
        messages: [...messages, { role: 'user', content: input }],
        systemInstruction: systemInstructions[selectedInstructionIdx]?.content || ''
      });
      setMessages(msgs => [...msgs, { role: 'assistant', content: res.data.reply }]);
      setInput('');
    } catch (err: any) {
      if (err.response?.status === 401 || (err.response?.data?.error && err.response.data.error.toLowerCase().includes('token'))) {
        setError('Your Gemini API token has expired or is invalid. Please update your API key in Site Settings.');
      } else {
        setError('AI agent error: ' + (err.response?.data?.error || err.message));
      }
    }
    setLoading(false);
  };

  if (!geminiApiKey) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Security AI Agent</h2>
        <div className="text-red-500 font-semibold">Gemini API key is not set in Site Settings.</div>
        <div className="text-gray-500 mt-2">Please add your Gemini API key in the Site Settings &gt; Gemini tab.</div>
      </div>
    );
  }
  if (geminiModels.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Security AI Agent</h2>
        <div className="text-orange-500 font-semibold">Gemini models are not loaded.</div>
        <div className="text-gray-500 mt-2">Please load models in the Site Settings &gt; Gemini tab.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Security AI Agent</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Gemini Model</label>
        <select
          className="border rounded px-3 py-2"
          value={model}
          onChange={e => setModel(e.target.value)}
        >
          {geminiModels.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">System Instruction</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedInstructionIdx}
          onChange={e => setSelectedInstructionIdx(Number(e.target.value))}
        >
          {systemInstructions.map((inst: {title: string, content: string}, idx: number) => (
            <option key={idx} value={idx}>{inst.title}</option>
          ))}
        </select>
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={newInstruction}
            onChange={e => setNewInstruction(e.target.value)}
            placeholder="Add new system instruction..."
          />
          <button
            className="bg-gray-200 px-3 py-2 rounded"
            onClick={handleAddInstruction}
            disabled={!newInstruction.trim()}
          >Add</button>
        </div>
        <div className="text-xs text-gray-500 mt-1">Current: {systemInstructions[selectedInstructionIdx]?.content}</div>
      </div>
      <div className="h-64 overflow-y-auto bg-gray-50 rounded p-3 mb-4 border">
        {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right mb-2' : 'text-left mb-2'}>
            <span className={msg.role === 'user' ? 'bg-orange-100 text-orange-800 px-2 py-1 rounded' : 'bg-gray-200 text-gray-800 px-2 py-1 rounded'}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about security, hacking, or system analysis..."
          disabled={loading}
        />
        <button
          className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
