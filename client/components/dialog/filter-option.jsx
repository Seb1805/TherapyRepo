import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export default function FilterOption({ label, checked, onChecked }) {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Checkbox 
        id={`filter-${label}`}
        checked={checked} 
        onCheckedChange={onChecked}
      />
      <Label 
        htmlFor={`filter-${label}`}
        className="cursor-pointer"
      >
        {label}
      </Label>
    </div>
  )
}
