# Vercel deployment

NexusAI is a monorepo with a Vite/React frontend in `frontend/` and an
Express/Mongoose backend in `backend/`. Vercel builds `frontend/dist` and sends
all `/api/*` requests to the single Express function in `api/index.js`.

## Environment variables

Add these secrets in **Vercel → Project → Settings → Environment Variables**
for Production and Preview:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify login tokens |
| `GEMINI_API_KEY` | Yes | Google Gemini API credential |
| `JWT_EXPIRE` | No | Token lifetime; defaults to `7d` |
| `FRONTEND_URL` | No | Comma-separated extra frontend origins when the UI is hosted on another domain |
| `MAX_FILE_SIZE` | No | Local upload limit in bytes; defaults to 10 MiB and is capped at 4 MiB on Vercel |

Do not add `PORT`, `NODE_ENV`, or `VERCEL`; Vercel manages them. Leave
`VITE_API_URL` unset for the combined deployment so the frontend uses relative
`/api` requests on the same domain. For local development, copy the example
files to `backend/.env` and `frontend/.env`.

## Deploy with Git

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository from the Vercel dashboard.
3. Keep the project Root Directory set to the repository root.
4. Add the required environment variables above for Production and Preview.
5. Deploy. The checked-in `vercel.json` supplies the install command, frontend
   build command, output directory, API routing, and React Router fallback.
6. Verify `https://YOUR_DOMAIN/api/health`, then register, upload a small PDF,
   and generate one AI response.

## Deploy with the CLI

```bash
npm install --global vercel
vercel link
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add GEMINI_API_KEY
vercel
vercel --prod
```

Run `vercel env add JWT_EXPIRE` only if the default seven-day token lifetime is
not suitable.

## Manual platform setup

- In MongoDB Atlas Network Access, allow connections from Vercel. Atlas's
  broad `0.0.0.0/0` rule works with Vercel's dynamic outbound IPs; use Vercel
  Secure Compute/static egress or another network control if broad access is
  unacceptable. Keep database authentication enabled and use a least-privilege
  database user.
- Vercel request bodies are limited, so this app caps serverless uploads at
  4 MiB. Uploads are processed in memory and only extracted text is persisted
  to MongoDB. If original files must remain downloadable, or files larger than
  4 MiB must be supported, upload directly from the browser to Cloudinary, S3,
  or equivalent object storage and store the resulting object key/URL.
- The current parser extracts PDF text. Although the existing file picker lists
  DOC, DOCX, and TXT, those formats need format-specific parsers before they can
  be processed successfully.
