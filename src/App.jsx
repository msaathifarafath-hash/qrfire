import { useState, useEffect, useCallback } from 'react';
import QRGenerator from './components/QRGenerator';
import QRPreview from './components/QRPreview';
import History from './components/History';
import { addToHistory, getHistory, clearHistory, detectInputType } from './utils/qrHelpers';

/**
 * App — Main QuickQR application shell.
 * Manages global state: input text, QR colors, theme, history, and toast notifications.
 */
export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('quickqr_theme') || 'dark';
  });

  // QR content state
  const [inputValue, setInputValue] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  // History state
  const [history, setHistory] = useState(() => getHistory());

  // Toast state
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quickqr_theme', theme);
  }, [theme]);

  // Auto-save to history when value changes (debounced)
  useEffect(() => {
    if (!inputValue.trim()) return;

    const timeout = setTimeout(() => {
      const type = detectInputType(inputValue);
      const newHistory = addToHistory({
        text: inputValue,
        type: type.type,
        fgColor,
        bgColor,
      });
      setHistory(newHistory);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [inputValue, fgColor, bgColor]);

  // Toast notification handler
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  }, []);

  // Restore from history
  const handleHistorySelect = useCallback((item) => {
    setInputValue(item.text);
    if (item.fgColor) setFgColor(item.fgColor);
    if (item.bgColor) setBgColor(item.bgColor);
    showToast('Restored from history ✓', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showToast]);

  // Clear history
  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
    showToast('History cleared', 'success');
  }, [showToast]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app" id="app-root">
      {/* ===== HEADER ===== */}
      <header className="header" id="header">
        <div className="header-brand">
          <div className="header-logo">Q</div>
          <span className="header-title">QuickQR</span>
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            id="theme-toggle"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="main-content">
        {/* Hero */}
        <section className="hero" id="hero">
          <h1>
            Generate <span className="gradient-text">QR Codes</span>
            <br />Instantly
          </h1>
          <p>Paste any link, text, email, or phone number and get a beautiful QR code in seconds.</p>
        </section>

        {/* Generator Grid */}
        <div className="generator-grid" id="generator-grid">
          <QRGenerator
            value={inputValue}
            onChange={setInputValue}
            fgColor={fgColor}
            bgColor={bgColor}
            onFgChange={setFgColor}
            onBgChange={setBgColor}
          />
          <QRPreview
            value={inputValue}
            fgColor={fgColor}
            bgColor={bgColor}
            onToast={showToast}
          />
        </div>

        {/* History */}
        <History
          items={history}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
        />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="footer">
        QuickQR — Works offline. No data leaves your device. Built with ❤️
      </footer>

      {/* ===== TOAST ===== */}
      <div
        className={`toast ${toast.visible ? 'show' : ''} ${toast.type}`}
        id="toast"
        role="alert"
        aria-live="polite"
      >
        {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
      </div>
    </div>
  );
}
