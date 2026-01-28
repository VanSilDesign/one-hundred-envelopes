function IconButton({ children, onClick, ...props }) {
  return (
    <button onClick={onClick} {...props} className="button">
      <span className="button-text">{children}</span>
    </button>
  );
}

export default IconButton;
