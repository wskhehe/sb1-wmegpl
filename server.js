const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 连接到 SQLite 数据库
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the blog database.');
});

// 创建 posts 表（如果不存在）
db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL
)`);

app.get('/api/posts', (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  db.run(`INSERT INTO posts (title, content) VALUES (?, ?)`, [title, content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: this.lastID,
      title,
      content
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 当应用关闭时，关闭数据库连接
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});