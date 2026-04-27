export default function ResetModal({ onConfirm, onClose }) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title" style={{ color: 'var(--cat-a)' }}>⚠ Reset Auction?</div>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 4 }}>
          This will erase ALL auction data — players sold, team rosters, bids.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
          Only dummy data will remain. This cannot be undone.
        </p>
        <div className="modal-btns">
          <button className="btn-danger" onClick={onConfirm}>Yes, Reset Everything</button>
          <button
            className="btn-primary"
            onClick={onClose}
            style={{ background: 'var(--bg-card2)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
