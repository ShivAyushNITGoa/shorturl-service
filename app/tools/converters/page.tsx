'use client';

import { useRef, useState } from 'react';

type Pixel = { r: number; g: number; b: number; a?: number };

// Utility functions for handling large files
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function compressImage(canvas: HTMLCanvasElement, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, 'image/webp', quality);
  });
}

async function processLargeImage(file: File, maxWidth: number = 2048, maxHeight: number = 2048): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Scale down if too large
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.85));
        } else {
          reject(new Error('Canvas context failed'));
        }
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

async function chunkedFileRead(file: File, chunkSize: number = 1024 * 1024): Promise<string> {
  const chunks: string[] = [];
  let offset = 0;
  
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const text = await chunk.text();
    chunks.push(text);
    offset += chunkSize;
  }
  
  return chunks.join('');
}

function rleCompress(pixels: Pixel[]) {
  const compressed: { color: Pixel; count: number }[] = [];
  if (pixels.length === 0) return compressed;
  let current = pixels[0];
  let count = 1;
  for (let i = 1; i < pixels.length; i++) {
    const p = pixels[i];
    if (p.r === current.r && p.g === current.g && p.b === current.b && p.a === current.a && count < 255) {
      count++;
    } else {
      compressed.push({ color: current, count });
      current = p;
      count = 1;
    }
  }
  compressed.push({ color: current, count });
  return compressed;
}

function rleDecompress(data: any[]) {
  const pixels: Pixel[] = [];
  for (const item of data) {
    const color = item.color || item;
    const count = item.count || 1;
    for (let i = 0; i < count; i++) pixels.push(color);
  }
  return pixels;
}

function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(btoa(input));
  const decode = () => {
    try {
      setOutput(atob(input));
    } catch {
      setOutput('Invalid Base64');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">Base64 Encoder/Decoder</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text or Base64"
        className="w-full h-24 bg-slate-950/70 border border-slate-800 rounded-md p-3 text-sm text-slate-200 font-mono"
      />
      <div className="flex gap-2">
        <button onClick={encode} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold">Encode</button>
        <button onClick={decode} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 font-semibold">Decode</button>
      </div>
      {output && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-md p-3">
          <p className="text-xs text-slate-400 mb-2">Output:</p>
          <p className="text-slate-200 break-all font-mono text-sm">{output}</p>
          <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-blue-400 text-sm hover:text-blue-300">Copy</button>
        </div>
      )}
    </div>
  );
}

function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">JSON Formatter</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON here"
        className="w-full h-24 bg-slate-950/70 border border-slate-800 rounded-md p-3 text-sm text-slate-200 font-mono"
      />
      <div className="flex gap-2">
        <button onClick={format} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold">Format</button>
        <button onClick={minify} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 font-semibold">Minify</button>
      </div>
      {output && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-md p-3">
          <pre className="text-xs text-slate-200 overflow-auto max-h-48 font-mono">{output}</pre>
          <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-blue-400 text-sm hover:text-blue-300">Copy</button>
        </div>
      )}
    </div>
  );
}

function HexConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const toHex = () => {
    const hex = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    setOutput(hex);
  };

  const fromHex = () => {
    try {
      const text = input.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
      setOutput(text);
    } catch {
      setOutput('Invalid Hex');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">Hex Converter</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text or hex"
        className="w-full h-24 bg-slate-950/70 border border-slate-800 rounded-md p-3 text-sm text-slate-200 font-mono"
      />
      <div className="flex gap-2">
        <button onClick={toHex} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold">To Hex</button>
        <button onClick={fromHex} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 font-semibold">From Hex</button>
      </div>
      {output && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-md p-3">
          <p className="text-xs text-slate-400 mb-2">Output:</p>
          <p className="text-slate-200 break-all font-mono text-sm">{output}</p>
          <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-blue-400 text-sm hover:text-blue-300">Copy</button>
        </div>
      )}
    </div>
  );
}

function CSVtoJSON() {
  const [csv, setCSV] = useState('name,age,city\nJohn,30,NYC\nJane,25,LA');
  const [json, setJSON] = useState('');

  const convert = () => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      return obj;
    });
    setJSON(JSON.stringify(data, null, 2));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">CSV → JSON</h2>
      <textarea
        value={csv}
        onChange={(e) => setCSV(e.target.value)}
        placeholder="Paste CSV here"
        className="w-full h-24 bg-slate-950/70 border border-slate-800 rounded-md p-3 text-sm text-slate-200 font-mono"
      />
      <button onClick={convert} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold">Convert</button>
      {json && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-md p-3">
          <pre className="text-xs text-slate-200 overflow-auto max-h-48 font-mono">{json}</pre>
          <button onClick={() => navigator.clipboard.writeText(json)} className="mt-2 text-blue-400 text-sm hover:text-blue-300">Copy</button>
        </div>
      )}
    </div>
  );
}

function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [format, setFormat] = useState('png');
  const [info, setInfo] = useState('');
  const [quality, setQuality] = useState(0.9);

  const imageFormats = ['png', 'jpeg', 'jpg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'svg'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      const img = new Image();
      img.onload = () => {
        setInfo(`${file.name} • ${img.width}x${img.height}px • ${(file.size / 1024).toFixed(2)} KB`);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const convertImage = async () => {
    if (!selectedFile || !preview) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        let mimeType = `image/${format}`;
        if (format === 'jpg') mimeType = 'image/jpeg';
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted.${format}`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, mimeType, quality);
      }
    };
    img.src = preview;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">Image Converter</h2>
      <label className="block">
        <span className="text-sm text-slate-300">Upload Image:</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="mt-1 w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />
      </label>
      {preview && (
        <div className="space-y-3">
          <img src={preview} alt="preview" className="max-h-32 rounded border border-slate-700" />
          <p className="text-xs text-slate-400">{info}</p>
          <div>
            <label className="text-sm text-slate-300">Output Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm mt-1"
            >
              {imageFormats.map(fmt => (
                <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
              ))}
            </select>
          </div>
          {(format === 'jpeg' || format === 'jpg' || format === 'webp') && (
            <div>
              <label className="text-sm text-slate-300">Quality: {Math.round(quality * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          )}
          <button onClick={convertImage} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold">Convert & Download</button>
        </div>
      )}
    </div>
  );
}

function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [format, setFormat] = useState('text');
  const [isBinary, setIsBinary] = useState(false);

  const outputFormats = ['text', 'json', 'csv', 'base64', 'xml', 'html', 'md', 'yaml'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFileInfo(`${file.name} • ${(file.size / 1024).toFixed(2)} KB • ${file.type || 'unknown'}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setFileContent(content);
        setIsBinary(false);
      } catch {
        setIsBinary(true);
        setFileContent('[Binary file - cannot display as text]');
      }
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsText(file);
  };

  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const downloadConverted = () => {
    if (!fileContent || isBinary) {
      alert('Cannot convert binary files');
      return;
    }

    let converted = fileContent;
    let mimeType = 'text/plain';
    let extension = 'txt';

    try {
      if (format === 'json') {
        try {
          const parsed = JSON.parse(fileContent);
          converted = JSON.stringify(parsed, null, 2);
        } catch {
          converted = `{\n  "content": ${JSON.stringify(fileContent)}\n}`;
        }
        mimeType = 'application/json';
        extension = 'json';
      } else if (format === 'csv') {
        mimeType = 'text/csv';
        extension = 'csv';
      } else if (format === 'base64') {
        converted = btoa(fileContent);
        mimeType = 'text/plain';
        extension = 'txt';
      } else if (format === 'xml') {
        const escaped = escapeXml(fileContent);
        converted = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <content>${escaped}</content>\n</root>`;
        mimeType = 'application/xml';
        extension = 'xml';
      } else if (format === 'html') {
        converted = `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"></head>\n<body>\n<pre>${fileContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>\n</body>\n</html>`;
        mimeType = 'text/html';
        extension = 'html';
      } else if (format === 'md') {
        mimeType = 'text/markdown';
        extension = 'md';
      } else if (format === 'yaml') {
        mimeType = 'text/yaml';
        extension = 'yaml';
      }

      const blob = new Blob([converted], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error converting file: ' + (error as any).message);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">File Converter</h2>
      <label className="block">
        <span className="text-sm text-slate-300">Upload File (Text-based):</span>
        <input
          type="file"
          onChange={handleFileSelect}
          className="mt-1 w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />
      </label>
      {fileContent && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">{fileInfo}</p>
          {isBinary && <p className="text-xs text-red-400">⚠️ Binary file detected - conversion may not work properly</p>}
          <div>
            <label className="text-sm text-slate-300">Output Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm mt-1"
            >
              {outputFormats.map(fmt => (
                <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <textarea
            value={fileContent}
            readOnly
            className="w-full h-24 bg-slate-950/70 border border-slate-800 rounded-md p-3 text-xs text-slate-200 font-mono overflow-auto"
          />
          <div className="flex gap-2">
            <button
              onClick={downloadConverted}
              disabled={isBinary}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-md py-2 font-semibold"
            >
              Convert & Download
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(fileContent)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md py-2 font-semibold"
            >
              Copy Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LargeFileHandler() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');
  const [fileStats, setFileStats] = useState('');
  const [compressionLevel, setCompressionLevel] = useState(0.8);

  const handleLargeFile = async (selectedFile: File) => {
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setFileStats(`${selectedFile.name} • ${formatFileSize(selectedFile.size)}`);
    setProcessing(false);
    setProgress(0);
  };

  const processLargeFile = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);

    try {
      if (file.type.startsWith('image/')) {
        // Process large image
        const processedDataUrl = await processLargeImage(file, 2048, 2048);
        const img = new Image();
        img.onload = () => {
          setResult(`Processed: ${img.width}x${img.height}px\nCompressed with WebP quality: ${(compressionLevel * 100).toFixed(0)}%`);
          setProgress(100);
          
          // Create download link
          const link = document.createElement('a');
          link.href = processedDataUrl;
          link.download = `compressed-${file.name}`;
          link.click();
        };
        img.src = processedDataUrl;
      } else {
        // Process large text file in chunks
        const content = await chunkedFileRead(file, 1024 * 1024);
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).length;
        
        setResult(`File processed:\n• Lines: ${lines}\n• Words: ${words}\n• Size: ${formatFileSize(file.size)}`);
        setProgress(100);
      }
    } catch (error) {
      setResult(`Error: ${(error as any).message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">🚀 Large File Handler</h2>
      <p className="text-xs text-slate-400">Handle huge files and images with chunked processing and compression</p>
      
      <label className="block">
        <span className="text-sm text-slate-300">Select Large File (Image or Text):</span>
        <input
          type="file"
          onChange={(e) => e.target.files?.[0] && handleLargeFile(e.target.files[0])}
          className="mt-1 w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          title="Select a large file to process"
        />
      </label>

      {file && (
        <div className="space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-md p-3">
            <p className="text-xs text-slate-400">{fileStats}</p>
          </div>

          {file.type.startsWith('image/') && (
            <div>
              <label className="text-sm text-slate-300">Compression Quality:</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(parseFloat(e.target.value))}
                className="w-full mt-1"
                title="Adjust compression quality"
              />
              <p className="text-xs text-slate-400 mt-1">{(compressionLevel * 100).toFixed(0)}% quality</p>
            </div>
          )}

          <button
            onClick={processLargeFile}
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md py-2 font-semibold"
          >
            {processing ? `Processing... ${progress}%` : 'Process & Download'}
          </button>

          {progress > 0 && (
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {result && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-md p-3">
              <p className="text-xs text-slate-200 whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ImageOptimizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [formats, setFormats] = useState({ webp: true, avif: true, jpeg: true });
  const [quality, setQuality] = useState(0.85);
  const [results, setResults] = useState<{ format: string; size: string }[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleImageSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const optimizeImage = async () => {
    if (!file || !preview) return;
    setProcessing(true);
    setResults([]);

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const newResults: { format: string; size: string }[] = [];

          if (formats.webp) {
            canvas.toBlob((blob) => {
              if (blob) {
                newResults.push({ format: 'WebP', size: formatFileSize(blob.size) });
                if (newResults.length === Object.values(formats).filter(Boolean).length) {
                  setResults(newResults);
                  setProcessing(false);
                }
              }
            }, 'image/webp', quality);
          }

          if (formats.jpeg) {
            canvas.toBlob((blob) => {
              if (blob) {
                newResults.push({ format: 'JPEG', size: formatFileSize(blob.size) });
                if (newResults.length === Object.values(formats).filter(Boolean).length) {
                  setResults(newResults);
                  setProcessing(false);
                }
              }
            }, 'image/jpeg', quality);
          }

          if (formats.avif) {
            canvas.toBlob((blob) => {
              if (blob) {
                newResults.push({ format: 'AVIF', size: formatFileSize(blob.size) });
                if (newResults.length === Object.values(formats).filter(Boolean).length) {
                  setResults(newResults);
                  setProcessing(false);
                }
              }
            }, 'image/avif', quality);
          }
        }
      };
      img.src = preview;
    } catch (error) {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">🖼️ Image Optimizer</h2>
      <p className="text-xs text-slate-400">Compare image formats and optimize for web</p>

      <label className="block">
        <span className="text-sm text-slate-300">Select Image:</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
          className="mt-1 w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          title="Select an image to optimize"
        />
      </label>

      {preview && (
        <div className="flex justify-center">
          <img src={preview} alt="preview" className="max-h-32 rounded-md border border-slate-800" />
        </div>
      )}

      {file && (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-300">Quality: {(quality * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full mt-1"
              title="Adjust quality"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formats.webp} onChange={(e) => setFormats({...formats, webp: e.target.checked})} />
              WebP
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formats.jpeg} onChange={(e) => setFormats({...formats, jpeg: e.target.checked})} />
              JPEG
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formats.avif} onChange={(e) => setFormats({...formats, avif: e.target.checked})} />
              AVIF
            </label>
          </div>

          <button
            onClick={optimizeImage}
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md py-2 font-semibold"
          >
            {processing ? 'Optimizing...' : 'Compare Formats'}
          </button>

          {results.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-md p-3 space-y-2">
              <p className="text-xs text-slate-400">Original: {formatFileSize(file.size)}</p>
              {results.map((r) => (
                <p key={r.format} className="text-xs text-slate-300">{r.format}: {r.size}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ConvertersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">Data Converters</h1>
          <p className="text-slate-400">
            Convert between different data formats: Image↔JSON, Base64, JSON, Hex, CSV, and more. Handle huge files with advanced compression.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LargeFileHandler />
          <ImageOptimizer />
          <ImageToJson />
          <JsonToImage />
          <ImageConverter />
          <FileConverter />
          <Base64Converter />
          <JSONFormatter />
          <HexConverter />
          <CSVtoJSON />
        </div>
      </div>
    </div>
  );
}

function ImageToJson() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInfo, setFileInfo] = useState('');
  const [includeBase64, setIncludeBase64] = useState(true);
  const [includePixels, setIncludePixels] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [compressPixels, setCompressPixels] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');
  const [imgPreview, setImgPreview] = useState('');

  const handleFile = async (file: File) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setImgPreview(dataUrl);
    const img = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, img.width, img.height);
    const pixels: Pixel[] = [];
    for (let i = 0; i < data.length; i += 4) {
      pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
    }

    const json: any = {};
    if (includeMetadata) {
      json.metadata = {
        filename: file.name,
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        timestamp: new Date().toISOString(),
      };
    }
    if (includeBase64) {
      json.base64 = dataUrl.split(',')[1];
    }
    if (includePixels) {
      if (compressPixels) {
        json.pixels = { compressed: true, data: rleCompress(pixels), width: img.width, height: img.height };
      } else {
        json.pixels = { compressed: false, data: pixels, width: img.width, height: img.height };
      }
    }

    const jsonString = JSON.stringify(json, null, 2);
    setJsonOutput(jsonString);
    setFileInfo(`${file.name} • ${img.width}x${img.height}px • ${(file.size / 1024).toFixed(2)} KB`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">Image → JSON</h2>
      <div className="space-y-3">
        <label className="block text-sm text-slate-300">
          Upload image file:
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="mt-1 w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            title="Upload image file"
          />
        </label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={includeBase64} onChange={(e) => setIncludeBase64(e.target.checked)} />
            Include base64
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={includePixels} onChange={(e) => setIncludePixels(e.target.checked)} />
            Include pixels
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={includeMetadata} onChange={(e) => setIncludeMetadata(e.target.checked)} />
            Include metadata
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={compressPixels} onChange={(e) => setCompressPixels(e.target.checked)} />
            Compress pixels (RLE)
          </label>
        </div>
      </div>

      {fileInfo && (
        <div className="text-xs text-slate-400 border border-slate-800 rounded-md p-2 bg-slate-950/60">{fileInfo}</div>
      )}

      {imgPreview && (
        <div className="flex justify-center">
          <img src={imgPreview} alt="preview" className="max-h-40 rounded-md border border-slate-800" />
        </div>
      )}

      {jsonOutput && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              onClick={() => navigator.clipboard.writeText(jsonOutput)}
            >
              Copy JSON
            </button>
            <button
              className="px-3 py-2 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-600"
              onClick={() => downloadText(jsonOutput, 'image.json')}
            >
              Download JSON
            </button>
          </div>
          <pre className="text-xs bg-slate-950/70 border border-slate-800 rounded-md p-3 max-h-80 overflow-auto">
            {jsonOutput}
          </pre>
        </div>
      )}
    </div>
  );
}

function JsonToImage() {
  const [jsonInput, setJsonInput] = useState('');
  const [widthInput, setWidthInput] = useState<number | ''>('');
  const [heightInput, setHeightInput] = useState<number | ''>('');
  const [info, setInfo] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [sourceType, setSourceType] = useState('');

  const handleJsonFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result ? String(reader.result) : '';
      setJsonInput(text);
    };
    reader.readAsText(file);
  };

  const handleConvert = async () => {
    if (!jsonInput.trim()) {
      alert('Provide JSON first (paste or upload).');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const { pixels, width, height, sourceType } = await resolvePixels(parsed, Number(widthInput) || 0, Number(heightInput) || 0);
      setSourceType(sourceType);
      let w = width;
      let h = height;
      if (!w || !h) {
        const total = pixels.length;
        w = Math.ceil(Math.sqrt(total));
        h = Math.ceil(total / w);
      }
      const expected = w * h;
      let norm = pixels.slice(0, expected);
      if (norm.length < expected) {
        const missing = expected - norm.length;
        for (let i = 0; i < missing; i++) norm.push({ r: 255, g: 255, b: 255, a: 255 });
      }
      const clamped = new Uint8ClampedArray(expected * 4);
      for (let i = 0; i < expected; i++) {
        const p = norm[i] || {};
        const idx = i * 4;
        clamped[idx] = clamp255(p.r);
        clamped[idx + 1] = clamp255(p.g);
        clamped[idx + 2] = clamp255(p.b);
        clamped[idx + 3] = clamp255(p.a ?? 255);
      }
      const imgData = new ImageData(clamped, w, h);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.putImageData(imgData, 0, 0);
      const url = canvas.toDataURL('image/png');
      setImgUrl(url);
      setInfo(`Image: ${w}x${h}px (${norm.length} pixels, source: ${sourceType})`);
    } catch (e: any) {
      console.error(e);
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">JSON → Image</h2>
      <label className="block text-sm text-slate-300">
        Upload JSON file:
        <input
          type="file"
          accept=".json,application/json"
          className="mt-1 w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          onChange={(e) => handleJsonFile(e.target.files?.[0])}
          title="Upload JSON file"
        />
      </label>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Paste JSON from Image→JSON here'
        className="w-full h-32 bg-slate-950/70 border border-slate-800 rounded-md p-3 text-sm text-slate-200 font-mono"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={widthInput}
          onChange={(e) => setWidthInput(e.target.value ? Number(e.target.value) : '')}
          placeholder="Width (0 = auto)"
          className="bg-slate-950/70 border border-slate-800 rounded-md p-2 text-sm"
        />
        <input
          type="number"
          value={heightInput}
          onChange={(e) => setHeightInput(e.target.value ? Number(e.target.value) : '')}
          placeholder="Height (0 = auto)"
          className="bg-slate-950/70 border border-slate-800 rounded-md p-2 text-sm"
        />
      </div>
      <button
        onClick={handleConvert}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold"
      >
        Convert to Image
      </button>

      {info && <div className="text-xs text-slate-400 border border-slate-800 rounded-md p-2 bg-slate-950/60">{info}</div>}
      {imgUrl && (
        <div className="space-y-2 text-center">
          <img src={imgUrl} alt="result" className="max-h-64 mx-auto border border-slate-800 rounded-md image-rendering-pixelated" />
          <button
            className="px-3 py-2 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-600"
            onClick={() => downloadDataUrl(imgUrl, 'reconstructed.png')}
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}

// Helpers shared in web-app page
const clamp255 = (v: any) => Math.max(0, Math.min(255, Math.round(v || 0)));

async function resolvePixels(parsed: any, widthHint: number, heightHint: number) {
  let pixels: Pixel[] = [];
  let w = widthHint || 0;
  let h = heightHint || 0;
  let sourceType = 'array';

  if (Array.isArray(parsed)) {
    pixels = parsed;
    sourceType = 'array';
  }
  if (parsed?.pixels?.data) {
    pixels = parsed.pixels.data;
    sourceType = parsed.pixels.compressed ? 'pixels:compressed' : 'pixels:data';
    if (parsed.pixels.width && parsed.pixels.height) {
      w = w || parsed.pixels.width;
      h = h || parsed.pixels.height;
    }
    if (parsed.pixels.compressed) {
      pixels = rleDecompress(parsed.pixels.data);
    }
  } else if (parsed?.data && Array.isArray(parsed.data)) {
    pixels = parsed.data;
    sourceType = parsed.compressed ? 'data:compressed' : 'data';
    if (parsed.width && parsed.height) {
      w = w || parsed.width;
      h = h || parsed.height;
    }
    if (parsed.compressed) {
      pixels = rleDecompress(parsed.data);
    }
  }
  if ((!pixels || pixels.length === 0) && parsed?.base64) {
    sourceType = 'base64';
    const { pixels: basePixels, width, height } = await base64ToPixels(parsed.base64);
    pixels = basePixels;
    w = w || width;
    h = h || height;
  }
  if (!pixels || pixels.length === 0) throw new Error('No pixel data found');
  return { pixels, width: w, height: h, sourceType };
}

function base64ToPixels(base64: string): Promise<{ pixels: Pixel[]; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        const pixels: Pixel[] = [];
        for (let i = 0; i < data.length; i += 4) {
          pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
        }
        resolve({ pixels, width: img.width, height: img.height });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load base64 image'));
    img.src = 'data:image/png;base64,' + base64;
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename, true);
}

function downloadDataUrl(url: string, filename: string, revoke = false) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  if (revoke) URL.revokeObjectURL(url);
}
