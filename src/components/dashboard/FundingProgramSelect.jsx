import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Briefcase } from "lucide-react";
// Program colors matching FundingByProgram chart
const PROGRAM_COLORS = {
  eazecap: "#2D3A4F", // Deep Navy (hsl(220, 45%, 25%))
  platinum: "#4A6178", // Steel Blue (hsl(215, 35%, 45%))
  diamond: "#4A7C6F", // Muted Emerald (hsl(158, 40%, 38%))
  elite: "#8B7355", // Muted Amber (hsl(40, 45%, 45%))
};
const fundingPrograms = [
  { value: "eaze cap", label: "EazeCap", color: PROGRAM_COLORS.eazecap },
  { value: "platinum", label: "Platinum", color: PROGRAM_COLORS.platinum },
  { value: "diamond", label: "Diamond", color: PROGRAM_COLORS.diamond },
  { value: "elite", label: "Elite", color: PROGRAM_COLORS.elite },
];
export function FundingProgramSelect({ value, onChange, onNavigateToDetails }) {
  const navigate = useNavigate();
  const handleChange = (newValue) => {
    onChange(newValue);
    if (onNavigateToDetails) {
      onNavigateToDetails(newValue);
    }
    navigate(`/dashboard/${newValue}`);
  };
  const selectedProgram = fundingPrograms.find((p) => p.value === value);
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-card rounded-xl md:rounded-2xl px-3 md:px-5 py-3 border border-border shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
          <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>
        <span className="text-xs md:text-sm font-medium text-foreground">
          Funding Program Reports
        </span>
      </div>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-full sm:w-36 md:w-40 bg-background border-input h-8 md:h-10 text-xs md:text-sm">
          <SelectValue placeholder="Select Program">
            {selectedProgram && (
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedProgram.color }}
                />
                <span>{selectedProgram.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          {fundingPrograms.map((program) => (
            <SelectItem
              key={program.value}
              value={program.value}
              className="text-xs md:text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: program.color }}
                />
                <span>{program.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
