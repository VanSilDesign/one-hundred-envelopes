export default function EnvelopeNumbers({ title, numbers, fallbackText, onDeleteNumber, isLoading, loadingText }) {
  console.log(numbers);
  return (
    <section className="envelopes">
      <h2>{title}</h2>
      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {!isLoading && numbers.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {!isLoading && numbers.length > 0 && (
        <ul className="numbers-list">
          {numbers.map((number) => {
            const val = typeof number === 'object' ? number.valore : number;
            return (
              <li key={val} className="number-item">
                <div className="number-wrapper">
                   <span className="number-display">{val}</span>
                   <button 
                     className="delete-btn" 
                     onClick={() => onDeleteNumber(val)}
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
