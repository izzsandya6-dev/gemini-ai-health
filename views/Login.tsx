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
  Weight, 
  Ruler,
  ExternalLink,
  Inbox,
  ArrowLeft,
  Users,
  Sparkles
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

    const users = getRegisteredUsers();

    if (!email || !password || !name || !age || !weight || !height) {
      setError("Mohon lengkapi semua data profil Anda.");
      return;
    }

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
    setShowSimulatedEmail(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setError("Email atau kata sandi salah. Silakan coba lagi.");
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
    setSuccess("Email berhasil diverifikasi! Selamat datang di HealthGuard.");
    setShowSimulatedEmail(false);
    setView('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Simulated Email - Premium UI */}
      {showSimulatedEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-slide-up">
            <div className="bg-indigo-600 p-8 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Inbox size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">HealthGuard Cloud</h3>
                  <p className="text-xs text-indigo-100 font-medium">Verification Protocol</p>
                </div>
              </div>
              <button onClick={() => setShowSimulatedEmail(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Authentication Link
                </div>
                <h2 className="text-3xl font-black text-slate-800 leading-tight">Aktifkan Profil HealthGuard Anda</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Halo <strong>{name || pendingEmail}</strong>, kami telah memproses pendaftaran biometrik Anda. Klik tombol di bawah untuk memverifikasi identitas dan memulai konsultasi AI Anda.
                </p>
              </div>
              <button 
                onClick={simulateVerification}
                className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all group"
              >
                Verifikasi Sekarang <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <ShieldCheck size={14} /> Keamanan Data Terjamin
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-xl rounded-[60px] shadow-2xl shadow-emerald-100/50 overflow-hidden border border-slate-100 animate-fade-in flex flex-col">
        <div className="bg-emerald-600 p-12 text-white text-center relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="bg-white/20 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/30 shadow-2xl">
              <ShieldCheck size={48} strokeWidth={2} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-2">HealthGuard</h1>
            <p className="text-emerald-100 font-bold uppercase tracking-[0.2em] text-[10px]">Asisten Gizi & Medis AI</p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        </div>

        {view === 'verify_pending' ? (
          <div className="p-16 text-center space-y-10 animate-slide-up flex-1 flex flex-col justify-center">
            <div className="bg-emerald-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
              <Mail size={56} className="animate-bounce" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Verifikasi Email</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Kami telah mengirimkan instruksi ke <strong>{pendingEmail}</strong>. Silakan verifikasi akun Anda sebelum masuk.</p>
            </div>
            <button 
              onClick={() => setShowSimulatedEmail(true)}
              className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group"
            >
              <Inbox size={20} /> Buka Simulasi Email
            </button>
            <button 
              onClick={() => setView('login')}
              className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors"
            >
              Kembali ke Halaman Login
            </button>
          </div>
        ) : (
          <form onSubmit={view === 'register' ? handleRegister : handleLogin} className="p-10 md:p-14 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {view === 'register' ? 'Daftar Profil Baru' : 'Selamat Datang'}
              </h2>
              <p className="text-slate-400 font-medium text-sm">
                {view === 'register' 
                  ? 'Isi data biometrik untuk memulai pemantauan AI' 
                  : 'Masuk untuk mengakses dashboard kesehatan Anda'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-[28px] flex items-center gap-4 text-xs font-black border border-red-100 animate-shake">
                <AlertCircle size={20} className="shrink-0" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-6 rounded-[28px] flex items-center gap-4 text-xs font-black border border-emerald-100">
                <CheckCircle size={20} className="shrink-0" /> {success}
              </div>
            )}

            <div className="space-y-5">
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
                <div className="space-y-5 animate-slide-up">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender('Pria')}
                      className={`py-5 rounded-[24px] font-black text-xs uppercase tracking-widest border-2 transition-all ${
                        gender === 'Pria' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'
                      }`}
                    >
                      Pria
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('Wanita')}
                      className={`py-5 rounded-[24px] font-black text-xs uppercase tracking-widest border-2 transition-all ${
                        gender === 'Wanita' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'
                      }`}
                    >
                      Wanita
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative group">
                      <input type="number" required placeholder="Umur" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-50 border-none rounded-[20px] py-5 px-4 text-center text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                      <label className="block text-[8px] text-center font-black text-slate-400 uppercase tracking-widest mt-2">Thn</label>
                    </div>
                    <div className="relative group">
                      <input type="number" required placeholder="BB" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-slate-50 border-none rounded-[20px] py-5 px-4 text-center text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                      <label className="block text-[8px] text-center font-black text-slate-400 uppercase tracking-widest mt-2">Kg</label>
                    </div>
                    <div className="relative group">
                      <input type="number" required placeholder="TB" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-slate-50 border-none rounded-[20px] py-5 px-4 text-center text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                      <label className="block text-[8px] text-center font-black text-slate-400 uppercase tracking-widest mt-2">Cm</label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 group"
            >
              {view === 'register' ? 'Daftar Sekarang' : 'Masuk Dashboard'}
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-6 text-center border-t border-slate-50">
              <button 
                type="button"
                onClick={() => {
                  setView(view === 'register' ? 'login' : 'register');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-[0.2em] transition-all"
              >
                {view === 'register' ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Buat Baru'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;