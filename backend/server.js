'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const tempDir = path.join(__dirname, 'temp');

fs.mkdirSync(tempDir, { recursive: true });

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendDir));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    tempDir,
    frontend: frontendDir
  });
});

app.get('/customer', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendDir, 'admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(frontendDir, 'admin-dashboard.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Customer portal: http://localhost:${PORT}/customer`);
  console.log(`Admin portal: http://localhost:${PORT}/admin`);
  console.log(`Temp folder ready: ${tempDir}`);
});
