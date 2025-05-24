const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Доступ до зображень

// --- Завантаження зображень ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не завантажено' });
  res.json({ filename: req.file.filename });
});

// --- Програми збережені у JSON ---
const programsPath = path.join(__dirname, 'programs.json');

let programs = {};

// Завантажити при запуску
function loadPrograms() {
  try {
    const data = fs.readFileSync(programsPath, 'utf8');
    programs = JSON.parse(data);
    console.log('Програми завантажено з файла.');
  } catch (err) {
    console.error('Не вдалося завантажити програми:', err);
    programs = {};
  }
}

// Зберегти у файл
function savePrograms() {
  try {
    fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2), 'utf8');
    console.log('Програми збережено у файл.');
  } catch (err) {
    console.error('Не вдалося зберегти програми:', err);
  }
}

loadPrograms();

// --- Отримати всі програми ---
app.get('/programs', (req, res) => {
  const list = Object.entries(programs).map(([id, data]) => ({
    id,
    label: data.label || id.charAt(0).toUpperCase() + id.slice(1),
    image: data.image || ''
  }));
  res.json(list);
});

// --- Додати нову програму ---
app.post('/add-program', (req, res) => {
  const { id, command, label, image } = req.body;

  if (!id || !command) {
    return res.status(400).json({ error: 'Потрібні id та command' });
  }

  if (programs[id]) {
    return res.status(400).json({ error: 'Програма з таким ID вже існує' });
  }

  programs[id] = {
    command,
    label: label || id,
    image: image || ''
  };

  savePrograms();

  res.json({ message: `Програму "${id}" додано` });
});

// --- Запустити програму ---
app.post('/launch', (req, res) => {
  const { program } = req.body;

  if (!program) {
    return res.status(400).json({ error: 'Вкажіть програму для запуску' });
  }

  const entry = programs[program];
  if (!entry || !entry.command) {
    return res.status(400).json({ error: 'Невідома програма або команда' });
  }

  exec(entry.command, (error) => {
    if (error) {
      console.error('Помилка запуску:', error);
      return res.status(500).json({ error: 'Не вдалося запустити програму' });
    }

    res.json({ message: `${program} запущено` });
  });
});

// --- Редагування програми ---
app.put('/edit-program', upload.single('image'), (req, res) => {
  const { id, newId, newCommand } = req.body;

  if (!id || !newId || !newCommand) {
    return res.status(400).json({ error: 'id, newId та newCommand обов’язкові' });
  }

  if (!programs[id]) {
    return res.status(404).json({ error: 'Програма не знайдена' });
  }

  const oldData = programs[id];

  // Видалити старе зображення, якщо нове завантажено
  if (req.file && oldData.image) {
    const oldImagePath = path.join(__dirname, 'images', oldData.image);
    if (fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, err => {
        if (err) console.error('Помилка видалення старого зображення:', err);
      });
    }
  }

  const newImage = req.file ? req.file.filename : oldData.image;

  delete programs[id];
  programs[newId] = {
    ...oldData,
    command: newCommand,
    image: newImage,
    label: oldData.label
  };

  savePrograms();

  res.json({ message: 'Програму оновлено' });
});

// --- Видалити програму ---
app.delete('/delete-program/:id', (req, res) => {
  const id = req.params.id;
  const program = programs[id];

  if (!program) {
    return res.status(404).json({ error: 'Програма не знайдена' });
  }

  // Видалити зображення, якщо воно існує
  if (program.image) {
    const imagePath = path.join(__dirname, 'images', program.image);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Помилка при видаленні зображення:', err);
        } else {
          console.log(`Зображення ${program.image} видалено`);
        }
      });
    }
  }

  delete programs[id];
  savePrograms();

  res.json({ message: `Програму "${id}" та її зображення видалено` });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
