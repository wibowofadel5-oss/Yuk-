
import React, { useState, useCallback } from 'react';
import { AppState, Level, Subject, Question, QuizSession } from './types';
import { LEVELS, SUBJECT_CATEGORIES } from './constants';
import { generateQuizQuestions } from './services/geminiService';

// Components
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">Sreak<span className="text-indigo-600">Kuis</span></span>
      </div>
      <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
        <a href="#" className="hover:text-indigo-600 transition">Tentang Kami</a>
        <a href="#" className="hover:text-indigo-600 transition">Panduan</a>
        <a href="#" className="hover:text-indigo-600 transition">Kontak</a>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('HOME');
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSetup = () => setView('SELECTOR');

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleSelectSubject = async (subject: Subject) => {
    if (!selectedLevel) return;
    
    setSelectedSubject(subject);
    setLoading(true);
    setError(null);

    try {
      const questions = await generateQuizQuestions(selectedLevel, subject);
      setSession({
        level: selectedLevel,
        subject,
        questions,
        currentIdx: 0,
        score: 0,
        answers: []
      });
      setView('QUIZ');
    } catch (err) {
      setError("Gagal memuat kuis. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (!session) return;

    const isCorrect = index === session.questions[session.currentIdx].correctAnswer;
    const newScore = isCorrect ? session.score + 1 : session.score;
    const newIdx = session.currentIdx + 1;

    setSession({
      ...session,
      score: newScore,
      currentIdx: newIdx,
      answers: [...session.answers, index]
    });

    if (newIdx >= session.questions.length) {
      setView('RESULT');
    }
  };

  const resetQuiz = () => {
    setView('HOME');
    setSelectedLevel(null);
    setSelectedSubject(null);
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        {view === 'HOME' && (
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Belajar Jadi Seru dengan <br/>
                <span className="text-indigo-600">Sreak Kuis AI</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Platform kuis interaktif yang ditenagai AI untuk membantu siswa Indonesia 
                menguasai pelajaran umum dan agama dengan cara yang menyenangkan.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button 
                onClick={startSetup}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition transform active:scale-95 text-lg"
              >
                Mulai Belajar Sekarang
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition text-lg">
                Lihat Demo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
              {[
                { label: 'AI Generated', icon: '🤖' },
                { label: 'Update Kurikulum', icon: '📚' },
                { label: 'Cakupan Luas', icon: '🌍' },
                { label: 'Akses Gratis', icon: '💎' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'SELECTOR' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
            {!selectedLevel ? (
              <section className="space-y-6">
                <h2 className="text-3xl font-bold text-center">Pilih Jenjang Pendidikan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => handleSelectLevel(level.id)}
                      className="group bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all text-center space-y-4"
                    >
                      <div className={`w-16 h-16 ${level.color} rounded-2xl mx-auto flex items-center justify-center text-3xl group-hover:scale-110 transition`}>
                        {level.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">{level.label}</h3>
                        <p className="text-sm text-gray-500">Materi kuis disesuaikan</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <button onClick={() => setSelectedLevel(null)} className="text-indigo-600 hover:text-indigo-800 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Kembali
                  </button>
                  <h2 className="text-2xl font-bold">Pilih Mata Pelajaran <span className="text-indigo-600">({selectedLevel})</span></h2>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium animate-pulse">Menyiapkan kuis cerdas untukmu...</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {SUBJECT_CATEGORIES.map((cat, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wider">{cat.title}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {cat.subjects.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => handleSelectSubject(sub)}
                              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition text-left h-full"
                            >
                              <div className="font-bold text-gray-800 leading-tight">{sub}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {error && <p className="text-red-500 text-center font-medium bg-red-50 p-4 rounded-xl">{error}</p>}
              </section>
            )}
          </div>
        )}

        {view === 'QUIZ' && session && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{session.subject} - {session.level}</h2>
                <h3 className="text-xl font-bold text-gray-900">Pertanyaan {session.currentIdx + 1} dari {session.questions.length}</h3>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-gray-400 uppercase">Skor Saat Ini</div>
                <div className="text-2xl font-bold text-green-600">{session.score * 10}</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-10">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((session.currentIdx) / session.questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 space-y-10">
              <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                {session.questions[session.currentIdx].question}
              </p>

              <div className="grid grid-cols-1 gap-4">
                {session.questions[session.currentIdx].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="flex items-center w-full p-5 text-left bg-gray-50 border border-gray-200 rounded-2xl hover:bg-indigo-50 hover:border-indigo-300 group transition active:scale-[0.98]"
                  >
                    <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 rounded-xl mr-4 font-bold text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg font-medium text-gray-700 group-hover:text-indigo-900 transition">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'RESULT' && session && (
          <div className="max-w-2xl mx-auto text-center space-y-12 animate-bounceIn">
            <div className="space-y-4">
              <div className="inline-block p-4 bg-yellow-100 rounded-full text-5xl mb-4 animate-bounce">🏆</div>
              <h2 className="text-4xl font-extrabold text-gray-900">Kuis Selesai!</h2>
              <p className="text-gray-600 text-lg">Luar biasa, kamu telah menyelesaikan kuis <b>{session.subject}</b> tingkat <b>{session.level}</b>.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-indigo-100 flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-gray-100"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="80"
                    cx="96"
                    cy="96"
                  />
                  <circle
                    className="text-indigo-600"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - session.score / session.questions.length)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="80"
                    cx="96"
                    cy="96"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-indigo-600 leading-none">{Math.round((session.score / session.questions.length) * 100)}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Skor Kamu</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full border-t border-gray-50 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{session.score}</div>
                  <div className="text-sm text-gray-500 font-medium">Benar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{session.questions.length - session.score}</div>
                  <div className="text-sm text-gray-500 font-medium">Salah</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
              <button 
                onClick={resetQuiz}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
              >
                Kembali ke Beranda
              </button>
              <button 
                onClick={() => handleSelectSubject(session.subject)}
                className="px-10 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition"
              >
                Coba Lagi
              </button>
            </div>
            
            <div className="text-left space-y-6 pt-12 border-t border-gray-200">
               <h3 className="text-2xl font-bold text-gray-900">Tinjauan Kuis</h3>
               <div className="space-y-4">
                 {session.questions.map((q, idx) => (
                   <div key={idx} className={`p-6 rounded-2xl border ${session.answers[idx] === q.correctAnswer ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                      <p className="font-bold text-gray-800 mb-2">{idx + 1}. {q.question}</p>
                      <div className="text-sm space-y-1">
                        <p><span className="font-semibold">Jawaban Kamu:</span> {q.options[session.answers[idx]]}</p>
                        <p><span className="font-semibold">Jawaban Benar:</span> {q.options[q.correctAnswer]}</p>
                        <p className="mt-2 text-gray-600 italic">💡 {q.explanation}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Sreak<span className="text-indigo-600">Kuis</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 Sreak Kuis AI. Semua Hak Dilindungi.</p>
          <div className="flex space-x-6 text-gray-400">
             {['Facebook', 'Twitter', 'Instagram'].map(social => (
               <a key={social} href="#" className="hover:text-indigo-600 transition text-sm font-medium">{social}</a>
             ))}
          </div>
        </div>
      </footer>

      {/* Tailwind Utility Additions for specific animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
