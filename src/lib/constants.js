// Election Constants for Tambon Tham-nop
// ข้อมูลการเลือกตั้งอบต.ตำบลทำนบ

export const ELECTION_CONFIG = {
  tambon: {
    name: 'ตำบลทำนบ',
    nameEn: 'Tambon Tham-nop',
  },
  totalVillages: 7,
};

// Ballot Types
export const BALLOT_TYPES = {
  MAYOR: 'mayor',
  MEMBER: 'member',
};

// Special candidate numbers for invalid/no vote
export const SPECIAL_CANDIDATES = {
  INVALID: 98, // บัตรเสีย
  NO_VOTE: 99, // ไม่ประสงค์ลงคะแนน
};

// Mayor Candidates (Pink Ballot - ใบชมพู)
// These 2 candidates compete across all 7 villages
export const MAYOR_CANDIDATES = [
  {
    number: 1,
    name: 'ABC',
    fullName: 'นาย ABC ตัวอย่าง',
    color: '#ec4899', // Pink
    photo: '/candidates/mayor-1.jpg', // Optional
  },
  {
    number: 2,
    name: 'DEF',
    fullName: 'นาง DEF ตัวอย่าง',
    color: '#8b5cf6', // Purple
    photo: '/candidates/mayor-2.jpg', // Optional
  },
  {
    number: SPECIAL_CANDIDATES.INVALID,
    name: 'บัตรเสีย',
    fullName: 'บัตรเสีย',
    color: '#6b7280',
  },
  {
    number: SPECIAL_CANDIDATES.NO_VOTE,
    name: 'ไม่ประสงค์ฯ',
    fullName: 'ไม่ประสงค์ลงคะแนน',
    color: '#9ca3af',
  },
];

// Member Candidates (Green Ballot - ใบเขียว)
// Each village has its own set of candidates
export const MEMBER_CANDIDATES = {
  1: [
    {
      number: 1,
      name: 'สมชาย',
      fullName: 'นาย สมชาย ใจดี',
      village: 1,
      color: '#10b981',
    },
    {
      number: 2,
      name: 'สมหญิง',
      fullName: 'นาง สมหญิง รักษา',
      village: 1,
      color: '#059669',
    },
    {
      number: SPECIAL_CANDIDATES.INVALID,
      name: 'บัตรเสีย',
      fullName: 'บัตรเสีย',
      village: 1,
      color: '#6b7280',
    },
    {
      number: SPECIAL_CANDIDATES.NO_VOTE,
      name: 'ไม่ประสงค์ฯ',
      fullName: 'ไม่ประสงค์ลงคะแนน',
      village: 1,
      color: '#9ca3af',
    },
  ],
  2: [
    {
      number: 1,
      name: 'วิชัย',
      fullName: 'นาย วิชัย มั่นคง',
      village: 2,
      color: '#10b981',
    },
    {
      number: 2,
      name: 'มาลี',
      fullName: 'นาง มาลี สวยงาม',
      village: 2,
      color: '#059669',
    },
    {
      number: SPECIAL_CANDIDATES.INVALID,
      name: 'บัตรเสีย',
      fullName: 'บัตรเสีย',
      village: 2,
      color: '#6b7280',
    },
    {
      number: SPECIAL_CANDIDATES.NO_VOTE,
      name: 'ไม่ประสงค์ฯ',
      fullName: 'ไม่ประสงค์ลงคะแนน',
      village: 2,
      color: '#9ca3af',
    },
  ],
  3: [
    {
      number: 1,
      name: 'ประสิทธิ์',
      fullName: 'นาย ประสิทธิ์ ทำดี',
      village: 3,
      color: '#10b981',
    },
    {
      number: 2,
      name: 'สุดา',
      fullName: 'นาง สุดา แก้วใส',
      village: 3,
      color: '#059669',
    },
    {
      number: SPECIAL_CANDIDATES.INVALID,
      name: 'บัตรเสีย',
      fullName: 'บัตรเสีย',
      village: 3,
      color: '#6b7280',
    },
    {
      number: SPECIAL_CANDIDATES.NO_VOTE,
      name: 'ไม่ประสงค์ฯ',
      fullName: 'ไม่ประสงค์ลงคะแนน',
      village: 3,
      color: '#9ca3af',
    },
  ],
  4: [
    {
      number: 1,
      name: 'บุญมี',
      fullName: 'นาย บุญมี ศรีสุข',
      village: 4,
      color: '#10b981',
    },
    {
      number: 2,
      name: 'วิไล',
      fullName: 'นาง วิไล รุ่งเรือง',
      village: 4,
      color: '#059669',
    },
    {
      number: SPECIAL_CANDIDATES.INVALID,
      name: 'บัตรเสีย',
      fullName: 'บัตรเสีย',
      village: 4,
      color: '#6b7280',
    },
    {
      number: SPECIAL_CANDIDATES.NO_VOTE,
      name: 'ไม่ประสงค์ฯ',
      fullName: 'ไม่ประสงค์ลงคะแนน',
      village: 4,
      color: '#9ca3af',
    },
  ],
  5: [
    {
      number: 1,
      name: 'สมศักดิ์',
      fullName: 'นาย สมศักดิ์ เจริญ',
      village: 5,
      color: '#10b981',
    },
    {
      number: 2,
      name: 'จันทร์',
      fullName: 'นาง จันทร์ งามสม',
      village: 5,
      color: '#059669',
    },
    {
      number: SPECIAL_CANDIDATES.INVALID,
      name: 'บัตรเสีย',
      fullName: 'บัตรเสีย',
      village: 5,
      color: '#6b7280',
    },
    {
      number: SPECIAL_CANDIDATES.NO_VOTE,
      name: 'ไม่ประสงค์ฯ',
      fullName: 'ไม่ประสงค์ลงคะแนน',
      village: 5,
      color: '#9ca3af',
    },
  ],
  6: [
    {
      number: 1,
      name: 'สุรชัย',
      fullName: 'นาย สุรชัย พัฒนา',
      village: 6,
      color: '#10b981',
    },
    {
      number: 2,
      name: 'พิมพ์',
      fullName: 'นาง พิมพ์ สดใส',
      village: 6,
      color: '#059669',
    },
    {
      number: SPECIAL_CANDIDATES.INVALID,
      name: 'บัตรเสีย',
      fullName: 'บัตรเสีย',
      village: 6,
      color: '#6b7280',
    },
    {
      number: SPECIAL_CANDIDATES.NO_VOTE,
      name: 'ไม่ประสงค์ฯ',
      fullName: 'ไม่ประสงค์ลงคะแนน',
      village: 6,
      color: '#9ca3af',
    },
  ],
  7: [
    {
      number: 1,
      name: 'ธนพล',
      fullName: 'นาย ธนพล มั่งมี',
      village: 7,
      color: '#10b981',
    },
    {
      number: 2,
      name: 'สมใจ',
      fullName: 'นาง สมใจ เย็นใจ',
      village: 7,
      color: '#059669',
    },
    {
      number: SPECIAL_CANDIDATES.INVALID,
      name: 'บัตรเสีย',
      fullName: 'บัตรเสีย',
      village: 7,
      color: '#6b7280',
    },
    {
      number: SPECIAL_CANDIDATES.NO_VOTE,
      name: 'ไม่ประสงค์ฯ',
      fullName: 'ไม่ประสงค์ลงคะแนน',
      village: 7,
      color: '#9ca3af',
    },
  ],
};

// Village Names
export const VILLAGES = [
  { number: 1, name: 'หมู่ 1', fullName: 'หมู่ที่ 1 บ้านทำนบเหนือ' },
  { number: 2, name: 'หมู่ 2', fullName: 'หมู่ที่ 2 บ้านทำนบใต้' },
  { number: 3, name: 'หมู่ 3', fullName: 'หมู่ที่ 3 บ้านเนินสูง' },
  { number: 4, name: 'หมู่ 4', fullName: 'หมู่ที่ 4 บ้านท่าข้าม' },
  { number: 5, name: 'หมู่ 5', fullName: 'หมู่ที่ 5 บ้านหนองบัว' },
  { number: 6, name: 'หมู่ 6', fullName: 'หมู่ที่ 6 บ้านดงยาง' },
  { number: 7, name: 'หมู่ 7', fullName: 'หมู่ที่ 7 บ้านคลองใหม่' },
];

// Helper functions
export const getCandidateByNumber = (ballotType, candidateNumber, villageNumber = null) => {
  if (ballotType === BALLOT_TYPES.MAYOR) {
    return MAYOR_CANDIDATES.find(c => c.number === candidateNumber);
  } else {
    return MEMBER_CANDIDATES[villageNumber]?.find(c => c.number === candidateNumber);
  }
};

export const getVillageName = (villageNumber) => {
  return VILLAGES.find(v => v.number === villageNumber);
};

export const getBallotColor = (ballotType) => {
  return ballotType === BALLOT_TYPES.MAYOR ? '#fce7f3' : '#d1fae5'; // Pink or Green tint
};

export const getBallotLabel = (ballotType) => {
  return ballotType === BALLOT_TYPES.MAYOR
    ? '🎀 ใบชมพู - นายก อบต.'
    : '🌿 ใบเขียว - สมาชิก อบต.';
};
