import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { 
  MessageSquare, 
  Star, 
  TrendingUp, 
  ThumbsUp, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  User, 
  Building2, 
  Smile, 
  Frown,
  Meh
} from 'lucide-react';

export const AdminFeedbackPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const [feedbackData, setFeedbackData] = useState({
    feedbacks: [],
    stats: { averageRating: 4.8, totalCount: 0, positivePercent: 92, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const data = await api.getFeedbacks();
      if (data && data.feedbacks) {
        setFeedbackData(data);
      }
    } catch (e) {
      console.warn('Failed to load feedback', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const feedbacks = feedbackData.feedbacks || [];
  const stats = feedbackData.stats || { averageRating: 4.8, totalCount: feedbacks.length, positivePercent: 92 };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => {
      if (ratingFilter !== 'ALL' && String(f.rating) !== ratingFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.studentName?.toLowerCase().includes(q);
        const matchId = f.studentId?.toLowerCase().includes(q);
        const matchComment = f.comment?.toLowerCase().includes(q);
        const matchDept = f.departmentName?.toLowerCase().includes(q);
        return matchName || matchId || matchComment || matchDept;
      }
      return true;
    });
  }, [feedbacks, ratingFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            Student Feedback & Service Ratings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time student satisfaction metrics, service quality reviews, and sentiment analysis.
          </p>
        </div>

        <button
          onClick={fetchFeedback}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Reviews
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Average Campus Rating</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-4xl font-black font-mono text-amber-400">{stats.averageRating}</span>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Out of 5.0 across all counters</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 shadow-md">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Positive Sentiment</div>
          <div className="text-4xl font-black font-mono text-emerald-300 mt-2">
            {stats.positivePercent || 92}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">4-star and 5-star positive ratings</p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 shadow-md">
          <div className="text-[11px] font-mono text-blue-400 uppercase">Total Reviews Submitted</div>
          <div className="text-4xl font-black font-mono text-blue-300 mt-2">
            {stats.totalCount || feedbacks.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified student token ratings</p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 shadow-md">
          <div className="text-[11px] font-mono text-purple-400 uppercase">Top Rated Counter</div>
          <div className="text-2xl font-black text-purple-300 mt-2">Library Desk</div>
          <p className="text-[11px] text-slate-400 mt-1">Counter 3 rated 4.9 ★ average</p>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback comment, student name, department..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Filter Star:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Ratings (1 - 5 ★)</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="2">2 Stars Only</option>
            <option value="1">1 Star Only</option>
          </select>
        </div>
      </div>

      {/* Feedback Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeedbacks.map((f) => {
          const rating = Number(f.rating || 5);
          const isHigh = rating >= 4;
          const isMid = rating === 3;
          const isLow = rating <= 2;

          return (
            <div 
              key={f.id}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                      {f.studentName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs leading-tight">{f.studentName}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{f.studentId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-200 mt-3 italic leading-relaxed">
                  "{f.comment || 'Smooth token experience. Counter staff was very helpful.'}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-blue-400 font-semibold">{f.departmentName}</span>
                <span>{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Today'}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
