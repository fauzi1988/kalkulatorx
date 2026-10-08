import { CalculatorButton } from "@/components/calculator/calculator-button";

export type ButtonKey = { label: string; value: string; kind?: "utility" | "operator" | "equals"; wide?: boolean; ariaLabel?: string };

type KeypadProps = { keys: ButtonKey[]; onPress: (value: string) => void };

export function Keypad({ keys, onPress }: KeypadProps) {
  return (
    <div className="keypad" aria-label="Tombol kalkulator">
      {keys.map((button) => (
        <CalculatorButton key={button.value} label={button.label} kind={button.kind} wide={button.wide}
          ariaLabel={button.ariaLabel} onPress={() => onPress(button.value)} />
      ))}
    </div>
  );
}
