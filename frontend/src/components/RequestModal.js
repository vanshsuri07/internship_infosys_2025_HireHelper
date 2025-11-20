import React, { useState } from "react";
import "./RequestModal.css";

function RequestModal({ onClose, onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(message);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Send Request</h2>
        <p>Pitch your idea to the task creator:</p>

        <form onSubmit={handleSubmit}>
          <textarea
            className="modal-textarea"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="modal-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-send">
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestModal;
