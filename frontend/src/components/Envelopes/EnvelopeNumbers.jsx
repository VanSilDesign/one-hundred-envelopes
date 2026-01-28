export default function EnvelopeNumbers({ title, numbers, fallbackText, onSelectNumber, isLoading, loadingText }) {
  console.log(numbers);
  return (
    <section className="envelopes">
      <h2>{title}</h2>
      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {!isLoading && numbers.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {!isLoading && numbers.length > 0 && (
        <ul>
          {numbers.map((number) => (
            <li key={number} className="number-item">
              <button /*onClick={() => onSelectNumber(number)}*/>
                <span>{typeof number === 'object' ? number.valore : number}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
