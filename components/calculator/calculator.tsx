"use client";

import { useCallback, useEffect, useState } from "react";
import { calculate, formatNumber, operatorSymbol, type CalculatorOperator } from "@/lib/calculator/engine";
import { Display } from "@/components/calculator/display";
import { Keypad, type ButtonKey } from "@/components/calculator/keypad";

const keys: ButtonKey[] = [
  { label: "AC", value: "clear", kind: "utility", ariaLabel: "Hapus semua" },
  { label: "±", value: "sign", kind: "utility", ariaLabel: "Ubah tanda" },
  { label: "%", value: "percent", kind: "utility", ariaLabel: "Persen" },
  { label: "÷", value: "divide", kind: "operator", ariaLabel: "Bagi" },
  { label: "7", value: "7" }, { label: "8", value: "8" }, { label: "9", value: "9" },
  { label: "×", value: "multiply", kind: "operator", ariaLabel: "Kali" },
  { label: "4", value: "4" }, { label: "5", value: "5" }, { label: "6", value: "6" },
  { label: "−", value: "subtract", kind: "operator", ariaLabel: "Kurang" },
  { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" },
  { label: "+", value: "add", kind: "operator", ariaLabel: "Tambah" },
  { label: "0", value: "0", wide: true }, { label: ".", value: "decimal", ariaLabel: "Desimal" },
  { label: "=", value: "equals", kind: "equals", ariaLabel: "Hasil" },
];

const operatorKeys: Record<string, CalculatorOperator> = { "+": "add", "-": "subtract", "*": "multiply", "/": "divide" };

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<CalculatorOperator | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [expression, setExpression] = useState("");
  const [error, setError] = useState("");
  const [repeat, setRepeat] = useState<{ operator: CalculatorOperator; value: number } | null>(null);

  const press = useCallback((key: string) => {
    if (key === "clear") {
      setDisplay("0"); setStored(null); setOperator(null); setWaiting(false); setExpression(""); setError(""); setRepeat(null);
      return;
    }
    if (error) {
      setDisplay("0"); setError(""); setStored(null); setOperator(null); setWaiting(false); setExpression(""); setRepeat(null);
      if (!/^\d$/.test(key) && key !== "decimal") return;
    }
    if (/^\d$/.test(key)) {
      setDisplay((current) => waiting || error ? key : current === "0" ? key : current.length < 15 ? current + key : current);
      setWaiting(false); setExpression(""); setRepeat(null); return;
    }
    if (key === "decimal") {
      setDisplay((current) => waiting ? "0." : current.includes(".") ? current : current + ".");
      setWaiting(false); setExpression(""); setRepeat(null); return;
    }
    if (key === "sign") {
      setDisplay((current) => current === "0" ? current : current.startsWith("-") ? current.slice(1) : `-${current}`);
      return;
    }
    if (key === "percent") {
      setDisplay((current) => formatNumber(Number(current) / 100)); setWaiting(true); setRepeat(null); return;
    }
    if (key === "backspace") {
      if (!waiting) setDisplay((current) => current.length <= 1 || (current.length === 2 && current.startsWith("-")) ? "0" : current.slice(0, -1));
      return;
    }
    if (key === "equals") {
      if (operator !== null && stored !== null) {
        const second = waiting ? stored : Number(display);
        try {
          const result = calculate(stored, operator, second);
          setExpression(`${formatNumber(stored)} ${operatorSymbol(operator)} ${formatNumber(second)} =`);
          setDisplay(formatNumber(result)); setRepeat({ operator, value: second }); setStored(null); setOperator(null); setWaiting(true);
        } catch (cause) { setError(cause instanceof Error ? cause.message : "Perhitungan gagal."); setDisplay("Error"); setOperator(null); setStored(null); }
      } else if (repeat) {
        try { setDisplay(formatNumber(calculate(Number(display), repeat.operator, repeat.value))); }
        catch { setError("Perhitungan gagal."); setDisplay("Error"); }
      }
      return;
    }
    if (key in { add: 1, subtract: 1, multiply: 1, divide: 1 }) {
      const nextOperator = key as CalculatorOperator;
      const current = Number(display);
      if (operator && stored !== null && !waiting) {
        try {
          const result = calculate(stored, operator, current);
          setDisplay(formatNumber(result)); setStored(result);
          setExpression(`${formatNumber(result)} ${operatorSymbol(nextOperator)}`);
        } catch (cause) { setError(cause instanceof Error ? cause.message : "Perhitungan gagal."); setDisplay("Error"); setStored(null); setOperator(null); return; }
      } else {
        setStored(current); setExpression(`${formatNumber(current)} ${operatorSymbol(nextOperator)}`);
      }
      setOperator(nextOperator); setWaiting(true); setRepeat(null);
    }
  }, [display, error, operator, repeat, stored, waiting]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      const key = event.key;
      if (/^\d$/.test(key)) { event.preventDefault(); press(key); }
      else if (key in operatorKeys) { event.preventDefault(); press(operatorKeys[key]); }
      else if (key === "Enter" || key === "=") { event.preventDefault(); press("equals"); }
      else if (key === ".") { event.preventDefault(); press("decimal"); }
      else if (key === "%") { event.preventDefault(); press("percent"); }
      else if (key === "Escape") { event.preventDefault(); press("clear"); }
      else if (key === "Backspace") { event.preventDefault(); press("backspace"); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [press]);

  return (
    <section className="calculator" aria-label="Kalkulator">
      <header className="calculator-header">
        <div className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></div>
        <div><p className="eyebrow">ALAT HITUNG</p><h1>Kalkulator</h1></div>
        <span className="status-dot" aria-label="Siap digunakan" />
      </header>
      <Display expression={expression} value={display} error={error} />
      <Keypad keys={keys} onPress={press} />
      <footer className="calculator-footer"><span><kbd>Enter</kbd> hitung</span><span><kbd>⌫</kbd> hapus angka</span><button type="button" onClick={() => press("backspace")} className="backspace" aria-label="Hapus satu karakter">⌫</button></footer>
    </section>
  );
}
