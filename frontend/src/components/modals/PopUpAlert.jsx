export default function PopUpAlert({ type, title, text, onConfirm, onCancel }) {
  return (
    <div id="delete-confirmation">
      <h2>{title}</h2>
      <p>{text}</p>
      <p hidden={true}>{type}</p>
      <div className="button-wrapper">
        <button onClick={onCancel} className="button">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Sì
        </button>
      </div>
    </div>
  );
}
