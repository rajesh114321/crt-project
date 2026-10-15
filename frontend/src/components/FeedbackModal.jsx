import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Heart, 
  CheckCircle2, 
  X, 
  Sparkles,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQueue } from '../context/QueueContext';

export const FeedbackModal = ({ isOpen, onClose, token }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['⚡ Lightning Fast', '🎧 Polite Staff']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const tags = [
    '⚡ Lightning Fast',
    '📋 Clear Guidance',
    '🎧 Polite Staff',
    '⏱️ Long Wait Time',
    '🪑 Clean Seating Area',
    '💡 Helpful Desk'
  ];

  const { rateToken } = useQueue();

  const toggleTag = (t) => {
    setSelectedTags(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      if (token?.id) {
        const fullComment = (comment || '') + (selectedTags.length ? ' · ' + selectedTags.join(', ') : '');
        await rateToken(token.id, rating, fullComment);
      }
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    } catch (err) {
      console.warn("Feedback submission error:", err);
    }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-xl">
              <Star className="w-5 h-5 fill-current text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Rate Counter Service</h3>
              <p className="text-xs text-brand-100">Help improve college administrative turnaround</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your rating has been recorded to help administration optimize counter staffing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Star Rating Selector */}
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                How was your experience at Counter {token?.counter || 2}?
              </span>
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                {rating === 5 ? 'Excellent & Prompt Service' :
                 rating === 4 ? 'Good & Smooth' :
                 rating === 3 ? 'Average Service' :
                 rating === 2 ? 'Needs Improvement' : 'Unsatisfactory'}
              </p>
            </div>

            {/* Quick Feedback Pills */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Select highlights that apply:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                      selectedTags.includes(t)
                        ? 'bg-brand-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any comments for the department staff..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Submit Service Rating
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
