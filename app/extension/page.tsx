'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { LogOut, Palette } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const themes = [
  { id: 'midnight', label: 'Midnight', bg: 'from-slate-900 via-slate-950 to-black', card: 'bg-slate-900/70', accent: 'text-blue-300', primary: '#3b82f6' },
  { id: 'ocean', label: 'Ocean', bg: 'from-cyan-900 via-blue-900 to-slate-950', card: 'bg-cyan-900/60', accent: 'text-cyan-200', primary: '#0ea5e9' },
  { id: 'sunset', label: 'Sunset', bg: 'from-amber-900 via-orange-900 to-red-950', card: 'bg-amber-900/40', accent: 'text-amber-200', primary: '#f97316' },
  { id: 'forest', label: 'Forest', bg: 'from-green-900 via-emerald-950 to-black', card: 'bg-green-900/50', accent: 'text-green-200', primary: '#10b981' },
  { id: 'aurora', label: 'Aurora', bg: 'from-purple-900 via-pink-900 to-slate-950', card: 'bg-purple-900/50', accent: 'text-purple-200', primary: '#a855f7' },
  { id: 'cyberpunk', label: 'Cyberpunk', bg: 'from-slate-950 via-purple-950 to-black', card: 'bg-slate-900/80', accent: 'text-pink-300', primary: '#ec4899' },
];

function QRCodeTool({ theme }: any) {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [addIcon, setAddIcon] = useState(true);
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!text.trim()) return;
    setLoading(true);
    
    try {
      const encoded = encodeURIComponent(text);
      const baseQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
      
      if (addIcon) {
        // Create canvas to overlay G icon on QR code
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;

        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          // Draw QR code
          ctx!.drawImage(qrImg, 0, 0, 300, 300);

          // Draw G icon from SVG file
          const iconImg = new Image();
          iconImg.crossOrigin = 'anonymous';
          
          iconImg.onload = () => {
            // Use icon size 50x50 to preserve QR code scanability
            const iconSize = 50;
            const x = (300 - iconSize) / 2;
            const y = (300 - iconSize) / 2;
            
            // Draw white background
            ctx!.fillStyle = 'white';
            ctx!.fillRect(x - 3, y - 3, iconSize + 6, iconSize + 6);
            
            // Draw icon
            ctx!.drawImage(iconImg, x, y, iconSize, iconSize);
            
            const finalQrUrl = canvas.toDataURL('image/png');
            setQrUrl(finalQrUrl);
            setLoading(false);
          };
          
          iconImg.onerror = () => {
            // Fallback to text if SVG fails to load
            ctx!.fillStyle = 'white';
            ctx!.fillRect(125, 125, 50, 50);
            ctx!.fillStyle = '#3b82f6';
            ctx!.font = 'bold 40px Arial';
            ctx!.textAlign = 'center';
            ctx!.textBaseline = 'middle';
            ctx!.fillText('G', 150, 150);
            
            const finalQrUrl = canvas.toDataURL('image/png');
            setQrUrl(finalQrUrl);
            setLoading(false);
          };
          
          iconImg.src = '/G-icon.svg';
        };
        qrImg.onerror = () => {
          setQrUrl(baseQrUrl);
          setLoading(false);
        };
        qrImg.src = baseQrUrl;
      } else {
        setQrUrl(baseQrUrl);
        setLoading(false);
      }
    } catch (err) {
      setQrUrl('');
      setLoading(false);
    }
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">QR Code Generator</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text or URL"
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
        onKeyPress={(e) => e.key === 'Enter' && generateQR()}
      />
      <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          checked={addIcon}
          onChange={(e) => setAddIcon(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm">Add G Icon to QR Code</span>
      </label>
      <button onClick={generateQR} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded py-2">{loading ? 'Generating...' : 'Generate QR Code'}</button>
      {qrUrl && (
        <div className="text-center space-y-2">
          <img src={qrUrl} alt="QR Code" className="mx-auto border border-slate-700 rounded" />
          <a href={qrUrl} download="qrcode.png" className="inline-block bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm">Download</a>
        </div>
      )}
    </div>
  );
}

function MarkdownTool({ theme }: any) {
  const [markdown, setMarkdown] = useState('# Hello\n\nThis is **bold** text.');
  const [html, setHtml] = useState('');

  const convert = () => {
    let result = markdown
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
    setHtml(result);
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Markdown → HTML</h3>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Enter markdown"
        className="w-full h-32 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
      />
      <button onClick={convert} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">Convert</button>
      {html && (
        <div className={`${theme.card} border border-slate-700 rounded p-3`}>
          <div dangerouslySetInnerHTML={{ __html: html }} className="text-slate-200" />
        </div>
      )}
    </div>
  );
}

function URLEncoderTool({ theme }: any) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput('Invalid URL');
    }
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">URL Encoder/Decoder</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter URL or text"
        className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
      />
      <div className="flex gap-2">
        <button onClick={encode} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-2">Encode</button>
        <button onClick={decode} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded py-2">Decode</button>
      </div>
      {output && (
        <div className={`${theme.card} border border-slate-700 rounded p-3`}>
          <p className="text-slate-300 break-all font-mono text-sm">{output}</p>
          <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-blue-400 text-sm hover:text-blue-300">Copy</button>
        </div>
      )}
    </div>
  );
}

function DiceRollerTool({ theme }: any) {
  const [rolls, setRolls] = useState<number[]>([]);
  const [diceType, setDiceType] = useState('d6');

  const roll = () => {
    const num = parseInt(diceType.substring(1));
    setRolls([...rolls, Math.floor(Math.random() * num) + 1]);
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Dice Roller</h3>
      <select value={diceType} onChange={(e) => setDiceType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white">
        <option>d4</option>
        <option>d6</option>
        <option>d8</option>
        <option>d10</option>
        <option>d12</option>
        <option>d20</option>
        <option>d100</option>
      </select>
      <button onClick={roll} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">Roll</button>
      {rolls.length > 0 && (
        <div className={`${theme.card} border border-slate-700 rounded p-3 space-y-2`}>
          <p className="text-sm text-slate-400">Last roll: <span className="text-2xl font-bold text-white">{rolls[rolls.length - 1]}</span></p>
          <p className="text-sm text-slate-400">Total rolls: {rolls.length} | Sum: {rolls.reduce((a, b) => a + b, 0)}</p>
          <button onClick={() => setRolls([])} className="text-sm text-slate-400 hover:text-white">Clear</button>
        </div>
      )}
    </div>
  );
}

function ColorPaletteTool({ theme }: any) {
  const [colors, setColors] = useState(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']);

  const generate = () => {
    const newColors = Array.from({ length: 5 }, () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
    setColors(newColors);
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Color Palette Generator</h3>
      <button onClick={generate} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">Generate Palette</button>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, i) => (
          <div key={i} className="space-y-1">
            <div className="h-16 rounded border border-slate-700" style={{ backgroundColor: color }} />
            <p className="text-xs text-slate-400 text-center font-mono">{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PasswordGeneratorTool({ theme }: any) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useSymbols, setUseSymbols] = useState(true);

  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const pool = useSymbols ? chars + symbols : chars;
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setPassword(pwd);
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Password Generator</h3>
      <div>
        <label className="text-sm text-slate-300">Length: {length}</label>
        <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full mt-1" />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
        <span className="text-sm text-slate-300">Include symbols</span>
      </label>
      <button onClick={generate} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">Generate</button>
      {password && (
        <div className="bg-slate-950/70 border border-slate-700 rounded p-3 space-y-2">
          <p className="text-sm text-slate-200 font-mono break-all">{password}</p>
          <button onClick={() => navigator.clipboard.writeText(password)} className="text-blue-400 text-sm hover:text-blue-300">Copy</button>
        </div>
      )}
    </div>
  );
}

function UUIDGeneratorTool({ theme }: any) {
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUUID = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setUuids([uuid, ...uuids]);
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">UUID Generator</h3>
      <button onClick={generateUUID} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">Generate UUID</button>
      {uuids.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {uuids.map((uuid, i) => (
            <div key={i} className="bg-slate-950/70 border border-slate-700 rounded p-2 flex justify-between items-center">
              <p className="text-xs text-slate-200 font-mono">{uuid}</p>
              <button onClick={() => navigator.clipboard.writeText(uuid)} className="text-blue-400 text-xs hover:text-blue-300">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TextStatisticsTool({ theme }: any) {
  const [text, setText] = useState('');

  const stats = {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.trim() ? text.split('\n').length : 0,
    paragraphs: text.trim() ? text.split(/\n\n+/).length : 0,
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Text Statistics</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text here..." className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-950/70 rounded p-3"><p className="text-xs text-slate-400">Characters</p><p className="text-lg font-bold text-white">{stats.chars}</p></div>
        <div className="bg-slate-950/70 rounded p-3"><p className="text-xs text-slate-400">Words</p><p className="text-lg font-bold text-white">{stats.words}</p></div>
        <div className="bg-slate-950/70 rounded p-3"><p className="text-xs text-slate-400">Lines</p><p className="text-lg font-bold text-white">{stats.lines}</p></div>
        <div className="bg-slate-950/70 rounded p-3"><p className="text-xs text-slate-400">Paragraphs</p><p className="text-lg font-bold text-white">{stats.paragraphs}</p></div>
      </div>
    </div>
  );
}

function JSONFormatterTool({ theme }: any) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">JSON Formatter</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON..." className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono" />
      <div className="flex gap-2">
        <button onClick={format} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm">Format</button>
        <button onClick={minify} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded py-2 text-sm">Minify</button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {output && <textarea value={output} readOnly className="w-full h-20 bg-slate-950/70 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono" />}
    </div>
  );
}

function Base64Tool({ theme }: any) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      setOutput(btoa(input));
    } catch (e) {
      setOutput('Error encoding');
    }
  };

  const decode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput('Error decoding');
    }
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Base64 Encoder</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <div className="flex gap-2">
        <button onClick={encode} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm">Encode</button>
        <button onClick={decode} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded py-2 text-sm">Decode</button>
      </div>
      {output && <textarea value={output} readOnly className="w-full h-20 bg-slate-950/70 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono" />}
    </div>
  );
}

function HexConverterTool({ theme }: any) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const toHex = () => {
    const hex = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    setOutput(hex);
  };

  const fromHex = () => {
    try {
      const text = input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
      setOutput(text);
    } catch {
      setOutput('Invalid hex');
    }
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Hex Converter</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or hex..." className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <div className="flex gap-2">
        <button onClick={toHex} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm">To Hex</button>
        <button onClick={fromHex} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded py-2 text-sm">From Hex</button>
      </div>
      {output && <textarea value={output} readOnly className="w-full h-20 bg-slate-950/70 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono" />}
    </div>
  );
}

function CaseConverterTool({ theme }: any) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (type: string) => {
    let result = input;
    switch(type) {
      case 'upper': result = input.toUpperCase(); break;
      case 'lower': result = input.toLowerCase(); break;
      case 'title': result = input.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '); break;
      case 'sentence': result = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(); break;
      case 'toggle': result = input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
    }
    setOutput(result);
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Case Converter</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => convert('upper')} className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-xs">UPPERCASE</button>
        <button onClick={() => convert('lower')} className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-xs">lowercase</button>
        <button onClick={() => convert('title')} className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-xs">Title Case</button>
        <button onClick={() => convert('sentence')} className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-xs">Sentence case</button>
      </div>
      {output && <textarea value={output} readOnly className="w-full h-20 bg-slate-950/70 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono" />}
    </div>
  );
}

function URLShortenerTool({ theme }: any) {
  const [longUrl, setLongUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const baseUrl = 'https://extensions.thegdevelopers.online/shorturl';

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const shortenUrlLocally = (code: string) => {
    try {
      const urls = JSON.parse(localStorage.getItem('gdevelopers_short_urls') || '[]');
      const newUrl = {
        shortCode: code,
        longUrl: longUrl,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      urls.push(newUrl);
      localStorage.setItem('gdevelopers_short_urls', JSON.stringify(urls));
      return true;
    } catch (err) {
      console.error('Error saving locally:', err);
      return false;
    }
  };

  const shorten = async () => {
    if (!longUrl.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const code = generateShortCode();
      let saved = false;

      // Try to save to Supabase first
      try {
        const { error: supabaseError } = await supabase
          .from('short_urls')
          .insert([{
            long_url: longUrl,
            short_code: code,
            clicks: 0
          }])
          .select();

        if (!supabaseError) {
          saved = true;
        }
      } catch (err) {
        console.warn('Supabase save failed, using localStorage fallback');
      }

      // Fallback to localStorage if Supabase fails
      if (!saved) {
        saved = shortenUrlLocally(code);
      }

      if (saved) {
        setShortCode(code);
        setShortUrl(`${baseUrl}/${code}`);
        setLongUrl('');
      } else {
        setError('Failed to shorten URL');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">URL Shortener</h3>
      <textarea value={longUrl} onChange={(e) => setLongUrl(e.target.value)} placeholder="Paste long URL..." className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <button onClick={shorten} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded py-2">{loading ? 'Creating...' : 'Generate Short Code'}</button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {shortCode && (
        <div className="bg-slate-950/70 border border-slate-700 rounded p-3 space-y-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">Short Code:</p>
            <p className="font-mono font-bold text-blue-400">{shortCode}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Short URL:</p>
            <p className="font-mono text-sm text-green-400 break-all">{shortUrl}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(shortCode)} className="flex-1 text-blue-400 text-sm hover:text-blue-300 bg-slate-800/50 rounded px-2 py-1">Copy Code</button>
            <button onClick={() => navigator.clipboard.writeText(shortUrl)} className="flex-1 text-green-400 text-sm hover:text-green-300 bg-slate-800/50 rounded px-2 py-1">Copy URL</button>
          </div>
        </div>
      )}
    </div>
  );
}

function RegexTesterTool({ theme }: any) {
  const [pattern, setPattern] = useState('');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    try {
      const regex = new RegExp(pattern, 'g');
      const found = text.match(regex) || [];
      setMatches(found);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Regex Tester</h3>
      <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to test..." className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <button onClick={test} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">Test Pattern</button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {matches.length > 0 && (
        <div className="bg-slate-950/70 border border-slate-700 rounded p-3">
          <p className="text-sm text-slate-300 mb-2">Matches: {matches.length}</p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {matches.map((m, i) => <p key={i} className="text-xs text-blue-400 font-mono">{m}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

function PomodoroTimerTool({ theme }: any) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsRunning(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Pomodoro Timer</h3>
      <div className="text-center">
        <div className="text-5xl font-bold text-blue-400 font-mono">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setIsRunning(!isRunning)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-2">{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={() => { setMinutes(25); setSeconds(0); setIsRunning(false); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded py-2">Reset</button>
      </div>
    </div>
  );
}

function CountdownTimerTool({ theme }: any) {
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Time\'s up!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Countdown Timer</h3>
      <input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      {timeLeft && <div className="text-center text-2xl font-bold text-blue-400">{timeLeft}</div>}
    </div>
  );
}

function LoremIpsumTool({ theme }: any) {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState('');

  const generate = () => {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    setText(Array(paragraphs).fill(lorem).join('\n\n'));
  };

  useEffect(() => {
    generate();
  }, [paragraphs]);

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">Lorem Ipsum Generator</h3>
      <div>
        <label className="text-sm text-slate-300">Paragraphs: {paragraphs}</label>
        <input type="range" min="1" max="10" value={paragraphs} onChange={(e) => setParagraphs(parseInt(e.target.value))} className="w-full mt-1" />
      </div>
      <textarea value={text} readOnly className="w-full h-24 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
      <button onClick={() => navigator.clipboard.writeText(text)} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm">Copy Text</button>
    </div>
  );
}

function VideoToolSuite({ theme }: any) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('analyze');

  const analyzeVideo = async () => {
    if (!url.trim()) {
      setError('Please enter a video URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      // Extract platform from URL
      let platform = 'Unknown';
      let videoId = '';
      let thumbnail = '';
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        platform = 'YouTube';
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        videoId = match ? match[1] : 'N/A';
        if (videoId !== 'N/A') {
          thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      } else if (url.includes('tiktok.com')) {
        platform = 'TikTok';
        const match = url.match(/\/video\/(\d+)/);
        videoId = match ? match[1] : 'N/A';
      } else if (url.includes('instagram.com')) {
        platform = 'Instagram';
        const match = url.match(/\/p\/([^/?]+)/);
        videoId = match ? match[1] : 'N/A';
      } else if (url.includes('vimeo.com')) {
        platform = 'Vimeo';
        const match = url.match(/vimeo\.com\/(\d+)/);
        videoId = match ? match[1] : 'N/A';
      } else if (url.includes('dailymotion.com')) {
        platform = 'Dailymotion';
        const match = url.match(/\/video\/([^_]+)/);
        videoId = match ? match[1] : 'N/A';
      } else if (url.includes('twitch.tv')) {
        platform = 'Twitch';
        videoId = 'Stream/VOD';
      }

      let metadata: any = {
        platform,
        videoId,
        url,
        urlLength: url.length,
        isValid: url.startsWith('http'),
        timestamp: new Date().toLocaleString(),
        thumbnail: thumbnail || null,
      };

      // Try to fetch metadata using YouTube oEmbed (most reliable)
      if (platform === 'YouTube' && videoId !== 'N/A') {
        try {
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
          const response = await fetch(oembedUrl);
          
          if (response.ok) {
            const oembedData = await response.json();
            metadata = {
              ...metadata,
              title: oembedData.title,
              author: oembedData.author_name,
              thumbnail: oembedData.thumbnail_url,
              width: oembedData.width,
              height: oembedData.height,
              thumbnailWidth: oembedData.thumbnail_width,
              thumbnailHeight: oembedData.thumbnail_height,
            };
          }
        } catch (oembedErr) {
          // Fallback to default YouTube thumbnail if oEmbed fails
          console.log('oEmbed fetch failed, using default thumbnail');
        }
      }

      setVideoInfo(metadata);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadThumbnail = () => {
    if (!videoInfo?.thumbnail) return;
    const link = document.createElement('a');
    link.href = videoInfo.thumbnail;
    link.download = `thumbnail-${videoInfo.videoId}.jpg`;
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4`}>
      <h3 className="text-xl font-bold">🎬 Video Toolkit Suite</h3>
      <p className="text-xs text-slate-400">Analyze, download & extract video metadata from any platform</p>
      
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste video URL (YouTube, TikTok, Instagram, Vimeo, etc.)"
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm"
        onKeyPress={(e) => e.key === 'Enter' && analyzeVideo()}
      />

      <div className="flex gap-2">
        <button
          onClick={analyzeVideo}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded py-2 font-semibold text-sm"
        >
          {loading ? 'Analyzing...' : 'Analyze Video'}
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'analyze' ? 'download' : 'analyze')}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded py-2 font-semibold text-sm"
        >
          {activeTab === 'analyze' ? 'Download Guide' : 'Analysis'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {videoInfo && (
        <div className="bg-slate-950/70 border border-slate-700 rounded p-4 space-y-3">
          {/* Video Preview */}
          <div className="flex gap-3">
            {videoInfo.thumbnail && (
              <div className="relative">
                <img src={videoInfo.thumbnail} alt="thumbnail" className="w-24 h-24 rounded object-cover" />
                <button
                  onClick={downloadThumbnail}
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                  title="Download thumbnail"
                >
                  ⬇️
                </button>
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{videoInfo.title}</p>
              <p className="text-xs text-slate-400">By: {videoInfo.author}</p>
              <p className="text-xs text-slate-500 mt-2">Platform: {videoInfo.platform}</p>
            </div>
          </div>

          {activeTab === 'analyze' ? (
            <>
              {/* Analysis Tab */}
              <div className="border-t border-slate-700 pt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Video ID</p>
                    <p className="text-white font-mono break-all">{videoInfo.videoId}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">URL Length</p>
                    <p className="text-white">{videoInfo.urlLength} chars</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Valid URL</p>
                    <p className="text-white">{videoInfo.isValid ? '✅ Yes' : '❌ No'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Resolution</p>
                    <p className="text-white">{videoInfo.width}x{videoInfo.height}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded p-2">
                  <p className="text-xs text-slate-400 mb-1">Raw URL:</p>
                  <p className="text-xs text-slate-300 break-all font-mono">{videoInfo.url}</p>
                  <button
                    onClick={() => copyToClipboard(videoInfo.url)}
                    className="mt-2 text-blue-400 text-xs hover:text-blue-300"
                  >
                    Copy URL
                  </button>
                </div>

                <p className="text-slate-500 text-xs">Analyzed: {videoInfo.timestamp}</p>
              </div>
            </>
          ) : (
            <>
              {/* Download Tab */}
              <div className="border-t border-slate-700 pt-3 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-300">📥 Download Options:</p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-slate-200 font-semibold">🎥 Full Video (MP4)</p>
                      <p className="text-slate-400">Best quality video + audio</p>
                      <div className="flex gap-2 mt-1">
                        <a href="https://savefrom.net" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">SaveFrom.net</a>
                        <span className="text-slate-500">•</span>
                        <a href="https://keepvid.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">KeepVid</a>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-slate-200 font-semibold">🎵 Audio Only (MP3)</p>
                      <p className="text-slate-400">Extract audio from video</p>
                      <div className="flex gap-2 mt-1">
                        <a href="https://mp3fy.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">MP3fy</a>
                        <span className="text-slate-500">•</span>
                        <a href="https://keepvid.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">KeepVid</a>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-slate-200 font-semibold">🖼️ Thumbnail (JPG)</p>
                      <p className="text-slate-400">High-quality thumbnail image</p>
                      <button onClick={downloadThumbnail} className="text-blue-400 hover:text-blue-300">Download Now →</button>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-slate-200 font-semibold">💻 Desktop Tool (yt-dlp)</p>
                      <p className="text-slate-400">Most reliable & feature-rich</p>
                      <a href="https://github.com/yt-dlp/yt-dlp" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Install yt-dlp →</a>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-700 rounded p-2">
                  <p className="text-xs text-blue-300">💡 Tip: yt-dlp is most reliable. For web tools, try SaveFrom.net or ClipConverter if one is blocked</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!videoInfo && !error && (
        <div className="bg-slate-950/70 border border-slate-700 rounded p-4 text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">ℹ️ Features:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>📊 Analyze video metadata (title, author, ID, platform)</li>
            <li>🖼️ Download thumbnail images</li>
            <li>📥 Get download links for video & audio</li>
            <li>🔍 Extract video ID and platform info</li>
            <li>✅ Validate video URLs</li>
            <li>📋 Copy URLs and metadata</li>
          </ul>
          <p className="text-slate-500 mt-2">Supports: YouTube, TikTok, Instagram, Vimeo, Dailymotion, Twitch</p>
        </div>
      )}
    </div>
  );
}


export default function ExtensionOnlinePage() {
  const [themeId, setThemeId] = useState('midnight');
  const [user, setUser] = useState<any>(null);
  const theme = useMemo(() => themes.find((t) => t.id === themeId) || themes[0], [themeId]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-slate-100`}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md shadow-lg" style={{ backgroundColor: '#0f172acc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="The GDevelopers Advanced Suite" className="h-8 sm:h-10" />
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/tools" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Tools
            </Link>
            <Link href="/extension" className="text-sm font-medium text-white transition">
              Online Extension
            </Link>
            <Link href="/docs" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Docs
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition">
              About
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            {/* Advanced Theme Selector in Navbar */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition border border-slate-700">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Theme</span>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="text-xs font-semibold text-white mb-2">Select Theme</div>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                        themeId === t.id 
                          ? 'border-white/40 bg-white/15 text-white shadow-lg' 
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                      style={themeId === t.id ? { boxShadow: `0 0 12px ${t.primary}40` } : {}}
                    >
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.primary }}></div>
                        <span className="hidden sm:inline">{t.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            )}
            <Link href="/" className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12 pt-24 pb-20">
        {/* Header Section */}
        <section className={`${theme.card} border border-white/10 rounded-xl p-8 bg-gradient-to-r from-slate-900/50 to-slate-800/50`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Online Extension Tools</h1>
              <p className="text-slate-300">Fully functional tools running directly in your browser. No redirects, no delays.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/tools/converters" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition">🔄 Converters</Link>
              <a href="https://mail1s.net/dashboard" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition">📧 Mail1s</a>
            </div>
          </div>
        </section>

        {/* Working Tools Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-white">Available Tools (19 Working)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QRCodeTool theme={theme} />
            <URLShortenerTool theme={theme} />
            <PasswordGeneratorTool theme={theme} />
            <UUIDGeneratorTool theme={theme} />
            <ColorPaletteTool theme={theme} />
            <MarkdownTool theme={theme} />
            <URLEncoderTool theme={theme} />
            <DiceRollerTool theme={theme} />
            <TextStatisticsTool theme={theme} />
            <JSONFormatterTool theme={theme} />
            <Base64Tool theme={theme} />
            <HexConverterTool theme={theme} />
            <CaseConverterTool theme={theme} />
            <RegexTesterTool theme={theme} />
            <PomodoroTimerTool theme={theme} />
            <CountdownTimerTool theme={theme} />
            <LoremIpsumTool theme={theme} />
            <VideoToolSuite theme={theme} />
            <div className={`${theme.card} border border-white/10 rounded-lg p-6 space-y-4 flex flex-col justify-center items-center text-center`}>
              <div className="text-5xl">🚀</div>
              <h3 className="text-xl font-bold">More Coming Soon</h3>
              <p className="text-slate-400 text-sm">36 more tools in development. Stay tuned!</p>
            </div>
          </div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo.svg" alt="The GDevelopers" className="h-48 w-48 mb-4" />
              <p className="text-slate-400 text-sm">Building powerful tools for developers and creators.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/tools" className="hover:text-white transition">Tools</Link></li>
                <li><Link href="/extension" className="hover:text-white transition">Online Extension</Link></li>
                <li><Link href="/tools/converters" className="hover:text-white transition">Converters</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://thegdevelopers.info" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Website</a></li>
                <li><a href="mailto:info@thegdevelopers.info" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a></li>
                <li><a href="https://mail1s.net/dashboard" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Mail1s</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-xs">© 2025 The GDevelopers. All rights reserved.</p>
            <p className="text-slate-400 text-xs mt-4 md:mt-0">Made with ❤️ for developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
