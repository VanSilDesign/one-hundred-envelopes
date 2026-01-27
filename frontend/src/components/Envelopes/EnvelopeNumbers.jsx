export default function Places({ title, numbers, fallbackText, onSelectNumber, isLoading, loadingText }) {
  console.log(numbers);
  return (
    <section className="envelopes">
      <h2>{title}</h2>
      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {!isLoading && numbers.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {!isLoading && numbers.length > 0 && (
        <ul className="places">
          {numbers.map((place) => (
            <li key={number.id} className="number-item">
              <button onClick={() => onSelectNumber(number)}>
                <h3>{number}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
