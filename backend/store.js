// Tiny file database. No MySQL, no install. Your progress lives in backend/storage/db.json
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'storage', 'db.json');

function empty() {
  return { activity: [], sessions: [], quizAttempts: [], solved: [] };
}

function load() {
  try {
    return { ...empty(), ...JSON.parse(fs.readFileSync(FILE, 'utf8')) };
  } catch (e) {
    return empty();
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

module.exports = { load, save };
