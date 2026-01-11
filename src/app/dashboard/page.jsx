'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllResults, subscribeToElectionResults } from '@/lib/supabase';
import {
  BALLOT_TYPES,
  MAYOR_CANDIDATES,
  MEMBER_CANDIDATES,
  VILLAGES,
  SPECIAL_CANDIDATES,
} from '@/lib/constants';

export default function DashboardPage() {
  const [results, setResults] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    // Initial load
    loadResults();

    // Subscribe to real-time updates
    const channel = subscribeToElectionResults(() => {
      loadResults();
      setLastUpdated(new Date());
    });

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadResults = async () => {
    const data = await fetchAllResults();
    const organized = organizeResults(data);
    setResults(organized);
  };

  const organizeResults = (data) => {
    const organized = {
      mayor: {},
      member: {},
    };

    data.forEach((row) => {
      const { village_number, ballot_type, candidate_number, votes } = row;

      if (ballot_type === BALLOT_TYPES.MAYOR) {
        if (!organized.mayor[candidate_number]) {
          organized.mayor[candidate_number] = 0;
        }
        organized.mayor[candidate_number] += votes;
      } else {
        if (!organized.member[village_number]) {
          organized.member[village_number] = {};
        }
        organized.member[village_number][candidate_number] = votes;
      }
    });

    return organized;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-6 shadow-2xl">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 drop-shadow-lg">
            🗳️ ผลการเลือกตั้ง
          </h1>
          <p className="text-center text-xl text-pink-100">
            นายกและสมาชิก อบต.ทำนบ
          </p>
          {lastUpdated && (
            <p className="text-center text-sm text-pink-200 mt-2">
              🔴 อัปเดตล่าสุด: {lastUpdated.toLocaleTimeString('th-TH')}
            </p>
          )}
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Mayor Section (Pink) */}
        <MayorSection results={results.mayor} />

        {/* Member Section (Green) */}
        <MemberSection results={results.member} />

        {/* Input Link */}
        <div className="pt-6 border-t border-slate-800">
          <a
            href="/input"
            className="block w-full max-w-md mx-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg"
          >
            📝 ไปหน้าผู้สังเกตการณ์
          </a>
        </div>
      </div>
    </div>
  );
}

// Mayor Results Component
function MayorSection({ results = {} }) {
  const candidates = MAYOR_CANDIDATES.filter(
    (c) => c.number !== SPECIAL_CANDIDATES.INVALID && c.number !== SPECIAL_CANDIDATES.NO_VOTE
  );

  const totalVotes = candidates.reduce((sum, c) => sum + (results[c.number] || 0), 0);
  const maxVotes = Math.max(...candidates.map((c) => results[c.number] || 0), 1);
  const leadingCandidate = candidates.reduce((prev, current) =>
    (results[current.number] || 0) > (results[prev.number] || 0) ? current : prev
  );

  const invalidVotes = results[SPECIAL_CANDIDATES.INVALID] || 0;
  const noVotes = results[SPECIAL_CANDIDATES.NO_VOTE] || 0;

  return (
    <section className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 rounded-3xl p-8 shadow-2xl border border-pink-500/20">
      <h2 className="text-3xl font-bold mb-6 text-pink-300 flex items-center gap-3">
        🎀 นายก อบต. (ใบชมพู)
      </h2>

      <div className="space-y-6">
        {candidates.map((candidate) => {
          const votes = results[candidate.number] || 0;
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          const isLeading = candidate.number === leadingCandidate.number && votes > 0;

          return (
            <motion.div
              key={candidate.number}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/80 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-white bg-pink-600 rounded-2xl px-6 py-3 shadow-lg">
                    {candidate.number}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {candidate.name}
                    </h3>
                    <p className="text-slate-400">{candidate.fullName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <AnimatedCounter value={votes} />
                  <div className="text-slate-400 text-sm mt-1">
                    {percentage.toFixed(1)}%
                  </div>
                  {isLeading && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-yellow-400 text-sm font-bold mt-1"
                    >
                      👑 นำ
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-end px-4"
                >
                  {votes > 0 && (
                    <span className="text-white font-bold text-sm">
                      {votes}
                    </span>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Special Votes */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
          <div className="text-slate-400">บัตรเสีย</div>
          <div className="text-2xl font-bold text-red-400">{invalidVotes}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
          <div className="text-slate-400">ไม่ประสงค์ฯ</div>
          <div className="text-2xl font-bold text-gray-400">{noVotes}</div>
        </div>
      </div>

      <div className="mt-4 text-center text-slate-400">
        รวมคะแนนทั้งหมด: <span className="text-white font-bold">{totalVotes}</span>
      </div>
    </section>
  );
}

// Member Results Component
function MemberSection({ results = {} }) {
  return (
    <section className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-3xl p-8 shadow-2xl border border-green-500/20">
      <h2 className="text-3xl font-bold mb-6 text-green-300 flex items-center gap-3">
        🌿 สมาชิก อบต. (ใบเขียว)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {VILLAGES.map((village) => (
          <VillageCard
            key={village.number}
            village={village}
            results={results[village.number] || {}}
          />
        ))}
      </div>
    </section>
  );
}

// Village Card Component
function VillageCard({ village, results = {} }) {
  const candidates = MEMBER_CANDIDATES[village.number].filter(
    (c) => c.number !== SPECIAL_CANDIDATES.INVALID && c.number !== SPECIAL_CANDIDATES.NO_VOTE
  );

  const totalVotes = candidates.reduce((sum, c) => sum + (results[c.number] || 0), 0);
  const maxVotes = Math.max(...candidates.map((c) => results[c.number] || 0), 1);

  const invalidVotes = results[SPECIAL_CANDIDATES.INVALID] || 0;
  const noVotes = results[SPECIAL_CANDIDATES.NO_VOTE] || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800/80 rounded-2xl p-6 backdrop-blur-sm border border-green-500/20"
    >
      <h3 className="text-xl font-bold text-green-300 mb-4 text-center">
        {village.name}
      </h3>
      <p className="text-slate-400 text-sm text-center mb-4">
        {village.fullName}
      </p>

      <div className="space-y-4">
        {candidates.map((candidate) => {
          const votes = results[candidate.number] || 0;
          const percentage = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
          const isLeading = votes === maxVotes && votes > 0;

          return (
            <div key={candidate.number} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white bg-green-600 rounded-lg px-3 py-1">
                    {candidate.number}
                  </span>
                  <div>
                    <div className="font-semibold text-white">
                      {candidate.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-yellow-400">
                    {votes}
                  </div>
                  {isLeading && votes > 0 && (
                    <div className="text-yellow-400 text-xs">👑</div>
                  )}
                </div>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-2 text-xs">
        <div className="text-center">
          <div className="text-slate-500">บัตรเสีย</div>
          <div className="font-bold text-red-400">{invalidVotes}</div>
        </div>
        <div className="text-center">
          <div className="text-slate-500">ไม่ประสงค์ฯ</div>
          <div className="font-bold text-gray-400">{noVotes}</div>
        </div>
      </div>

      <div className="mt-2 text-center text-slate-400 text-sm">
        รวม: <span className="text-white font-bold">{totalVotes}</span> คะแนน
      </div>
    </motion.div>
  );
}

// Animated Counter Component
function AnimatedCounter({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = (value - displayValue) / steps;
    let current = displayValue;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;

      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      key={value}
      initial={{ scale: 1.2, color: '#fbbf24' }}
      animate={{ scale: 1, color: '#ffffff' }}
      className="text-5xl font-bold"
    >
      {displayValue}
    </motion.div>
  );
}
