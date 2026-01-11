# 🗳️ Real-time Election Dashboard - อบต.ทำนบ

ระบบแสดงผลการเลือกตั้งแบบเรียลไทม์สำหรับนายกและสมาชิก อบต.ตำบลทำนบ

## ✨ Features

- 📊 **Live Dashboard** - แสดงผลสรุปคะแนนแบบเรียลไทม์พร้อม animations
- 📝 **Observer Input** - หน้าสำหรับผู้สังเกตการณ์บันทึกคะแนน (Mobile-First)
- 🎀 **Pink Ballot** - เลือกนายก อบต. (2 ผู้สมัคร)
- 🌿 **Green Ballot** - เลือกสมาชิก อบต. (7 หมู่บ้าน, หมู่ละ 2 ผู้สมัคร)
- ⚡ **Real-time Updates** - ใช้ Supabase Realtime
- 🎨 **Smooth Animations** - ใช้ Framer Motion

## 🛠️ Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (Database + Realtime)
- **Framer Motion** (Animations)

## 📁 Project Structure

```
elec-display/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page with navigation
│   │   ├── dashboard/
│   │   │   └── page.jsx      # Live Dashboard (Main Display)
│   │   └── input/
│   │       └── page.jsx      # Observer Input Page (Mobile)
│   └── lib/
│       ├── constants.js      # Election constants & candidates
│       └── supabase.js       # Supabase client & helpers
├── supabase/
│   └── schema.sql            # Database schema
└── .env                      # Environment variables
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account ([Create free account](https://supabase.com))

### 2. Setup Supabase

1. Create a new project on [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Enable Realtime:
   ```sql
   alter publication supabase_realtime add table election_results;
   ```
4. Get your API credentials from **Settings > API**

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

### Home Page (`/`)
- Navigation hub with links to Dashboard and Input pages
- Overview of election information

### Dashboard (`/dashboard`)
- **Target:** Large display (TV, projector) for election night viewing
- **Features:**
  - Live updates with smooth animations
  - Mayor results with comparison bars
  - Member results grid (7 village cards)
  - Counter animations when votes change
  - Leading candidate badges

### Observer Input (`/input`)
- **Target:** Mobile devices for observers at polling stations
- **Features:**
  - Village selector dropdown
  - Ballot type toggle (Pink/Green)
  - Large tap-friendly buttons (+1, +5, +10)
  - Haptic feedback (on supported devices)
  - Real-time vote display
  - Quick navigation to Dashboard

## 🗳️ Election Data Structure

### Mayor (Pink Ballot)
- 2 candidates competing across all 7 villages
- Candidate #1: ABC
- Candidate #2: DEF

### Member (Green Ballot)
- Each of 7 villages has 2 local candidates
- 14 candidates total

### Special Votes
- **Invalid Ballots** (บัตรเสีย) - Candidate #98
- **No Vote** (ไม่ประสงค์ลงคะแนน) - Candidate #99

### Villages
1. หมู่ 1 - บ้านทำนบเหนือ
2. หมู่ 2 - บ้านทำนบใต้
3. หมู่ 3 - บ้านเนินสูง
4. หมู่ 4 - บ้านท่าข้าม
5. หมู่ 5 - บ้านหนองบัว
6. หมู่ 6 - บ้านดงยาง
7. หมู่ 7 - บ้านคลองใหม่

## 🔧 Customization

### Update Candidate Names

Edit `src/lib/constants.js`:

```javascript
export const MAYOR_CANDIDATES = [
  { number: 1, name: 'Your Candidate 1', fullName: 'นาย ...', ... },
  { number: 2, name: 'Your Candidate 2', fullName: 'นาง ...', ... },
];

export const MEMBER_CANDIDATES = {
  1: [
    { number: 1, name: 'Village 1 Candidate 1', ... },
    // ...
  ],
  // ...
};
```

### Update Village Names

Edit the `VILLAGES` array in `src/lib/constants.js`.

### Reset All Votes

For testing purposes, you can reset all votes to zero:

```sql
SELECT reset_all_votes();
```

Or use the Supabase SQL Editor:
```sql
DELETE FROM election_results;
-- Then re-run the seed data from schema.sql
```

## 📊 Database Schema

The `election_results` table structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| village_number | INT | Village number (1-7) |
| ballot_type | VARCHAR | 'mayor' or 'member' |
| candidate_number | INT | Candidate number |
| votes | INT | Current vote count |
| updated_at | TIMESTAMP | Last update time |

## 🎨 Color Scheme

- **Mayor (Pink):** Pink/Purple gradients
- **Member (Green):** Green/Emerald gradients
- **Dark Theme:** Slate backgrounds for high contrast
- **Leading Indicators:** Yellow/Gold for leading candidates

## 🔐 Security Notes

This is a demo/prototype system with **public read/write access** enabled for simplicity.

For production use:
1. Implement proper authentication
2. Add Row Level Security (RLS) policies
3. Create separate roles for observers and viewers
4. Add audit logging
5. Consider adding vote increment limits

## 🐛 Troubleshooting

### Real-time not working?
- Check that you ran: `alter publication supabase_realtime add table election_results;`
- Verify your Supabase URL and keys in `.env`
- Check browser console for connection errors

### Votes not updating?
- Verify the seed data was inserted correctly
- Check Supabase Table Editor for data
- Look for errors in browser console

### Styles not loading?
- Clear Next.js cache: `rm -rf .next`
- Restart dev server

## 📝 License

This project is for demonstration and educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and adapt this project for your own elections or events!

---

Built with ❤️ using Next.js, Tailwind CSS, Supabase, and Framer Motion
# elec-display
# elec-display
