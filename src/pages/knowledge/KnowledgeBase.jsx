import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  FileText,
  Clock,
  User,
  CheckCircle2,
  Trash2,
  Edit2,
  Tag,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export function KnowledgeBase() {
  const { articles, addArticle, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const categories = [
    'ALL',
    'Products',
    'Services',
    'Pricing',
    'Sales Scripts',
    'Objection Handling',
    'Policies',
    'Company Information'
  ];

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Products',
    summary: '',
    content: ''
  });

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === 'ALL' || art.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.content) {
      showToast('Title and content are required', 'warning');
      return;
    }
    addArticle(newDoc);
    setIsNewModalOpen(false);
    setNewDoc({ title: '', category: 'Products', summary: '', content: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Enterprise Knowledge Base
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ground-truth carrier documentation, pricing indexes, FMCSA regulatory matrices, and scripts.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-navy-900/80 border border-navy-800 rounded-2xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search knowledge documents, FMCSA regulations, script rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Articles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setActiveArticle(art)}
            className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-blue-500/40 transition cursor-pointer shadow-md group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {art.category}
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {art.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition mt-2">
                {art.title}
              </h3>

              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Updated: {art.updatedDate} by {art.updatedBy}</span>
              <span className="text-blue-400 font-medium group-hover:underline flex items-center gap-0.5">
                Read Article <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Read Modal */}
      <Modal
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        title={activeArticle?.title || 'Knowledge Base Document'}
        maxWidth="max-w-3xl"
      >
        {activeArticle && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <span className="text-indigo-400 font-semibold uppercase text-[10px]">
                {activeArticle.category} • {activeArticle.status}
              </span>
              <span className="text-slate-400 text-[11px]">
                Last updated {activeArticle.updatedDate} by {activeArticle.updatedBy}
              </span>
            </div>

            <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-slate-300 italic">
              {activeArticle.summary}
            </div>

            <div className="space-y-3 pt-2 text-slate-200 leading-relaxed text-sm">
              <h4 className="text-white font-bold text-base">Full Knowledge Details</h4>
              <p className="whitespace-pre-line text-xs sm:text-sm">{activeArticle.content}</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-navy-800">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-medium hover:bg-navy-750"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Article Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create Knowledge Base Document"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              placeholder="e.g. 2026 Diesel Wholesale Cost-Plus Index"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Category</label>
            <select
              value={newDoc.category}
              onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            >
              {categories.filter((c) => c !== 'ALL').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Brief Summary</label>
            <input
              type="text"
              value={newDoc.summary}
              onChange={(e) => setNewDoc({ ...newDoc, summary: e.target.value })}
              placeholder="One-line summary for sales representatives"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Document Text *</label>
            <textarea
              rows={6}
              required
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              placeholder="Enter markdown or plain text details for AI grounding and human review..."
              className="w-full p-3 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Publish to AI Vector Store
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
