'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css/github-markdown-dark.css';
import { Copy, Check, ExternalLink, Briefcase, Building2, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTailoring, setIsProcessingTailor] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [tailoring, setTailoring] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'testing' | 'success' | 'failed'>('testing');
  const [copied, setCopied] = useState(false);
  const [currentJD, setCurrentJD] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.from('_test_').select('*').limit(1);
        if (error && error.message.includes('FetchError')) {
           setDbStatus('failed');
        } else {
           setDbStatus('success');
        }
      } catch (e) {
        setDbStatus('failed');
      }
    }
    testConnection();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTailor = async () => {
    if (!currentJD) return;
    setIsProcessingTailor(true);
    setTailoring(null);
    try {
      const res = await fetch('http://localhost:3001/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText: currentJD }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTailoring(data.tailoringText);
    } catch (error: any) {
      alert(`Tailoring failed: ${error.message}`);
    } finally {
      setIsProcessingTailor(false);
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setEvaluation(null);
    setTailoring(null);

    try {
      // 1. Scrape the job
      const scrapeRes = await fetch('http://localhost:8000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const scrapeData = await scrapeRes.json();
      
      let jdText = "";
      if (typeof scrapeData === 'string') {
        jdText = scrapeData;
      } else if (scrapeData && scrapeData.job_description) {
        jdText = scrapeData.job_description;
      } else {
        jdText = JSON.stringify(scrapeData);
      }

      setCurrentJD(jdText);

      // 2. Evaluate the job
      const evalRes = await fetch('http://localhost:3001/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText }),
      });
      const evalData = await evalRes.json();
      
      if (evalData.error) {
        throw new Error(evalData.error);
      }

      // 3. Pre-process Markdown
      if (evalData.evaluationText) {
        evalData.evaluationText = evalData.evaluationText
          .replace(/\r\n/g, '\n')
          .replace(/\|(\n)([^\n|])/g, '|$1\n$2')
          .replace(/([^\n])\n\|/g, '$1\n\n|');
      }
      
      setEvaluation(evalData);
    } catch (error: any) {
      console.error('Error processing job:', error);
      alert(`Failed to process job: ${error.message || 'Check if Scraper and Engine APIs are running.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Career Autopilot</h1>
          <p className="text-gray-400 mt-1">Advanced Job Analysis & CV Strategic Tailoring</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
          dbStatus === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
          dbStatus === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          <div className={`w-2 h-2 rounded-full ${dbStatus === 'success' ? 'bg-green-500' : dbStatus === 'failed' ? 'bg-red-500' : 'bg-gray-500'}`} />
          DB: {dbStatus}
        </div>
      </div>
      
      <form onSubmit={handleEvaluate} className="mb-12">
        <div className="flex flex-col sm:flex-row gap-4 bg-[#121814] p-2 rounded-2xl border border-[#243f30] shadow-xl">
          <div className="flex-1 flex items-center px-4 py-2">
            <Briefcase className="text-accent w-5 h-5 mr-3 opacity-50" />
            <input
              type="url"
              placeholder="Paste Job URL (Greenhouse, Lever, Ashby, LinkedIn)..."
              className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="bg-accent hover:bg-accent/90 disabled:bg-gray-700 disabled:text-gray-400 text-black font-bold px-10 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Evaluate Role
                <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      {evaluation && evaluation.summary && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Summary Header */}
          <div className="bg-[#121814] border border-[#243f30] rounded-2xl p-8 mb-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={handleCopy}
                className="p-2.5 rounded-lg bg-[#1a231d] border border-[#243f30] text-gray-400 hover:text-white transition-colors"
                title="Copy full evaluation"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white leading-none mb-2">{evaluation.summary.role || 'New Role'}</h2>
                  <div className="flex items-center gap-2 text-accent/80 font-semibold text-lg uppercase tracking-wide">
                    <span>{evaluation.summary.company || 'Company'}</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-gray-400 text-sm">{evaluation.summary.archetype || 'Evaluating'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end bg-[#1a231d] px-8 py-4 rounded-2xl border border-[#243f30]">
                <span className="text-5xl font-black text-accent">{evaluation.summary.score || '?'}<span className="text-2xl text-accent/40">/5</span></span>
                <span className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Strategic Match Score</span>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#121814] border border-[#243f30] rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-[#1a231d]/50 px-8 py-4 border-b border-[#243f30] flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-accent" />
                  Tactical Analysis Report
                </h3>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
              </div>
              <div className="p-8 md:p-12 overflow-x-auto bg-[#0d1117]">
                <div key={evaluation.summary.role} className="markdown-body github-markdown-body !bg-transparent !text-gray-300 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {evaluation.evaluationText?.split('---SCORE_SUMMARY---')[0].trim()}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button 
                onClick={handleTailor}
                disabled={isTailoring}
                className="flex-1 bg-white text-black font-extrabold py-5 rounded-xl hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1"
              >
                {isTailoring ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Strategizing...
                  </>
                ) : (
                  'Tailor My CV Strategy'
                )}
              </button>
              <button className="flex-1 border-2 border-accent text-accent font-extrabold py-5 rounded-xl hover:bg-accent/5 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1">
                Generate Interview Prep
              </button>
            </div>

            {tailoring && (
              <div className="bg-[#121814] border border-[#243f30] rounded-2xl shadow-2xl overflow-hidden mt-6 animate-in zoom-in-95 duration-500">
                <div className="bg-[#1a231d]/50 px-8 py-4 border-b border-[#243f30] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    CV Tailoring Strategy
                  </h3>
                  <button 
                    onClick={() => handleCopy(tailoring)}
                    className="text-xs text-accent hover:text-white transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy Plan'}
                  </button>
                </div>
                <div className="p-8 md:p-12 bg-[#0d1117]">
                  <div className="markdown-body github-markdown-body !bg-transparent !text-gray-300 max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {tailoring}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!evaluation && !isProcessing && (
        <div className="mt-20 text-center opacity-30 select-none">
          <div className="w-24 h-24 bg-[#121814] border border-[#243f30] rounded-full mx-auto mb-6 flex items-center justify-center">
             <Briefcase className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-xl font-medium text-gray-500">Paste a job URL above to start your tactical analysis</p>
        </div>
      )}
    </div>
  );
}
