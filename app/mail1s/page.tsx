'use client';

import { useState, useEffect } from 'react';
import { Mail1sClient } from '@/lib/mail1s-client';
import Link from 'next/link';

export default function Mail1sPage() {
  const [client] = useState(() => new Mail1sClient());
  const [activeTab, setActiveTab] = useState<'shortlinks' | 'email' | 'openapi' | 'storage'>('shortlinks');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Short Links State
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortLinkResult, setShortLinkResult] = useState<any>(null);

  // Email State
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailDomain, setEmailDomain] = useState('mail1s.net');
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [selectedMailbox, setSelectedMailbox] = useState('');
  const [inbox, setInbox] = useState<any[]>([]);

  // Open API State
  const [apiUrl, setApiUrl] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<any>(null);
  const [markdown, setMarkdown] = useState('');

  // Storage State
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load mailboxes on mount
  useEffect(() => {
    loadMailboxes();
  }, []);

  const loadMailboxes = async () => {
    try {
      const result = await client.getMailboxes();
      setMailboxes(result);
    } catch (error) {
      console.error('Failed to load mailboxes:', error);
    }
  };

  const handleCreateShortLink = async () => {
    if (!longUrl) {
      setMessage('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const result = await client.createShortLink(longUrl, {
        customAlias: customAlias || undefined,
        generateQR: true,
      });
      setShortLinkResult(result);
      setMessage('Short link created successfully!');
      setLongUrl('');
      setCustomAlias('');
    } catch (error) {
      setMessage('Failed to create short link');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMailbox = async () => {
    if (!emailPrefix) {
      setMessage('Please enter an email prefix');
      return;
    }

    setLoading(true);
    try {
      const result = await client.createMailbox(emailPrefix, emailDomain);
      setMailboxes([...mailboxes, result]);
      setMessage(`Email created: ${result.email}`);
      setEmailPrefix('');
      loadMailboxes();
    } catch (error) {
      setMessage('Failed to create mailbox');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadInbox = async () => {
    if (!selectedMailbox) {
      setMessage('Please select a mailbox');
      return;
    }

    setLoading(true);
    try {
      const result = await client.getMailboxInbox(selectedMailbox);
      setInbox(result);
      setMessage('Inbox loaded');
    } catch (error) {
      setMessage('Failed to load inbox');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractMetadata = async () => {
    if (!apiUrl) {
      setMessage('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const result = await client.getWebsiteMetadata(apiUrl);
      setMetadata(result);
      setMessage('Metadata extracted successfully');
    } catch (error) {
      setMessage('Failed to extract metadata');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureScreenshot = async () => {
    if (!apiUrl) {
      setMessage('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const result = await client.captureWebsiteScreenshot(apiUrl);
      setScreenshot(result);
      setMessage('Screenshot captured successfully');
    } catch (error) {
      setMessage('Failed to capture screenshot');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertMarkdown = async () => {
    if (!apiUrl) {
      setMessage('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const result = await client.convertWebsiteToMarkdown(apiUrl);
      setMarkdown(result.markdown);
      setMessage('Converted to markdown successfully');
    } catch (error) {
      setMessage('Failed to convert to markdown');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const result = await client.uploadFile(selectedFile);
      setFiles([...files, result]);
      setMessage('File uploaded successfully');
      setSelectedFile(null);
    } catch (error) {
      setMessage('Failed to upload file');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📮</span>
              <div>
                <h1 className="text-4xl font-bold">Mail1s.net Suite</h1>
                <p className="text-slate-400">Professional services integration</p>
              </div>
            </div>
            <Link href="/" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
              ← Back
            </Link>
          </div>

          {/* Status */}
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-300">✓ Connected to Mail1s.net</p>
            <p className="text-sm text-green-400">All services are ready to use</p>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-300">
              {message}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('shortlinks')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'shortlinks'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            🔗 Short Links
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'email'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📧 Email
          </button>
          <button
            onClick={() => setActiveTab('openapi')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'openapi'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            🌐 Open API
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'storage'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            💾 Storage
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Short Links Tab */}
          {activeTab === 'shortlinks' && (
            <>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Create Short Link</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Long URL</label>
                    <input
                      type="url"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="https://example.com/very/long/url"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Custom Alias (Optional)</label>
                    <input
                      type="text"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="my-link"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateShortLink}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Creating...' : 'Create Short Link'}
                  </button>
                </div>
              </div>

              {shortLinkResult && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Result</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Short URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={shortLinkResult.short_url}
                          readOnly
                          className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shortLinkResult.short_url);
                            setMessage('Copied to clipboard!');
                          }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    {shortLinkResult.qr_code && (
                      <div>
                        <label className="block text-sm font-semibold mb-2">QR Code</label>
                        <img
                          src={shortLinkResult.qr_code}
                          alt="QR Code"
                          className="w-48 h-48 border border-slate-600 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Create Email</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Prefix</label>
                    <input
                      type="text"
                      value={emailPrefix}
                      onChange={(e) => setEmailPrefix(e.target.value)}
                      placeholder="myemail"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Domain</label>
                    <select
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>mail1s.net</option>
                      <option>uv.do</option>
                    </select>
                  </div>
                  <button
                    onClick={handleCreateMailbox}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Creating...' : 'Create Email'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Your Mailboxes</h2>
                <div className="space-y-2">
                  {mailboxes.length === 0 ? (
                    <p className="text-slate-400">No mailboxes created yet</p>
                  ) : (
                    mailboxes.map((mb) => (
                      <div
                        key={mb.id}
                        onClick={() => setSelectedMailbox(mb.id)}
                        className={`p-3 rounded-lg cursor-pointer transition ${
                          selectedMailbox === mb.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        }`}
                      >
                        {mb.email}
                      </div>
                    ))
                  )}
                </div>
                {selectedMailbox && (
                  <button
                    onClick={handleLoadInbox}
                    disabled={loading}
                    className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Loading...' : 'Load Inbox'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Open API Tab */}
          {activeTab === 'openapi' && (
            <>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Website Tools</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Website URL</label>
                    <input
                      type="url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleExtractMetadata}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Extracting...' : 'Extract Metadata'}
                  </button>
                  <button
                    onClick={handleCaptureScreenshot}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Capturing...' : 'Capture Screenshot'}
                  </button>
                  <button
                    onClick={handleConvertMarkdown}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Converting...' : 'Convert to Markdown'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Results</h2>
                {metadata && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-400">Title</p>
                      <p className="text-white">{metadata.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Description</p>
                      <p className="text-white text-sm">{metadata.description}</p>
                    </div>
                  </div>
                )}
                {screenshot && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Screenshot</p>
                    <img
                      src={screenshot.screenshot_url}
                      alt="Screenshot"
                      className="w-full rounded-lg border border-slate-600"
                    />
                  </div>
                )}
                {markdown && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Markdown</p>
                    <textarea
                      value={markdown}
                      readOnly
                      className="w-full h-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Storage Tab */}
          {activeTab === 'storage' && (
            <>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Upload File</h2>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <p className="text-slate-400">📁 Click to upload or drag & drop</p>
                    <input
                      id="fileInput"
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-slate-300">Selected: {selectedFile.name}</p>
                  )}
                  <button
                    onClick={handleUploadFile}
                    disabled={loading || !selectedFile}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Files</h2>
                <div className="space-y-2">
                  {files.length === 0 ? (
                    <p className="text-slate-400">No files uploaded yet</p>
                  ) : (
                    files.map((file) => (
                      <div key={file.id} className="p-3 bg-slate-700 rounded-lg">
                        <p className="text-white font-semibold">{file.name}</p>
                        <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
