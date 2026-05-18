'use client';

import { useState, useEffect } from 'react';

export default function Profile() {
  const [cv, setCv] = useState('');
  const [profileYml, setProfileYml] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/profile')
      .then(res => res.json())
      .then(data => {
        setCv(data.cv);
        setProfileYml(data.profileYml);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('http://localhost:3001/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv, profileYml }),
      });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const res = await fetch('http://localhost:3001/profile/upload-cv', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.markdown) {
        setCv(data.markdown);
      }
      if (data.profileYml) {
        setProfileYml(data.profileYml);
      }
      alert('CV uploaded! We extracted your profile data and converted your CV to Markdown.');
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to process PDF CV.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="text-white p-20 text-center">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Your Profile</h1>
        <div className="flex gap-4">
          <label className="cursor-pointer bg-[#243f30] hover:bg-[#2e523e] text-accent font-bold py-2 px-6 rounded-lg transition-colors border border-accent/20">
            {isUploading ? 'Converting PDF...' : 'Upload PDF CV'}
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-accent font-bold mb-2 uppercase tracking-widest text-sm flex justify-between">
            <span>CV (Markdown)</span>
            <span className="text-xs text-gray-500 font-normal italic">Autofilled from PDF or manual edit</span>
          </label>
          <textarea
            className="w-full h-[600px] bg-[#121814] border border-[#243f30] rounded-lg p-4 text-gray-300 font-mono text-sm focus:outline-none focus:border-accent"
            value={cv}
            onChange={(e) => setCv(e.target.value)}
            placeholder="# Your Name..."
          />
        </div>

        <div>
          <label className="block text-accent font-bold mb-2 uppercase tracking-widest text-sm flex justify-between">
            <span>Config (YAML)</span>
            <span className="text-xs text-gray-500 font-normal italic">Target roles & preferences</span>
          </label>
          <textarea
            className="w-full h-[600px] bg-[#121814] border border-[#243f30] rounded-lg p-4 text-gray-300 font-mono text-sm focus:outline-none focus:border-accent"
            value={profileYml}
            onChange={(e) => setProfileYml(e.target.value)}
            placeholder="name: John Doe..."
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-gray-600 text-black font-bold py-4 rounded-lg transition-colors text-xl shadow-[0_0_20px_rgba(74,222,128,0.2)]"
          >
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
