import { useState } from 'react';
import { detectInputType, sanitizeInput } from '../utils/qrHelpers';

/**
 * QRGenerator — Input panel for QR code content and customization.
 * Detects input type automatically and provides color customization.
 */
export default function QRGenerator({ value, onChange, fgColor, bgColor, onFgChange, onBgChange }) {
  const [showCustomize, setShowCustomize] = useState(false);
  const inputType = detectInputType(value);
  const charCount = value.length;

  const handleChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    onChange(sanitized);
  };

  return (
    <div className="card" id="qr-generator-card">
      <div className="card-title">
        <span className="icon">⚡</span>
        Generate
      </div>

      {/* Input type badge */}
      {value.trim() && (
        <div className="input-type-badge" id="input-type-badge">
          <span>{inputType.icon}</span>
          <span>{inputType.label} detected</span>
        </div>
      )}

      {/* Text input area */}
      <div className="input-group">
        <textarea
          id="qr-input"
          className="text-input"
          placeholder="Paste a URL, text, email, or phone number…"
          value={value}
          onChange={handleChange}
          maxLength={2048}
          aria-label="QR code content input"
          autoFocus
        />
        <div className="char-count">{charCount} / 2048</div>
      </div>

      {/* Customization panel */}
      <div className="customize-section">
        <button
          className="customize-toggle"
          id="customize-toggle"
          onClick={() => setShowCustomize(!showCustomize)}
          aria-expanded={showCustomize}
        >
          <span>🎨 Customize QR Style</span>
          <span style={{ transform: showCustomize ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            ▾
          </span>
        </button>

        {showCustomize && (
          <div className="customize-panel" id="customize-panel">
            <div className="color-row">
              <label>QR Color</label>
              <div className="color-picker-wrapper">
                <div className="color-swatch" style={{ background: fgColor }}>
                  <input
                    type="color"
                    id="fg-color-picker"
                    value={fgColor}
                    onChange={(e) => onFgChange(e.target.value)}
                    aria-label="QR foreground color"
                  />
                </div>
                <span className="color-hex">{fgColor}</span>
              </div>
            </div>
            <div className="color-row">
              <label>Background</label>
              <div className="color-picker-wrapper">
                <div className="color-swatch" style={{ background: bgColor }}>
                  <input
                    type="color"
                    id="bg-color-picker"
                    value={bgColor}
                    onChange={(e) => onBgChange(e.target.value)}
                    aria-label="QR background color"
                  />
                </div>
                <span className="color-hex">{bgColor}</span>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-full"
              style={{ fontSize: '0.8rem', padding: '8px' }}
              onClick={() => { onFgChange('#000000'); onBgChange('#ffffff'); }}
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
