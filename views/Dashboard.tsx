import React, { useState, useEffect } from 'react';
import { Activity, Flame, Droplets, Utensils, Target, Brain, Shield, AlertCircle, Stethoscope, Smile, Frown, Meh, HeartPulse, Sparkles, ChevronRight, Plus, Moon, RefreshCw, X, Heart, BookOpen, Coffee, Apple, Monitor, GlassWater, ExternalLink, Newspaper, Loader2 } from 'lucide-react';
import { UserProfile, FoodAnalysis, HealthArticle } from '../types';
import { getHealthArticles } from '../services/geminiService';

interface DashboardProps {
  onViewChange?: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nutri_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<FoodAnalysis[]>(() => {
    const saved = localStorage.getItem('nutri_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [quickAdvice, setQuickAdvice] = useState<{topic: string, text: string} | null>(null);
  
  const isEn = profile?.language === 'en';

  useEffect(() => {
    const savedHistory = localStorage.getItem('nutri_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedProfile = localStorage.getItem('nutri_profile');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      if (data.hydrationToday === undefined) data.hydrationToday = 0;
      if (data.sleepLast_night === undefined) data.sleepLast_night = 0;
      setProfile(data);
    }

    fetchArticles();
  }, []);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchArticles = async () => {
    setArticlesLoading(true);
    try {
      const lang = profile?.language || 'id';
      const data = await getHealthArticles(lang);
      const randomArticles = shuffleArray(data).slice(0, 4);
      setArticles(randomArticles);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setArticlesLoading(false);
    }
  };

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    localStorage.setItem('nutri_profile', JSON.stringify(updated));
  };

  const addHydration = () => {
    const newVal = (profile?.hydrationToday || 0) + 250;
    updateProfileField('hydrationToday', newVal);
  };

  const handleSleepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    updateProfileField('sleepLast_night', val);
  };

  if (!profile) return null;

  const targetCalories = Math.round((10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + (profile.gender === 'Pria' ? 5 : -161));
  const caloriesNow = history.reduce((sum, item) => sum + (item.nutrients?.calories || 0), 0);

  const mentalStatus = (() => {
    const rating = profile?.moodRating;
    if (!rating) return { emoji: "😶", msg: isEn ? "Log mood below." : "Catat mood di bawah.", color: "bg-white/5 border-white/10" };
    if (rating <= 2) return { emoji: "🚨", msg: isEn ? "AI: Fatigue detected." : "AI: Deteksi kelelahan.", color: "bg-red-500/20 border-red-500/30 text-red-100" };
    if (rating === 3) return { emoji: "⚖️", msg: isEn ? "AI: State stable." : "AI: Kondisi stabil.", color: "bg-amber-500/20 border-amber-500/30 text-amber-100" };
    return { emoji: "✨", msg: isEn ? "AI: Peak performance." : "AI: Performa puncak.", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-100" };
  })();

  return (
    <div className="animate-fade-in space-y-10 pb-24">
      {quickAdvice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 space-y-6 relative border-4 border-slate-100 shadow-2xl">
             <button onClick={() => setQuickAdvice(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
             </button>
             <h3 className="text-2xl font-black text-slate-800 capitalize">AI: {quickAdvice.topic}</h3>
             <div className="text-slate-800 font-bold leading-relaxed text-sm p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                {quickAdvice.text}
             </div>
             <button onClick={() => setQuickAdvice(null)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                {isEn ? 'Got it' : 'Mengerti'}
             </button>
          </div>
        </div>
      )}

      <header>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2 block">Personal Bio-Metrics</span>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
          {isEn ? `Status, ${profile.name.split(' ')[0]}` : `Status, ${profile.name.split(' ')[0]}`}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 bg-white p-12 rounded-[56px] border-4 border-slate-50 shadow-sm flex flex-col justify-between group overflow-hidden relative">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{isEn ? 'Calories Today' : 'Kalori Hari Ini'}</p>
            <div className="flex items-baseline gap-4">
              <span className="text-8xl font-black text-slate-900 tracking-tighter">{caloriesNow}</span>
              <span className="text-slate-300 font-black text-2xl tracking-tight">/ {targetCalories} kcal</span>
            </div>
            <div className="mt-10 w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1.5 border-2 border-slate-50">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-lg shadow-emerald-100" style={{ width: `${Math.min((caloriesNow / targetCalories) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="mt-12 pt-10 border-t-4 border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center border-2 border-orange-50 shadow-inner shadow-orange-50/50"><Flame size={32} /></div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Metabolic Rate</p>
                  <p className="text-xl font-black text-slate-900">Active Status</p>
                </div>
             </div>
             <button onClick={() => onViewChange?.('analyzer')} className="bg-emerald-50 text-emerald-600 py-4 px-8 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all border-2 border-emerald-100">
                {isEn ? 'Scan Food' : 'Scan Makan'} <ChevronRight size={16} />
             </button>
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-900 rounded-[56px] p-10 text-white flex flex-col items-center relative overflow-hidden group border-4 border-slate-800">
          <div className="relative z-10 w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <div className="bg-white/10 w-16 h-16 rounded-3xl flex items-center justify-center border-2 border-white/10 shadow-inner"><Brain size={32} /></div>
               <h3 className="text-2xl font-black tracking-tighter">Mind Hub</h3>
            </div>
            <div className="flex-1 space-y-6 mb-8">
               <div className={`p-6 rounded-[32px] border-2 transition-all duration-500 ${mentalStatus.color}`}>
                  <div className="flex items-center gap-4 text-left">
                     <span className="text-4xl">{mentalStatus.emoji}</span>
                     <p className="text-xs font-black leading-tight uppercase tracking-tight">{mentalStatus.msg}</p>
                  </div>
               </div>
               <div className="flex justify-between gap-3">
                 {[1, 3, 5].map(v => (
                   <button key={v} onClick={() => updateProfileField('moodRating', v)} className={`flex-1 h-16 rounded-2xl flex items-center justify-center transition-all border-2 ${profile.moodRating === v ? 'bg-white text-slate-900 border-white shadow-xl scale-105' : 'bg-white/5 border-white/10 hover:bg-white/20'}`}>
                     {v === 1 ? <Frown size={24} /> : v === 3 ? <Meh size={24} /> : <Smile size={24} />}
                   </button>
                 ))}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button onClick={() => onViewChange?.('survey')} className="bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-white/10 hover:bg-white/20 transition-all">Survey</button>
              <button onClick={() => onViewChange?.('mental-session')} className="bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all border-2 border-indigo-500 shadow-lg shadow-indigo-900/50">Chat AI</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
         <div className="bg-white p-10 rounded-[48px] border-4 border-slate-50 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-xl transition-all group">
             <div className="bg-blue-100 text-blue-600 p-6 rounded-3xl border-2 border-blue-50 shadow-inner group-hover:scale-110 transition-transform"><Droplets size={32} /></div>
             <div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Hydration</p>
               <p className="text-2xl font-black text-slate-900 tracking-tighter">{profile.hydrationToday}ml</p>
             </div>
             <button onClick={addHydration} className="w-full bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 border-2 border-blue-500"><Plus size={20} strokeWidth={4} /></button>
         </div>

         <div className="bg-white p-10 rounded-[48px] border-4 border-slate-50 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-xl transition-all group">
             <div className="bg-indigo-100 text-indigo-600 p-6 rounded-3xl border-2 border-indigo-50 shadow-inner group-hover:scale-110 transition-transform"><Moon size={32} /></div>
             <div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sleep (h)</p>
               <input type="number" step="0.5" value={profile.sleepLast_night} onChange={handleSleepChange} className="w-24 bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-center font-black text-2xl text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all" />
             </div>
         </div>

         <div className="bg-white p-10 rounded-[48px] border-4 border-slate-50 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-xl transition-all group">
             <div className="bg-purple-100 text-purple-600 p-6 rounded-3xl border-2 border-purple-50 shadow-inner group-hover:scale-110 transition-transform"><HeartPulse size={32} /></div>
             <div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Stress Score</p>
               <p className="text-3xl font-black text-slate-900 tracking-tighter">{profile.stressScore || '---'}%</p>
             </div>
             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${profile.stressScore || 0}%` }} />
             </div>
         </div>

         <div className="bg-white p-10 rounded-[48px] border-4 border-slate-50 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-xl transition-all group">
             <div className="bg-red-100 text-red-600 p-6 rounded-3xl border-2 border-red-50 shadow-inner group-hover:scale-110 transition-transform"><Shield size={32} /></div>
             <div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Immunity</p>
               <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{profile.immunityStatus}</p>
             </div>
             <span className="bg-red-50 text-red-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border-2 border-red-100">Verified</span>
         </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100"><Newspaper size={28} /></div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isEn ? 'Health Insights' : 'Wawasan Kesehatan'}</h2>
           </div>
           <button 
            onClick={fetchArticles} 
            disabled={articlesLoading}
            className="text-[10px] font-black text-slate-900 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-3 transition-all bg-white px-6 py-3 rounded-2xl border-2 border-slate-100 shadow-sm"
           >
              {articlesLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {isEn ? 'Refresh' : 'Segarkan'}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {articlesLoading ? (
             Array(4).fill(0).map((_, i) => (
               <div key={i} className="bg-white rounded-[40px] p-8 h-80 animate-pulse flex flex-col gap-6 border-4 border-slate-50 shadow-sm">
                  <div className="w-1/3 h-6 bg-slate-100 rounded-full" />
                  <div className="w-full h-12 bg-slate-100 rounded-2xl" />
                  <div className="w-full h-24 bg-slate-100 rounded-2xl mt-auto" />
               </div>
             ))
           ) : articles.length > 0 ? (
             articles.map((article, i) => (
               <div key={i} className="bg-white rounded-[40px] p-8 flex flex-col border-4 border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 bg-emerald-50 px-3 py-1.5 rounded-xl self-start border-2 border-emerald-100">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-5 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-700 font-bold line-clamp-3 mb-8 leading-relaxed">
                    {article.summary}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t-2 border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 truncate max-w-[100px] uppercase">
                      via {article.sourceName}
                    </span>
                    <a 
                      href={article.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-900 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      {isEn ? 'Source' : 'Sumber'} <ExternalLink size={14} />
                    </a>
                  </div>
               </div>
             ))
           ) : (
             <div className="col-span-full py-20 text-center bg-white rounded-[48px] border-4 border-dashed border-slate-100">
                <BookOpen className="mx-auto text-slate-200 mb-6" size={64} />
                <p className="text-slate-400 font-black uppercase tracking-widest">{isEn ? 'No articles found.' : 'Tidak ada artikel.'}</p>
             </div>
           )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;