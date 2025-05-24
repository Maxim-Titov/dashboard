# Dashboard PWA

## English

Dashboard is a Progressive Web App (PWA) that enables you to launch programs on your PC from your iPhone over a local network. The app supports managing a list of IP addresses, adding custom programs with images, and provides a convenient interface for remote control.

### Features

- Progressive Web App (works on mobile devices and desktops)
- Launch programs on PC remotely via iPhone
- Manage multiple IP addresses for PCs on your local network
- Add, edit, and delete custom programs with icons/images
- Real-time communication between client and server
- Simple and intuitive user interface

### Installation

Clone the repository and install dependencies:

### Installation

```bash
git clone https://github.com/Maxim-Titov/dashboard.git
cd dashboard
```

### Server setup

```bash
cd server
npm install
```

### Client setup

```bash
cd ../client
npm install
```

### Running the app

Start the server:

```bash
cd server
npm start
```

Start the client application:

```bash
cd ../client
npm start
```

### Adding Programs

1. Go to the **"Add"** tab.
2. In the **ID** field, enter the launch command:
   - For Windows — the full path to the `.exe` file (e.g. `C:\Program Files\Example\app.exe`);
   - For Linux — just the command name (e.g. `firefox` or `code`).
3. Fill in the **Label** field — this will be the display name in the interface.
4. Optionally, upload an image — it will be used as the program icon.
5. Click **"Save"** to add the program to the list.

### Requirements

- Node.js (v14+ recommended)
- npm
- Local network connection between your iPhone and PC

### Usage
1. Launch the server on your PC.
2. Launch the app client on your PC.
3. Open the client app on your iPhone (or in a browser).
4. Add the IP address of your PC.
5. Add programs you want to launch remotely.
6. Tap on a program in the app to launch it on your PC.

If you need help or want to suggest an improvement, open an issue or create a pull request.

---

## Українська

Dashboard — це прогресивний веб-додаток (PWA), який дозволяє запускати програми на вашому ПК з iPhone через локальну мережу. Додаток підтримує управління списком IP-адрес, додавання власних програм із зображеннями та забезпечує зручний інтерфейс для віддаленого керування.

### Особливості

- Прогресивний веб-додаток (працює на мобільних пристроях і десктопах)
- Запуск програм на ПК дистанційно через iPhone
- Управління кількома IP-адресами ПК у локальній мережі
- Додавання, редагування та видалення програм із іконками/зображеннями
- Обмін даними в реальному часі між клієнтом і сервером
- Простий та інтуїтивний інтерфейс

### Встановлення

Клонувати репозиторій та встановити залежності:

```bash
git clone https://github.com/Maxim-Titov/dashboard.git
cd dashboard
```

### Встановлення серверу

```bash
cd server
npm install
```

### Встановлення клієнтської частини

```bash
cd ../client
npm install
```

### Запуск

Запустити сервер:

```bash
cd server
npm start
```

Запустити клієнтський додаток:

```bash
cd ../client
npm start
```

### Додавання програм

1. Перейдіть у вкладку **"Add"**.
2. У полі **ID** вкажіть команду запуску:
   - для Windows — повний шлях до `.exe` файлу, наприклад: `C:\Program Files\Example\app.exe`;
   - для Linux — просто назву команди, наприклад: `firefox` або `code`.
3. Заповніть поле **Label** — це назва, яка відображатиметься в інтерфейсі.
4. За бажанням додайте зображення — воно буде використовуватись як іконка.
5. Натисніть **"Save"**, щоб додати програму до списку.

### Вимоги

- Node.js (рекомендована версія 14+)
- npm
- Локальна мережа для підключення iPhone і ПК

### Використання

1. Запустіть сервер на ПК.
2. Запустіть клієнтську програму на своєму ПК.
3. Відкрийте додаток на iPhone (або у браузері).
4. Додайте IP-адресу вашого ПК.
5. Додайте програми, які хочете запускати дистанційно.
6. Натисніть на програму в додатку, щоб запустити її на ПК.

Якщо потрібна допомога або хочете запропонувати покращення — відкривайте issue або створюйте pull request.
