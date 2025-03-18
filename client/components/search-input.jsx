import { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchInput({ onSearch, filterSuggestions = [{}] }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
    
  function HandleInputChange(e) {
    const value = e.target.value;
    setInputValue(value);

    if (!value.includes(':')) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  function HandleInputFocus() {
    if (!inputValue.includes(':')) {
      setShowSuggestions(true);
    }
  };
  
  // delay hiding suggestions after loosing focus
  function HandleInputBlur(e) {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };
  
  function HandleKeyDown(e) {
    if (e.key === 'Enter') {
      HandleSearch();
    }
  };
  
  function HandleSearch() {
    if (inputValue.trim()) {
      const parsedSearch = ParseSearchInput(inputValue);
      onSearch(parsedSearch);
      setShowSuggestions(false);
    }
  };
  
  function SelectSuggestion(suggestion) {
    setInputValue(`${suggestion.label}:`);
    setShowSuggestions(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  
  // Function to parse the search input
  function ParseSearchInput(input) {
    const filters = {};
    let searchText = input;
    
    const filterPattern = /(\w+):([\w-]+)/g;
    let match;
    
    while ((match = filterPattern.exec(input)) !== null) {
      const [fullMatch, key, value] = match;
      filters[key] = value;
      searchText = searchText.replace(fullMatch, '');
    }
    
    searchText = searchText.trim();
    
    return {
      filters,
      searchText
    };
  };
  
  
  function GetFilteredSuggestions() {
    if (!inputValue) return filterSuggestions;
    
    return filterSuggestions.filter(suggestion => 
      suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  
  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex w-full">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={HandleInputChange}
          onFocus={HandleInputFocus}
          onBlur={HandleInputBlur}
          onKeyDown={HandleKeyDown}
          placeholder="Søg patienter (f.eks. cpr:120499-1849)"
          className="pr-10"
        />
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-full px-3 py-2"
          onClick={HandleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 border rounded-md shadow-lg bg-(--color-background)">
          <div className="p-1 border-b text-sm font-medium text-gray-500">
            Filter by
          </div>
          <div className="max-h-60 overflow-auto">
            {GetFilteredSuggestions().map((suggestion) => (
              <div
                key={suggestion.label}
                className="px-2 py-1.5 hover:bg-gray-400/40 cursor-pointer flex justify-between items-center"
                onClick={() => SelectSuggestion(suggestion)}
              >
                <span className="font-medium">{suggestion.label}:</span>
                <span className="text-gray-500 text-sm">{suggestion.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}