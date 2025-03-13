"use client";
import PatientCard from "@/components/patient/patient-card";
import SearchInput from "@/components/search-input";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

const filterSuggestions = [
  { label: 'firstName', description: 'Filter by firstName' },
  { label: 'lastName', description: 'Filter by lastName' },
  { label: 'cpr', description: 'cpr (eks. 120499-2849)' },
  { label: 'tlf', description: 'tlf (eks. 25382917)' },
  { label: 'email', description: 'email' },
];

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState({});
  const api = useApi();

  useEffect(() => {
    async function getData() {
      try {
        // ændre til nye patient api der accepterer object filterering
        const responseData = await api.get("patient");
        setPatients(() => responseData);
      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }

    getData();
  }, [filter]);

  const handleSearch = (searchData) => {
    console.log("Search Tekst uden key:", searchData.searchText);
    console.log("Filters:", searchData.filters);

    setFilter(() => searchData.filters);
  };

  if (api.loading) {
    return <p>loading</p>;
  } else {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Søg patienter</h1>
        <SearchInput onSearch={handleSearch} filterSuggestions={filterSuggestions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 my-3">
          {patients.map((patient,index) => {
            return <PatientCard key={`patient-card-${index}`} patientData={patient} />;
          })}
        </div>
      </div>
    );
  }
}
