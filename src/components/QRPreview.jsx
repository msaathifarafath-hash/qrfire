import { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { qrToBlob, downloadBlob, downloadSvg } from '../utils/qrHelpers';

/**
 * QRPreview — Displays the generated QR code with download, copy, and share actions.
 */
export default function QRPreview({ value, fgColor, bgColor, onToast }) {
  const svgRef = useRef(null);
  const hasValue = value.trim().length > 0;

  // Download as PNG (high resolution)
  const handleDownloadPng = useCallback(async () => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    try {
      const blob = await qrToBlob(svg);
      downloadBlob(blob, `quickqr-${Date.now()}.png`);
      onToast('Downloaded as PNG ✓', 'success');
    } catch {
      onToast('Download failed', 'error');
    }
  }, [onToast]);

  // Download as SVG
  const handleDownloadSvg = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    try {
      downloadSvg(svg, `quickqr-${Date.now()}.svg`);
      onToast('Downloaded as SVG ✓', 'success');
    } catch {
      onToast('Download failed', 'error');
    }
  }, [onToast]);

  // Copy QR image to clipboard
  const handleCopy = useCallback(async () => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    try {
      const blob = await qrToBlob(svg);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      onToast('Copied to clipboard ✓', 'success');
    } catch {
      onToast('Copy failed — try downloading instead', 'error');
    }
  }, [onToast]);

  // Copy original text
  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      onToast('Text copied ✓', 'success');
    } catch {
      onToast('Could not copy text', 'error');
    }
  }, [value, onToast]);

  // Share via Web Share API
  const handleShare = useCallback(async () => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    try {
      const blob = await qrToBlob(svg);
      const file = new File([blob], 'quickqr.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QuickQR Code',
          text: value,
          files: [file],
        });
        onToast('Shared successfully ✓', 'success');
      } else if (navigator.share) {
        await navigator.share({
          title: 'QuickQR Code',
          text: value,
        });
      } else {
        onToast('Share not supported on this device', 'error');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        onToast('Share cancelled', 'error');
      }
    }
  }, [value, onToast]);

  return (
    <div className="card" id="qr-preview-card">
      <div className="card-title">
        <span className="icon">📱</span>
        Preview
      </div>

      <div className="qr-preview-area">
        {/* QR Code Display */}
        <div
          ref={svgRef}
          className={`qr-canvas-wrapper ${hasValue ? 'qr-animate-in' : ''}`}
          id="qr-canvas-wrapper"
          style={{ background: bgColor }}
        >
          {hasValue ? (
            <QRCodeSVG
              value={value}
              size={200}
              level="H"
              fgColor={fgColor}
              bgColor={bgColor}
              includeMargin={false}
            />
          ) : (
            <div className="qr-placeholder">
              <span className="icon">⬜</span>
              <p>Your QR code<br />will appear here</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {hasValue && (
          <div className="action-buttons" id="qr-actions">
            <button className="btn btn-primary" onClick={handleDownloadPng} id="download-png-btn" title="Download PNG">
              📥 PNG
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadSvg} id="download-svg-btn" title="Download SVG">
              📐 SVG
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleCopy} id="copy-qr-btn" title="Copy QR image">
              📋
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleCopyText} id="copy-text-btn" title="Copy text">
              📄
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleShare} id="share-btn" title="Share">
              🔗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
