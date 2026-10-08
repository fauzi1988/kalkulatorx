type DisplayProps = { expression: string; value: string; error: string };

export function Display({ expression, value, error }: DisplayProps) {
  return (
    <div className="display" aria-live="polite" aria-atomic="true">
      <p className="expression">{expression || "Ketik atau tekan tombol"}</p>
      <output className="display-value" aria-label="Nilai saat ini">{value}</output>
      {error && <p className="error-message" role="alert">{error}</p>}
    </div>
  );
}
