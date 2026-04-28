const TermopharmaLogo = ({ className = '', compact = false }) => {
  return (
    <img
      src="/termopharma-logo.jpeg"
      alt="Logo oficial de Termopharma"
      className={`${compact ? 'h-auto max-h-56 object-contain' : 'h-auto object-contain'} ${className}`.trim()}
    />
  );
};

export default TermopharmaLogo;
