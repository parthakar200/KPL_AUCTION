import React from "react";

export default function RegEditModal({ data, onChange, onSave, onClose }) {
  const [priceStr, setPriceStr] = React.useState(String(data.basePrice));

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPriceStr(raw);
  };

  const handleSave = () => {
    const parsed = parseInt(priceStr, 10);
    const finalPrice = !isNaN(parsed) && parsed >= 10 ? parsed : data.basePrice;
    onChange({ ...data, basePrice: finalPrice });
    onSave();
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">✏️ Edit Registered Player</div>
        <div className="form-row">
          <label className="form-label">Full Name</label>
          <input className="form-input" value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="form-label">Phone / WhatsApp</label>
          <input className="form-input" value={data.phone || ''} onChange={e => onChange({ ...data, phone: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-row">
            <label className="form-label">Role</label>
            <select className="form-input" value={data.role} onChange={e => onChange({ ...data, role: e.target.value })}>
              <option value="BAT">🏏 Batsman</option>
              <option value="BWL">⚾ Bowler</option>
              <option value="AR">⚡ All-Rounder</option>
              <option value="WK">🧤 Keeper</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Category</label>
            <select className="form-input" value={data.category} onChange={e => onChange({ ...data, category: e.target.value })}>
              <option value="A">A — Premium</option>
              <option value="B">B — Pro</option>
              <option value="C">C — Good</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Base Price (pts)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            value={priceStr}
            onChange={handlePriceChange}
          />
        </div>
        <div className="modal-btns">
          <button className="btn-primary" onClick={handleSave}>💾 Save Changes</button>
          <button className="btn-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}