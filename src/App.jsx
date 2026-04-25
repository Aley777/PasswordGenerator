import { useState } from "react";
import "./App.css";

function App() {
  const [length, setLength] = useState(14);
  const [password, setPassword] = useState("a7K!qL2@zP9#eR");
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
  };

  const copyPassword = () => {
    if (!password || password === "En az bir seçenek seç") return;
    navigator.clipboard.writeText(password);
  };

  return (
    <main className="app">
      <section className="card">
        <div className="icon-box">🔒</div>

        <h1>Password Generator</h1>
        <p className="subtitle">Güvenli ve rastgele şifreler oluştur</p>

        <div className="password-box">
          <span>{password}</span>
          <button onClick={copyPassword}>Kopyala</button>
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
      </section>
    </main>
  );
}

export default App;