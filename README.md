# EaseOps E-Library

A PWA-enabled web-based eBook library built with React + FastAPI + PostgreSQL + Cloudinary.

## Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Zustand, TanStack Query, react-pdf
- **Backend**: FastAPI, Python 3.13, SQLAlchemy 2, Alembic, psycopg3
- **Database**: PostgreSQL (Neon, Supabase, or local)
- **Storage**: Cloudinary (PDF files + cover images)

## Features
- JWT authentication with refresh token rotation
- Browse, search, and filter eBooks by category/tag
- In-browser PDF reader with bookmarks and notes
- Dark mode (persisted per user)
- Admin panel — manage books, categories, tags, FAQs, surveys, contacts, users
- PWA support (offline banner, installable)
- Contact form and surveys

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- A PostgreSQL database (e.g. free tier on [neon.tech](https://neon.tech))
- A [Cloudinary](https://cloudinary.com) account (free tier)

### Backend

```bash
cd backend
pip install -r requirements.txt

cp .env.example .env
# Edit .env — fill in DATABASE_URL, SECRET_KEY, Cloudinary, SMTP

alembic upgrade head
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install

cp .env.example .env
# VITE_API_URL=http://localhost:8000

npm run dev
```

App: http://localhost:5173

### Make first admin

After registering your account, run once from the `backend/` folder:

```bash
python -c "
import app.models.bookmark, app.models.note, app.models.refresh_token, app.models.survey
from app.db.session import SessionLocal
from app.models.user import User
db = SessionLocal()
u = db.query(User).filter(User.email == 'your@email.com').first()
u.is_admin = True
db.commit()
print('Done:', u.email)
"
```
