import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [length, setLength] = useState(14);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("passwordHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });

  const characters = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  const optionItems = [
    { key: "uppercase", icon: "Aa", title: "Büyük Harf", desc: "(A-Z)" },
    { key: "lowercase", icon: "aa", title: "Küçük Harf", desc: "(a-z)" },
    { key: "numbers", icon: "12", title: "Sayılar", desc: "(0-9)" },
    { key: "symbols", icon: "!@", title: "Semboller", desc: "(!@#$...)" },
  ];

  const toggleOption = (key) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  const generatePassword = () => {
    let pool = "";

    Object.keys(options).forEach((key) => {
      if (options[key]) pool += characters[key];
    });

    if (!pool) {
      setPassword("En az bir seçenek seç");
      return;
    }

    let newPassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      newPassword += pool[randomIndex];
    }

    setPassword(newPassword);
    setHistory((prev) => [newPassword, ...prev].slice(0, 5));
  };

  const copyText = (text) => {
    if (!text || text === "En az bir seçenek seç") return;

    navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const getStrength = () => {
    let score = 0;

    if (options.uppercase) score++;
    if (options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;

    if (score <= 2) return { text: "Zayıf", color: "#ef4444" };
    if (score <= 4) return { text: "Orta", color: "#f59e0b" };
    return { text: "Güçlü", color: "#22c55e" };
  };

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("passwordHistory", JSON.stringify(history));
  }, [history]);

  return (
    <main className={`app ${theme}`}>
      {copied && <div className="toast">Şifre kopyalandı ✅</div>}

      <section className="card">
        <div className="top-bar">
          <div className="icon-box">🔒</div>

          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <h1>Password Generator</h1>
        <p className="subtitle">Güvenli ve rastgele şifreler oluştur</p>

        <div className="password-box">
          <span>{password}</span>
          <button onClick={() => copyText(password)}>Kopyala</button>
        </div>

        <div className="strength">
          <span>Güç:</span>
          <strong style={{ color: getStrength().color }}>
            {getStrength().text}
          </strong>
        </div>

        <div className="length-box">
          <div className="length-header">
            <strong>Uzunluk:</strong>
            <span>{length}</span>
          </div>

          <div className="range-row">
            <small>6</small>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <small>32</small>
          </div>
        </div>

        <div className="options-box">
          <h2>Karakter Seçenekleri</h2>

          {optionItems.map((item) => (
            <div className="option-card" key={item.key}>
              <div className="option-left">
                <div className="option-icon">{item.icon}</div>
                <p>
                  {item.title} <span>{item.desc}</span>
                </p>
              </div>

              <button
                className={`check-btn ${options[item.key] ? "active" : ""}`}
                onClick={() => toggleOption(item.key)}
              >
                ✓
              </button>
            </div>
          ))}
        </div>

        <button className="generate-btn" onClick={generatePassword}>
          ✨ Şifre Üret
        </button>

        {history.length > 0 && (
          <div className="history-box">
            <h2>Son Üretilen Şifreler</h2>

            {history.map((item, index) => (
              <div className="history-item" key={index}>
                <span>{item}</span>
                <button onClick={() => copyText(item)}>Kopyala</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;