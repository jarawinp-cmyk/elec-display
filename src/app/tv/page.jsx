'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAllResults, subscribeToElectionResults } from '@/lib/supabase';
import {
  BALLOT_TYPES,
  MAYOR_CANDIDATES,
  MEMBER_CANDIDATES,
  VILLAGES,
  SPECIAL_CANDIDATES,
} from '@/lib/constants';

export default function TVDisplayPage() {
  const [results, setResults] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadResults();

    const channel = subscribeToElectionResults(() => {
      loadResults();
      setLastUpdated(new Date());
    });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Header - Compact */}
      <header className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 py-3 px-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold drop-shadow-lg flex items-center gap-3">
              🗳️ ผลการเลือกตั้ง อบต.ทำนบ
            </h1>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <div className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                <span className="text-sm font-semibold">LIVE</span>
              </div>
              <p className="text-xs text-pink-100 mt-1">
                {lastUpdated.toLocaleTimeString('th-TH')}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Left: Mayor Section */}
        <MayorSectionTV results={results.mayor} />

        {/* Right: Member Section */}
        <MemberSectionTV results={results.member} />
      </div>
    </div>
  );
}

// TV Mayor Section - Left Side
function MayorSectionTV({ results = {} }) {
  const candidates = MAYOR_CANDIDATES.filter(
    (c) => c.number !== SPECIAL_CANDIDATES.INVALID && c.number !== SPECIAL_CANDIDATES.NO_VOTE
  );

  const totalVotes = candidates.reduce((sum, c) => sum + (results[c.number] || 0), 0);
  const leadingCandidate = candidates.reduce((prev, current) =>
    (results[current.number] || 0) > (results[prev.number] || 0) ? current : prev
  );

  const invalidVotes = results[SPECIAL_CANDIDATES.INVALID] || 0;
  const noVotes = results[SPECIAL_CANDIDATES.NO_VOTE] || 0;

  return (
    <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-3xl p-6 shadow-2xl border border-pink-500/20 flex flex-col h-full">
      <h2 className="text-3xl font-bold mb-4 text-pink-300 flex items-center gap-3">
        🎀 นายก อบต.
      </h2>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        {candidates.map((candidate) => {
          const votes = results[candidate.number] || 0;
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          const isLeading = candidate.number === leadingCandidate.number && votes > 0;

          return (
            <motion.div
              key={candidate.number}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {/* Candidate Card */}
              <div className="bg-slate-800/90 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl font-bold text-white bg-pink-600 rounded-2xl px-6 py-4 shadow-xl">
                      {candidate.number}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">
                        {candidate.name}
                      </h3>
                      <p className="text-lg text-slate-400">{candidate.fullName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <AnimatedCounter value={votes} className="text-7xl font-bold text-yellow-400" />
                    <div className="text-slate-400 text-xl mt-2">
                      {percentage.toFixed(1)}%
                    </div>
                    {isLeading && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-yellow-400 text-xl font-bold mt-2"
                      >
                        👑 นำคะแนน
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="text-slate-400 text-sm">รวมทั้งหมด</div>
          <div className="text-3xl font-bold text-white">{totalVotes}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="text-slate-400 text-sm">บัตรเสีย</div>
          <div className="text-2xl font-bold text-red-400">{invalidVotes}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="text-slate-400 text-sm">ไม่ประสงค์ฯ</div>
          <div className="text-2xl font-bold text-gray-400">{noVotes}</div>
        </div>
      </div>
    </div>
  );
}

// TV Member Section - Right Side (7 villages in grid)
function MemberSectionTV({ results = {} }) {
  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-3xl p-6 shadow-2xl border border-green-500/20 flex flex-col h-full">
      <h2 className="text-3xl font-bold mb-4 text-green-300 flex items-center gap-3">
        🌿 สมาชิก อบต.
      </h2>

      {/* 7 Villages Grid - Compact */}
      <div className="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
        {VILLAGES.map((village) => (
          <VillageCardTV
            key={village.number}
            village={village}
            results={results[village.number] || {}}
          />
        ))}
      </div>
    </div>
  );
}

// Compact Village Card for TV
function VillageCardTV({ village, results = {} }) {
  const candidates = MEMBER_CANDIDATES[village.number].filter(
    (c) => c.number !== SPECIAL_CANDIDATES.INVALID && c.number !== SPECIAL_CANDIDATES.NO_VOTE
  );

  const totalVotes = candidates.reduce((sum, c) => sum + (results[c.number] || 0), 0);
  const maxVotes = Math.max(...candidates.map((c) => results[c.number] || 0), 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/80 rounded-xl p-3 backdrop-blur-sm border border-green-500/20 flex flex-col"
    >
      <h3 className="text-lg font-bold text-green-300 mb-2 text-center">
        {village.name}
      </h3>

      <div className="space-y-2 flex-1">
        {candidates.map((candidate) => {
          const votes = results[candidate.number] || 0;
          const percentage = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
          const isLeading = votes === maxVotes && votes > 0;

          return (
            <div key={candidate.number} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white bg-green-600 rounded-lg px-2 py-1">
                    {candidate.number}
                  </span>
                  <div className="font-semibold text-white text-sm">
                    {candidate.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-yellow-400">
                    {votes}
                  </div>
                  {isLeading && votes > 0 && (
                    <div className="text-yellow-400 text-xs">👑</div>
                  )}
                </div>
              </div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
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

      <div className="mt-2 pt-2 border-t border-slate-700 text-center text-xs text-slate-400">
        รวม: <span className="text-white font-bold">{totalVotes}</span> คะแนน
      </div>
    </motion.div>
  );
}

// Animated Counter Component
function AnimatedCounter({ value, className = "text-5xl font-bold" }) {
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
      className={className}
    >
      {displayValue}
    </motion.div>
  );
}
