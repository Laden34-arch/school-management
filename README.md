# Ghana School Management (Full-stack)

This project scaffolds a full-stack Ghanaian school management web app.

## Backend (Node.js + Express + Postgres + Prisma)

### Setup

1. `cd backend`
2. `npm install`
3. configure `backend/.env` with proper `DATABASE_URL`, `JWT_SECRET`, `PORT`
4. `npx prisma generate`
5. `npx prisma migrate dev --name init`
6. `node prisma/seed.js`
7. `npm run dev`

### API Endpoints

- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login and get JWT
- `GET /api/status` - health check
- `POST /api/students` - create student (ADMIN, HEADTEACHER, TEACHER)
- `GET /api/students` - list students
- `GET /api/students/:id` - get student details
- `POST /api/assessments` - record CA+exam, compute grade
- `GET /api/assessments/:studentId` - list assessments
- `POST /api/attendance` - record attendance
- `GET /api/attendance/:studentId` - attendance history
- `POST /api/fees` - record fee payment
- `GET /api/fees/:studentId` - payment history
- `GET /api/reportcards/:studentId?term=TERM_1` - report card data
- `GET /api/timetable` - list timetable entries
- `POST /api/timetable` - create timetable entry
- `GET /api/announcements` - list announcements
- `POST /api/announcements` - create announcement
- `POST /api/sms/send` - send SMS (stub + log)
- `GET /api/sms/history` - SMS history

### Grading logic

- 80–100: Grade 1 (Excellent)
- 70–79: Grade 2 (Very Good)
- 60–69: Grade 3 (Good)
- 50–59: Grade 4 (Credit)
- 45–49: Grade 5 (Pass)
- 0–44: Grade 6 (Fail)

## Frontend (React + Tailwind CSS)

This repo includes a scaffold plan; run from root:

1. `cd frontend`
2. `npm install`
3. `npm run dev`

Open `http://localhost:5173`

Configure API host via `.env` file in frontend:
- `VITE_API_URL=http://localhost:4000/api`

### Minimal sample data

- Admin: `admin@ghanaschool.test` / `Admin123!`
- Teacher: `teacher@ghanaschool.test` / `Teacher123!`
- Parent: `parent@ghanaschool.test` / `Parent123!`
- Student: `student@ghanaschool.test` / `Student123!`

## Additional features to implement next

- PDF report card generation (e.g., `pdfkit`/`puppeteer`)
- Class positioning, attendance summary, remark capture
- Timetable, announcements, SMS gateway integration
- Mobile money hooks (MTN MoMo, Vodafone Cash, AirtelTigo)
- Offline-first React via service worker / PWA
