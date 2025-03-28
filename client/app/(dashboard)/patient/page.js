"use client";
import PatientCard from "@/components/patient/patient-card";
import SearchInput from "@/components/search-input";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

const filterSuggestions = [
  { label: "firstName", description: "Filter by firstName" },
  { label: "lastName", description: "Filter by lastName" },
  { label: "cpr", description: "cpr (eks. 120499-2849)" },
  { label: "tlf", description: "tlf (eks. 25382917)" },
  { label: "email", description: "email" },
];
export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState({});
  const api = useApi();

  useEffect(() => {
    async function getData() {
      try {
        console.log(filter);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patient/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filter),
        });
        const responseData = await response.json();
        setPatients(responseData);
      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }

    getData();
  }, [filter]);

  const handleSearch = (searchData) => {
    console.log("Search Tekst uden key:", searchData.searchText);
    console.log("Filters:", searchData.filters);

    let stringValuesToLower = Object.fromEntries(Object.entries(searchData.filters).map(([key, value]) => [key, typeof value == 'string' ? value.toLowerCase() : value]))

    setFilter(stringValuesToLower);
  };


  return (
    <div className="px-2">
      <h1 className="text-2xl font-bold mb-4">Søg patienter</h1>
      <SearchInput
        onSearch={handleSearch}
        filterSuggestions={filterSuggestions}
      />

      {api.loading ? (
        <div className="w-full flex justify-center py-40">Loading</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 my-6">
          {patients?.map((patient, index) => {
            return (
              <PatientCard
                key={`patient-card-${index}`}
                patientData={patient}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
