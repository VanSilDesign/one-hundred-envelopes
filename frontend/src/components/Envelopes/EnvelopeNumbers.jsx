export default function EnvelopeNumbers({
  title,
  numbers,
  fallbackText,
  onDeleteNumber,
  onResetHistory,
  isLoading,
  loadingText,
}) {
  console.log(numbers);
  return (
    <section className="envelopes">
      <div className="history-header">
        <h2>{title}</h2>
        <button className="button button-reset" onClick={onResetHistory}>Reset</button>
      </div>
      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {!isLoading && numbers.length === 0 && (
        <p className="fallback-text">{fallbackText}</p>
      )}
      {!isLoading && numbers.length > 0 && (
        <ul>
          {numbers.map((number) => {
            const val = typeof number === "object" ? number.value : number;
            return (
              <li key={val} className="number-item">
                <div className="number-wrapper">
                  <span className="number-display">{val}</span>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      onDeleteNumber(val);
                    }}
                    title="Cancella numero"
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
