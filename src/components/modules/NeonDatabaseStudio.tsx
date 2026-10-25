import React, { useState, useEffect } from 'react';
import {
  Database,
  Code2,
  Copy,
  Check,
  Play,
  Layers,
  Table,
  Terminal,
  Zap,
  Server,
  Key,
} from 'lucide-react';
import { getNeonDbTemplate } from '../../services/api';

export const NeonDatabaseStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'schema-sql' | 'drizzle' | 'query-runner' | 'connection'>('schema-sql');
  const [copied, setCopied] = useState<string | null>(null);
  const [dbData, setDbData] = useState<any>(null);

  // Query Runner Simulation
  const [activeQuery, setActiveQuery] = useState<string>('SELECT * FROM catalog_items WHERE in_stock = true;');
  const [queryResult, setQueryResult] = useState<any[] | null>([
    { id: 'uuid-101', sku: 'APX-HD900', name: 'Apex Studio Wireless Headphones', price: '299.00', in_stock: true, category: 'Headphones' },
    { id: 'uuid-102', sku: 'APX-MIC-PRO', name: 'Broadcast XLR & USB Condenser Mic', price: '189.00', in_stock: true, category: 'Microphones' },
    { id: 'uuid-103', sku: 'APX-MON-5', name: 'Nearfield Active Studio Monitors', price: '499.00', in_stock: true, category: 'Speakers' },
  ]);

  useEffect(() => {
    getNeonDbTemplate().then((res) => {
      setDbData(res);
    }).catch(console.error);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExecuteQuery = () => {
    if (activeQuery.includes('users')) {
      setQueryResult([
        { id: 'usr-88a', email: 'creator@studio.com', tier: 'pro', credits_remaining: 480, created_at: '2026-10-25T07:00:00Z' },
        { id: 'usr-92b', email: 'marketer@growth.io', tier: 'enterprise', credits_remaining: 12000, created_at: '2026-10-24T12:30:00Z' },
      ]);
    } else if (activeQuery.includes('video_jobs')) {
      setQueryResult([
        { id: 'job-01', title: 'Viral AI Content Hack', aspect_ratio: '9:16', filter_type: 'anime', status: 'completed' },
        { id: 'job-02', title: 'Cinematic 4K Drone Reel', aspect_ratio: '16:9', filter_type: 'none', status: 'completed' },
      ]);
    } else {
      setQueryResult([
        { id: 'uuid-101', sku: 'APX-HD900', name: 'Apex Studio Wireless Headphones', price: '299.00', in_stock: true, category: 'Headphones' },
        { id: 'uuid-102', sku: 'APX-MIC-PRO', name: 'Broadcast XLR & USB Condenser Mic', price: '189.00', in_stock: true, category: 'Microphones' },
      ]);
    }
  };

  const schemaTables = [
    { name: 'users', desc: 'User accounts, tiers, and credit balance' },
    { name: 'video_jobs', desc: 'yt-dlp extractions, transcodes & aspect crops' },
    { name: 'cartoon_stories', desc: 'Gemini AI storyboards, scene prompts & audio' },
    { name: 'catalog_items', desc: 'Products, SKUs, pricing & inventory' },
    { name: 'generated_catalogs', desc: 'Archived PDF line sheets & metadata' },
    { name: 'ad_designs', desc: 'Social poster canvases & banner presets' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Database className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Neon PostgreSQL Database Architecture
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Serverless relational PostgreSQL configuration template for storing media pipelines, cartoon stories, product catalogs, and ad campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Neon Serverless Engine
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'schema-sql', label: 'SQL DDL Migrations', icon: Database },
          { id: 'drizzle', label: 'Drizzle ORM Schema', icon: Code2 },
          { id: 'query-runner', label: 'Interactive SQL Console', icon: Terminal },
          { id: 'connection', label: 'Connection & Drivers', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content based on subTab */}
      {activeSubTab === 'schema-sql' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Full PostgreSQL DDL script for Neon, Supabase, or standard Postgres 15+
            </div>
            <button
              onClick={() => handleCopy(dbData?.schemaSQL || '', 'sql')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              {copied === 'sql' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied === 'sql' ? 'Copied SQL!' : 'Copy SQL Schema'}
            </button>
          </div>

          <pre className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {dbData?.schemaSQL || 'Loading SQL schema...'}
          </pre>
        </div>
      )}

      {activeSubTab === 'drizzle' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Type-safe Drizzle ORM models for Next.js & Node.js backend handlers
            </div>
            <button
              onClick={() => handleCopy(dbData?.drizzleSchema || '', 'drizzle')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              {copied === 'drizzle' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied === 'drizzle' ? 'Copied Drizzle!' : 'Copy Drizzle Model'}
            </button>
          </div>

          <pre className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {dbData?.drizzleSchema || 'Loading Drizzle schema...'}
          </pre>
        </div>
      )}

      {activeSubTab === 'query-runner' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                Live SQL Query Console
              </span>
              <div className="flex gap-2">
                {['SELECT * FROM catalog_items;', 'SELECT * FROM users;', 'SELECT * FROM video_jobs;'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setActiveQuery(q)}
                    className="text-[10px] font-mono text-cyan-400 hover:underline"
                  >
                    {q.split(' ')[3]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleExecuteQuery}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Run
              </button>
            </div>
          </div>

          {/* Results Table */}
          {queryResult && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="border-b border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 flex justify-between">
                <span>Query Output ({queryResult.length} rows returned)</span>
                <span className="text-emerald-400 font-mono">2ms response</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      {Object.keys(queryResult[0] || {}).map((col) => (
                        <th key={col} className="px-4 py-2.5 font-bold uppercase text-[10px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {queryResult.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-4 py-2 text-slate-300">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'connection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-cyan-400" />
              Neon Serverless Driver (@neondatabase/serverless)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect to Neon from edge functions, serverless API routes, and standard Node.js applications with zero connection pooling overhead.
            </p>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const response = await sql\`SELECT * FROM catalog_items\`;`}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-purple-400" />
              Environment Variables (.env)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure connection string with connection pooler and SSL mode enabled:
            </p>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`DATABASE_URL="postgresql://user:pass@ep-sample-pooler.neon.tech/neondb?sslmode=require"
PGHOST="ep-sample-pooler.neon.tech"
PGDATABASE="neondb"`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
