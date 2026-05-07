
import { useRef } from 'react';
import { compressPhoto } from '../../utils/helpers';

export default function EditPlayerModal({ data, onChange, onSave, onClose }) {
  const photoInputRef = useRef(null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { alert('Photo must be under 20MB.'); return; }
    try {
      const compressed = await compressPhoto(file);
      onChange({ ...data, photo: compressed });
    } catch {
      alert('Failed to process photo. Please try another image.');
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">✏️ Edit Player</div>

        {/* Photo Section */}
        <div style={{ marginBottom:20, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div onClick={() => photoInputRef.current?.click()}
            style={{ width:88, height:88, borderRadius:'50%', cursor:'pointer', border: data.photo ? '3px solid var(--accent)' : '2px dashed var(--border)', background: data.photo ? 'transparent' : 'var(--bg-card2)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', marginBottom:8, transition:'all 0.2s', boxShadow: data.photo ? '0 0 0 4px rgba(99,102,241,0.15)' : 'none' }}>
            {data.photo
              ? <img src={data.photo} alt="Player" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:28 }}>📷</div>
                  <div style={{ fontSize:9, color:'var(--text-muted)', marginTop:2 }}>Add Photo</div>
                </div>
            }
          </div>
          <div style={{ fontSize:10, color: data.photo ? '#22c55e' : 'var(--text-muted)', fontWeight: data.photo ? 700 : 400 }}>
            {data.photo ? '✅ Photo set — tap to change' : 'Tap to upload player photo'}
          </div>
          {data.photo && (
            <button onClick={() => onChange({ ...data, photo: null })}
              style={{ marginTop:4, fontSize:10, color:'var(--cat-a)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>
              ✕ Remove photo
            </button>
          )}
          <input ref={photoInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange} />
        </div>

        <div className="form-row">
          <label className="form-label">Player Name</label>
          <input className="form-input" value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-row">
            <label className="form-label">Category</label>
            <select className="form-input" value={data.category} onChange={(e) => onChange({ ...data, category: e.target.value })}>
              <option value="A">A — Premium</option>
              <option value="B">B — Pro</option>
              <option value="C">C — Good</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Role</label>
            <select className="form-input" value={data.role} onChange={(e) => onChange({ ...data, role: e.target.value })}>
              <option value="BAT">🏏 Batsman</option>
              <option value="BWL">⚾ Bowler</option>
              <option value="AR">⚡ All-Rounder</option>
              <option value="WK">🧤 Keeper</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Base Price (pts)</label>
          <input type="number" className="form-input" value={data.basePrice} min={10} max={500}
            onChange={(e) => onChange({ ...data, basePrice: parseInt(e.target.value) || data.basePrice })} />
        </div>
        <div className="modal-btns">
          <button className="btn-primary" onClick={onSave}>💾 Save Changes</button>
          <button className="btn-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
