# Rehearse: AI Interview Coach

Practice interviews, take quizzes and solve coding problems. Your daily activity shows up as a green table, like GitHub.

## What you need first

Node.js version 20 or newer. Check it: open a terminal and type `node -v`.
If you see "not recognized" or a number below v20, install the LTS version from https://nodejs.org and open a new terminal.

## Run it (3 steps)

1. Unzip `interview-coach.zip`. Open the `interview-coach` folder.
2. Open a terminal INSIDE that folder.
   - Windows: open the folder, click the address bar, type `cmd`, press Enter.
   - Mac: right-click the folder and choose "New Terminal at Folder".
   - VS Code: File > Open Folder > choose `interview-coach`, then Terminal > New Terminal.
3. Type these two commands, one at a time:

```
npm run setup
npm start
```

`npm run setup` downloads what the app needs and builds the website. It takes 1 to 3 minutes and needs internet. You only do it once.
`npm start` starts the app. Keep that terminal open.

Now open http://localhost:5000 in your browser.

To stop the app press Ctrl + C in the terminal. To start it again later, run only `npm start`.

## If something goes wrong

- "npm is not recognized": Node.js is not installed. Install it, then open a NEW terminal.
- "Port 5000 is already in use": run the app on another port.
  - Mac or Linux: `PORT=5001 npm start`
  - Windows PowerShell: `$env:PORT=5001; npm start`
  - Windows cmd: `set PORT=5001 && npm start`
  Then open http://localhost:5001
- The page says "The website is not built yet": run `npm run setup` again.
- `npm run setup` fails: check your internet, delete the folders `backend/node_modules` and `frontend/node_modules` if they exist, then run `npm run setup` again.
- Voice answers do not work: use Chrome or Edge and allow the microphone.

## Turn on AI scoring (optional)

The app works without this. Without a key, answers are scored offline by checking for key ideas.

1. In the `backend` folder, make a copy of `.env.example` and name the copy `.env`.
2. Open `.env` and paste your Anthropic API key after `ANTHROPIC_API_KEY=`.
3. Stop the app (Ctrl + C) and run `npm start` again.

## Where is my progress saved?

In `backend/storage/db.json`. Delete that file to start fresh.

## Pages

- Overview: stats, green daily activity table, skill breakdown, daily challenge
- Practice interview: pick role and level (beginner, intermediate, advanced), type or speak your answers
- Quizzes: search, filter and sort
- Coding problems: search, filter and sort, write JavaScript and run tests
- History: every interview and quiz, with search, filter and sort

## Change the code (optional)

Run these in two terminals to see changes instantly:
- Terminal 1: `npm run dev:backend`
- Terminal 2: `npm run dev:frontend`, then open http://localhost:5173

After editing the frontend, run `npm run build --prefix frontend` so `npm start` shows your changes.
## 📸 Screenshots

### Dashboard
![AI Interview Coach Dashboard](screenshots/dashboard.png)
