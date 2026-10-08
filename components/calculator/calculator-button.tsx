type CalculatorButtonProps = {
  label: string;
  kind?: "utility" | "operator" | "equals";
  wide?: boolean;
  ariaLabel?: string;
  onPress: () => void;
};

export function CalculatorButton({ label, kind, wide, ariaLabel, onPress }: CalculatorButtonProps) {
  return (
    <button type="button" onClick={onPress} aria-label={ariaLabel ?? label}
      className={`key ${kind ? `key-${kind}` : ""} ${wide ? "key-wide" : ""}`}>
      {label}
    </button>
  );
}
