'use client'
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import FilterOption from "./filter-option";
import { useEffect, useState } from "react";

export default function FilterButton({filterOptions = [], selectedOptions = [], setSelectedOptions, min = 0, max = 999, SubmitFilteredChanges}) {
  const [selectedFilter, setSelectedFilter] = useState(selectedOptions)

  function HandleOptionChange(option, isChecked) {
    if (isChecked) {
      setSelectedFilter([...selectedFilter, option]);
    } else {
      setSelectedFilter(selectedFilter.filter(item => item !== option));
    }
  };

  

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Filter /></Button>
      </SheetTrigger>
      <SheetContent className="px-2">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>
            Vælg de personer du vil se kalenderen over
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          {filterOptions.map((option, index) => (
            <FilterOption 
              key={`filter-${index}`}
              label={`${option.firstName} ${option.lastName}`}
              checked={selectedFilter.includes(option)}
              onChecked={(isChecked) => HandleOptionChange(option, isChecked)}
            />
          ))}
        </div>
        
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={() => SubmitFilteredChanges(selectedFilter)} >Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
