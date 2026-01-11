'use client';

import { useState, useEffect, useRef } from 'react';
import { incrementVote, fetchAllResults } from '@/lib/supabase';
import {
  BALLOT_TYPES,
  MAYOR_CANDIDATES,
  MEMBER_CANDIDATES,
  VILLAGES,
  getBallotLabel,
  getCandidateByNumber,
} from '@/lib/constants';

export default function ObserverInputPage() {
  const [selectedVillage, setSelectedVillage] = useState(1);
  const [ballotType, setBallotType] = useState(BALLOT_TYPES.MAYOR);
  const [lastUpdate, setLastUpdate] = useState('');
  const [lastIncrement, setLastIncrement] = useState(1); // Track if last action was add or remove
  const [currentVotes, setCurrentVotes] = useState({});
  const [pendingUpdates, setPendingUpdates] = useState({}); // Track pending updates per candidate

  // Queue system: { villageNumber-ballotType-candidateNumber: count }
  const updateQueueRef = useRef({});
  const isProcessingRef = useRef(false);

  // Fetch current votes on mount and when village/ballot changes
  useEffect(() => {
    loadCurrentVotes();
  }, [selectedVillage, ballotType]);

  // Process queue every 1 second
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isProcessingRef.current) return; // Skip if already processing

      const queue = updateQueueRef.current;
      const keys = Object.keys(queue);

      if (keys.length > 0) {
        isProcessingRef.current = true;

        // Process first item in queue
        const key = keys[0];
        const increment = queue[key];
        const [village, ballot, candidate] = key.split('-');

        try {
          await incrementVote(
            parseInt(village),
            ballot,
            parseInt(candidate),
            increment
          );

          // Remove from queue after successful update
          delete updateQueueRef.current[key];

          // Update pending display
          setPendingUpdates((prev) => {
            const newPending = { ...prev };
            delete newPending[key];
            return newPending;
          });

          // Reload votes to show updated count
          await loadCurrentVotes();
        } catch (error) {
          console.error('Error processing queue:', error);
          // Keep in queue to retry
        } finally {
          isProcessingRef.current = false;
        }
      }
    }, 1000); // Process every 1 second

    return () => clearInterval(interval);
  }, []);

  const loadCurrentVotes = async () => {
    try {
      const allResults = await fetchAllResults();
      const votesMap = {};
      allResults.forEach((result) => {
        const key = `${result.village_number}-${result.ballot_type}-${result.candidate_number}`;
        votesMap[key] = result.votes;
      });
      setCurrentVotes(votesMap);
    } catch (error) {
      console.error('Error loading votes:', error);
    }
  };

  const handleIncrement = (candidateNumber, increment = 1) => {
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    const key = `${selectedVillage}-${ballotType}-${candidateNumber}`;

    // Add to queue
    if (updateQueueRef.current[key]) {
      updateQueueRef.current[key] += increment;
    } else {
      updateQueueRef.current[key] = increment;
    }

    // Update pending display (this will trigger re-render)
    setPendingUpdates((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + increment,
    }));

    // Show feedback message
    const candidateName = getCandidateByNumber(ballotType, candidateNumber, selectedVillage)?.name || candidateNumber;
    const sign = increment > 0 ? '+' : '';
    const emoji = increment > 0 ? '✅' : '⚠️';
    setLastUpdate(`${emoji} ${sign}${increment} คะแนน → ${candidateName}`);
    setLastIncrement(increment); // Store for toast color

    // Clear message after 2 seconds
    setTimeout(() => setLastUpdate(''), 2000);
  };

  const candidates =
    ballotType === BALLOT_TYPES.MAYOR
      ? MAYOR_CANDIDATES
      : MEMBER_CANDIDATES[selectedVillage];

  const getVoteKey = (candidateNumber) => {
    return `${selectedVillage}-${ballotType}-${candidateNumber}`;
  };

  const totalPending = Object.keys(pendingUpdates).reduce((sum, key) => sum + (pendingUpdates[key] || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Toast Notification - Floating */}
      {lastUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 text-white px-6 py-3 rounded-full shadow-2xl font-semibold ${
            lastIncrement > 0
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-red-500 to-orange-500'
          }`}
        >
          {lastUpdate}
        </motion.div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-1">
          📝 ผู้สังเกตการณ์
        </h1>
        <p className="text-center text-pink-100 text-sm">
          การเลือกตั้ง อบต.ทำนบ
        </p>
        {totalPending > 0 && (
          <div className="mt-3 text-center">
            <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
              ⏳ กำลังส่งข้อมูล... ({totalPending} รายการ)
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Village Selector */}
        <div className="bg-slate-800 rounded-2xl p-4 shadow-xl">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            🏘️ เลือกหมู่บ้านที่สังเกตการณ์
          </label>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(Number(e.target.value))}
            className="w-full p-4 text-lg font-semibold bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:ring-4 focus:ring-pink-500 focus:border-pink-500 transition-all"
          >
            {VILLAGES.map((village) => (
              <option key={village.number} value={village.number}>
                {village.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Ballot Type Toggle */}
        <div className="bg-slate-800 rounded-2xl p-4 shadow-xl">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            🗳️ ประเภทบัตรเลือกตั้ง
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBallotType(BALLOT_TYPES.MAYOR)}
              className={`p-4 rounded-xl font-semibold text-base transition-all transform active:scale-95 ${
                ballotType === BALLOT_TYPES.MAYOR
                  ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              🎀 ใบชมพู
              <div className="text-xs mt-1">นายก อบต.</div>
            </button>
            <button
              onClick={() => setBallotType(BALLOT_TYPES.MEMBER)}
              className={`p-4 rounded-xl font-semibold text-base transition-all transform active:scale-95 ${
                ballotType === BALLOT_TYPES.MEMBER
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-105'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              🌿 ใบเขียว
              <div className="text-xs mt-1">สมาชิก อบต.</div>
            </button>
          </div>
        </div>

        {/* Candidates Voting Buttons */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-300 px-2">
            {getBallotLabel(ballotType)}
            {ballotType === BALLOT_TYPES.MEMBER && (
              <span className="text-sm text-slate-400 ml-2">
                ({VILLAGES.find((v) => v.number === selectedVillage)?.name})
              </span>
            )}
          </h2>

          {candidates?.map((candidate) => {
            const voteKey = getVoteKey(candidate.number);
            const currentVoteCount = currentVotes[voteKey] || 0;
            const pendingCount = pendingUpdates[voteKey] || 0;

            return (
              <div
                key={candidate.number}
                className="bg-slate-800 rounded-2xl p-5 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-white bg-slate-700 rounded-xl px-4 py-2">
                        {candidate.number < 90 ? candidate.number : ''}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {candidate.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">
                      {currentVoteCount}
                    </div>
                    {pendingCount > 0 && (
                      <div className="text-sm text-orange-400 animate-pulse">
                        +{pendingCount} รอส่ง
                      </div>
                    )}
                    <div className="text-xs text-slate-400">คะแนน</div>
                  </div>
                </div>

                {/* Vote Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleIncrement(candidate.number, -1)}
                    className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg"
                  >
                    <div className="text-2xl">-1</div>
                  </button>
                  <button
                    onClick={() => handleIncrement(candidate.number, 1)}
                    className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg"
                  >
                    <div className="text-2xl">+1</div>
                  </button>
                  <button
                    onClick={() => handleIncrement(candidate.number, 5)}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg"
                  >
                    <div className="text-2xl">+5</div>
                  </button>
                  <button
                    onClick={() => handleIncrement(candidate.number, 10)}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg"
                  >
                    <div className="text-2xl">+10</div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard Link */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <a
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg"
          >
            📊 ดู Dashboard สรุปผล
          </a>
        </div>
      </div>
    </div>
  );
}
