import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Calendar, 
  Inbox,
  ArrowLeft,
  Sparkles,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (userData: UserProfile) => void;
}

type AuthView = 'login' | 'register' | 'verify_pending';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSimulatedEmail, setShowSimulatedEmail] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'Pria' | 'Wanita'>('Pria');

  const getRegisteredUsers = (): UserProfile[] => {
    return JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
  };

  const updateUsers = (users: UserProfile[]) => {
    localStorage.setItem('hg_registered_users', JSON.stringify(users));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || !name || !age || !weight || !height) {
      setError("Mohon lengkapi semua data biometrik Anda.");
      return;
    }

    const users = getRegisteredUsers();
    if (users.find(u => u.email === email)) {
      setError("Email ini sudah terdaftar. Silakan masuk.");
      return;
    }
    
    const newUser: UserProfile = {
      name,
      email,
      password,
      isVerified: false,
      language: 'id',
      age: parseInt(age),
      weight: parseInt(weight),
      height: parseInt(height),
      gender: gender,
      goal: 'Meningkatkan Stamina',
      weightHistory: [],
      activityLog: [],
      dietPreference: 'Semua (Normal)',
      dietProtocol: 'Standard',
      allergies: [],
      medicalConditions: [],
      activityLevel: 'Moderat',
      focusArea: 'Energi',
      formula: { metabolism: 3, recovery: 3, focus: 3, longevity: 3 },
      emergencyContacts: [],
      connectedDevices: [],
      hydrationToday: 0,
      hydrationGoal: 2000,
      sleepLast_night: 0,
      sleepGoal: 8,
      immunityStatus: 'Stabil',
      wellnessPrefs: {
        meditation: true,
        exercise: true,
        deepSleep: true,
        hydration: true,
      }
    };

    updateUsers([...users, newUser]);
    setPendingEmail(email);
    setView('verify_pending');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setError("Email atau kata sandi tidak ditemukan.");
      return;
    }

    if (!user.isVerified) {
      setPendingEmail(email);
      setView('verify_pending');
      return;
    }

    onLogin(user);
  };

  const simulateVerification = () => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => u.email === pendingEmail ? { ...u, isVerified: true } : u);
    updateUsers(updatedUsers);
    
    setSuccess("Verifikasi Berhasil! Akun Anda kini aktif.");
    setShowSimulatedEmail(false);
    setView('login');
    // Clear pending email to reset view state correctly
    setPendingEmail('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      {/* Simulated Email Modal */}
      {showSimulatedEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-slide-up">
            <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2.5 rounded-2xl">
                  <Inbox size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg">HG Cloud Inbox</h3>
                  <p className="text-[10px] text-indigo-100 font-black uppercase tracking-widest">Sistem Verifikasi Otomatis</p>
                </div>
              </div>
              <button onClick={() => setShowSimulatedEmail(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Konfirmasi Pendaftaran
                </div>
                <h2 className="text-3xl font-black text-slate-800 leading-tight">Aktifkan Profil HealthGuard Anda</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Halo <strong>{name || pendingEmail}</strong>, langkah terakhir untuk mengaktifkan AI kesehatan Anda adalah memverifikasi email ini.
                </p>
              </div>
              
              <button 
                onClick={simulateVerification}
                className="w-full bg-indigo-600 text-white py-6 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all group"
              >
                Verifikasi Akun Sekarang <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              </button>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <ShieldCheck size={16} /> Enkripsi End-to-End Aktif
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-xl rounded-[60px] shadow-2xl shadow-emerald-100/30 overflow-hidden border border-slate-100 animate-fade-in flex flex-col">
        <div className="bg-emerald-600 p-12 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white/20 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20 shadow-2xl">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-1">HealthGuard</h1>
            <p className="text-emerald-100 font-black uppercase tracking-[0.2em] text-[9px]">Artificial Intelligence Health Hub</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        </div>

        {view === 'verify_pending' ? (
          <div className="p-12 md:p-16 text-center space-y-10 animate-slide-up">
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-500">
              <Mail size={48} className="animate-bounce" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-800">Verifikasi Menunggu</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Kami telah mengirimkan instruksi verifikasi ke <span className="text-emerald-600 font-bold">{pendingEmail}</span>.
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowSimulatedEmail(true)}
                className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                <Inbox size={18} /> Buka Simulasi Email
              </button>
              <button 
                onClick={() => setView('login')}
                className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest"
              >
                Gunakan Akun Lain
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={view === 'register' ? handleRegister : handleLogin} className="p-10 md:p-14 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {view === 'register' ? 'Daftar Profil Biometrik' : 'Selamat Datang Kembali'}
              </h2>
              <p className="text-slate-400 font-medium text-sm mt-1">
                {view === 'register' ? 'Isi data untuk pemantauan kesehatan AI' : 'Masuk untuk memantau progres Anda'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-3xl flex items-center gap-4 text-[11px] font-black border border-red-100 animate-shake">
                <AlertCircle size={20} className="shrink-0" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-5 rounded-3xl flex items-center gap-4 text-[11px] font-black border border-emerald-100">
                <CheckCircle2 size={20} className="shrink-0" /> {success}
              </div>
            )}

            <div className="space-y-4">
              {view === 'register' && (
                <div className="relative group">
                  <User className="absolute left-6 top-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/10 focus:bg-white rounded-[24px] py-6 pl-16 pr-6 transition-all text-slate-800 font-bold focus:outline-none shadow-sm"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-6 top-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Alamat Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/10 focus:bg-white rounded-[24px] py-6 pl-16 pr-6 transition-all text-slate-800 font-bold focus:outline-none shadow-sm"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-6 top-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/10 focus:bg-white rounded-[24px] py-6 pl-16 pr-6 transition-all text-slate-800 font-bold focus:outline-none shadow-sm"
                />
              </div>

              {view === 'register' && (
                <div className="space-y-4 animate-slide-up">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender('Pria')}
                      className={`py-5 rounded-[22px] font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                        gender === 'Pria' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'
                      }`}
                    >
                      Pria
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('Wanita')}
                      className={`py-5 rounded-[22px] font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                        gender === 'Wanita' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'
                      }`}
                    >
                      Wanita
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Umur</label>
                       <input type="number" required value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-4 text-center text-slate-800 font-black focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">BB (kg)</label>
                       <input type="number" required value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-4 text-center text-slate-800 font-black focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">TB (cm)</label>
                       <input type="number" required value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-4 text-center text-slate-800 font-black focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 group"
            >
              {view === 'register' ? 'Mulai Pendaftaran' : 'Masuk Dashboard'}
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-4 text-center border-t border-slate-50">
              <button 
                type="button"
                onClick={() => {
                  setView(view === 'register' ? 'login' : 'register');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-all"
              >
                {view === 'register' ? 'Sudah terdaftar? Masuk' : 'Pengguna baru? Buat Profil'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Login;

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);