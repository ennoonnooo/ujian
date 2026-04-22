import React, { useState, useEffect } from 'react';
import { useDB } from '../../App';
import { EXAM_QUESTIONS, KKM_VALUE } from '../../constants';
import { Question } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function UjianOnline() {
  const { currentUser, submitExam, examResults } = useDB();
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isFinished, setIsFinished] = useState(false);

  const major = currentUser?.major || 'TKJ';
  const questions = EXAM_QUESTIONS[major];

  // Check if already taken
  const pastResult = examResults.find(r => r.studentId === currentUser?.id && r.major === major);

  useEffect(() => {
    if (examStarted && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
  }, [examStarted, timeLeft, isFinished]);

  const handleSelectOption = (optionIdx: number) => {
    setUserAnswers({ ...userAnswers, [questions[currentQuestionIdx].id]: optionIdx });
  };

  const handleFinish = () => {
    const score = questions.reduce((acc, q) => {
      return userAnswers[q.id] === q.correctAnswer ? acc + (100 / questions.length) : acc;
    }, 0);
    
    submitExam({
      studentId: currentUser!.id,
      major: major,
      score: Math.round(score),
      date: new Date().toISOString(),
      answers: questions.map(q => userAnswers[q.id] ?? -1)
    });
    setIsFinished(true);
    setExamStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (pastResult && !isFinished) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 pt-12">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-gray-900">Ujian Telah Selesai</h2>
          <p className="text-gray-500 text-lg">Kamu telah menyelesaikan ujian untuk jurusan {major}. Berikut adalah hasilnya:</p>
        </div>
        <div className="p-12 glass-card border-none bg-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Nilai Akhir</p>
            <p className={`text-8xl font-black ${pastResult.score >= KKM_VALUE ? 'text-green-500' : 'text-red-500'}`}>
              {pastResult.score}
            </p>
            <div className="mt-8 inline-block px-6 py-2 rounded-full bg-gray-100 font-bold text-gray-600">
              KKM: {KKM_VALUE} • Status: {pastResult.score >= KKM_VALUE ? 'LULUS' : 'REMIDI'}
            </div>
          </div>
          <Trophy size={150} className="absolute -right-10 -bottom-10 text-primary opacity-5 rotate-12" />
        </div>
      </div>
    );
  }

  if (isFinished) {
    const currentResult = examResults[examResults.length - 1];
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center space-y-8 pt-12">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-gray-900">Hasil Ujian Kamu</h2>
        <div className="p-12 glass-card bg-primary text-white border-none shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Skor Kamu</p>
          <p className="text-9xl font-black">{currentResult.score}</p>
          <p className="mt-6 font-bold text-xl">{currentResult.score >= KKM_VALUE ? '🔥 Kerja Bagus!' : '📚 Belajarlah Lagi!'}</p>
        </div>
        <button onClick={() => window.location.reload()} className="btn-primary py-4 px-12 text-lg">Kembali Ke Beranda</button>
      </motion.div>
    );
  }

  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="p-12 glass-card bg-white border-none shadow-2xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900">Ujian Kompetensi Keahlian</h2>
            <div className="flex items-center gap-2 text-primary font-bold">
              <CheckCircle2 size={20} />
              <span className="uppercase tracking-widest text-sm">Jurusan {major}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-gray-100">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-primary"><Clock /></div>
              <div>
                <p className="font-bold">Durasi Ujian</p>
                <p className="text-sm text-gray-400">30 Menit • Waktu berjalan mundur</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-primary"><FileText /></div>
              <div>
                <p className="font-bold">Jumlah Soal</p>
                <p className="text-sm text-gray-400">{questions.length} Soal Pilihan Ganda</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex gap-4 text-orange-800">
            <AlertCircle className="flex-shrink-0" />
            <p className="text-sm font-medium">Pastikan koneksi internet stabil. Ujian hanya dapat dilakukan satu kali. Menutup halaman akan mengakhiri ujian secara otomatis.</p>
          </div>

          <button onClick={() => setExamStarted(true)} className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3">
            Mulai Ujian Sekarang <Play size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestionIdx];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Exam Header */}
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-sm py-4 z-20">
        <div className="space-y-1">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Progress</p>
          <div className="flex items-center gap-4">
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}></div>
            </div>
            <span className="font-black text-sm">{Object.keys(userAnswers).length} / {questions.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xl shadow-lg ${timeLeft < 300 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-900 border border-gray-100'}`}>
            <Clock />
            {formatTime(timeLeft)}
          </div>
          <button onClick={handleFinish} className="bg-red-50 text-red-500 px-6 py-3 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all">Selesai</button>
        </div>
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestionIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card border-none bg-white shadow-2xl p-10 md:p-16 relative overflow-hidden"
        >
          <div className="space-y-10 relative z-10">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 bg-orange-50 text-primary text-xs font-black rounded-lg uppercase tracking-widest">
                Soal Nomor {currentQuestionIdx + 1} • {q.difficulty}
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {q.text}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`p-6 rounded-3xl border-2 text-left transition-all group flex items-start gap-4 ${userAnswers[q.id] === i ? 'border-primary bg-orange-50 shadow-lg shadow-orange-500/10' : 'border-gray-100 bg-white hover:border-orange-200'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 transition-all ${userAnswers[q.id] === i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-primary'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className={`font-bold py-1 ${userAnswers[q.id] === i ? 'text-primary' : 'text-gray-600'}`}>{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-10 border-t border-gray-100">
              <button 
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(idx => idx - 1)}
                className="flex items-center gap-2 font-bold text-gray-400 disabled:opacity-0"
              >
                <ArrowLeft size={20} /> Sebelumnya
              </button>
              
              {currentQuestionIdx < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQuestionIdx(idx => idx + 1)}
                  className="btn-primary flex items-center gap-2"
                >
                  Berikutnya <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleFinish}
                  className="btn-primary bg-green-500 hover:bg-green-600 px-12"
                >
                  Selesai Ujian
                </button>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 h-full flex items-center opacity-[0.02]">
            <span className="text-[20rem] font-black">{currentQuestionIdx + 1}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Grid (Quick Jump) */}
      <div className="mt-12 p-8 glass-card border-none bg-white shadow-lg">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Navigasi Soal</p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {questions.map((q, i) => (
            <button 
              key={i}
              onClick={() => setCurrentQuestionIdx(i)}
              className={`h-12 rounded-xl font-black text-sm transition-all ${currentQuestionIdx === i ? 'ring-4 ring-primary ring-offset-2' : ''} ${userAnswers[q.id] !== undefined ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-orange-50'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
