function IconButton({ children, ...props }) {
  return (
    <button {...props} className="button">
      <span className="button-text">{children}</span>
    </button>
  );
};

export default IconButton;