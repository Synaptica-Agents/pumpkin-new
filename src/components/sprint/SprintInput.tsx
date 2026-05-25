import React, { useState, useRef, useEffect } from "react";
import { DrillButton } from "@/components/ui/drill-button";

interface SprintInputProps {
  onSubmit: (answer: string) => void;
  flashState: "none" | "correct" | "incorrect";
}

const SprintInput: React.FC<SprintInputProps> = ({ onSubmit, flashState }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount and after each flash
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [flashState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    onSubmit(value.trim());
    setValue("");
  };

  const getBorderClass = () => {
    switch (flashState) {
      case "correct":
        return "border-success ring-2 ring-success/50";
      case "incorrect":
        return "border-destructive ring-2 ring-destructive/50";
      default:
        return "border-border focus-within:border-primary";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex w-full gap-3">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Antwort..."
          autoComplete="off"
          className={`h-14 flex-1 rounded-xl bg-input px-5 text-xl text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 border-2 ${getBorderClass()}`}
        />
        <DrillButton
          type="submit"
          variant="active"
          size="lg"
          disabled={!value.trim()}
          className="h-14 px-6"
        >
          Check
        </DrillButton>
      </form>
      <p className="text-xs text-muted-foreground">
        Kürzel: <span className="font-medium">10k</span>, <span className="font-medium">5mio</span>, <span className="font-medium">2mrd</span>
      </p>
    </div>
  );
};

export default SprintInput;
