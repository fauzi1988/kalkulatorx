export type CalculatorOperator = "add" | "subtract" | "multiply" | "divide";

export function calculate(first: number, operator: CalculatorOperator, second: number): number {
  let result: number;
  switch (operator) {
    case "add": result = first + second; break;
    case "subtract": result = first - second; break;
    case "multiply": result = first * second; break;
    case "divide":
      if (second === 0) throw new Error("Tidak dapat membagi dengan nol.");
      result = first / second;
      break;
  }
  if (!Number.isFinite(result)) throw new Error("Angka terlalu besar untuk dihitung.");
  return Number(result.toPrecision(12));
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "Error";
  return String(Number(value.toPrecision(12)));
}

export function operatorSymbol(operator: CalculatorOperator): string {
  return { add: "+", subtract: "−", multiply: "×", divide: "÷" }[operator];
}
