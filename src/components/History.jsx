import { QRCodeSVG } from 'qrcode.react';
import { timeAgo, detectInputType } from '../utils/qrHelpers';

/**
 * History — Displays recently generated QR codes from localStorage.
 * Clicking an item restores it in the generator.
 */
export default function History({ items, onSelect, onClear }) {
  if (!items || items.length === 0) {
    return (
      <section className="history-section" id="history-section">
        <div className="history-header">
          <h2>🕐 Recent</h2>
        </div>
        <div className="history-empty">
          <div className="icon">📭</div>
          <p>No QR codes generated yet.<br />Your history will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="history-section" id="history-section">
      <div className="history-header">
        <h2>
          🕐 Recent
          <span className="history-count">{items.length}</span>
        </h2>
        <button className="clear-history-btn" onClick={onClear} id="clear-history-btn">
          Clear all
        </button>
      </div>

      <div className="history-grid">
        {items.map((item) => {
          const inputType = detectInputType(item.text);
          return (
            <div
              key={item.id}
              className="history-item"
              onClick={() => onSelect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
              aria-label={`Restore QR code: ${item.text.slice(0, 40)}`}
            >
              <div className="history-item-preview">
                <QRCodeSVG
                  value={item.text}
                  size={34}
                  level="L"
                  fgColor={item.fgColor || '#000000'}
                  bgColor={item.bgColor || '#ffffff'}
                />
              </div>
              <div className="history-item-info">
                <div className="history-item-text">{item.text}</div>
                <div className="history-item-meta">
                  <span>{inputType.icon} {inputType.label}</span>
                  <span>·</span>
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
