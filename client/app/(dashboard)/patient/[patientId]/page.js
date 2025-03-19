"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Capitalize, TlfSpacing } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JournalEntry from "@/components/forms/journal_entry";
import JournalNotat from "@/components/patient/journal-notat";

export default function PatientData() {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState({});
  const [addJournalButton, setAddJournalButton] = useState(false);
  const route = useRouter();

  const api = useApi();

  useEffect(() => {
    async function GetPatientData() {
      try {
        const responseData = await api.get(`patient/${patientId}`);
        setPatientData(() => responseData);
        console.log(responseData);
      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }

    GetPatientData();
  }, [patientId]);

  async function Submitfunction(data) {
    data = {
      ...data,
      therapistId: 'temp',
      patient: patientId,
      date: new Date().toISOString(),
      type: "initial",
      notes: "",
      diagnosis: "test",
      treatment: "test",
      treatmentPlan: "Test",
      exerciseRecommendations: ["exercise1", "exercise2"]
    };

    try {

      // const response = await api.post('journal_entry', data)

      //console.log("Authorization:" `Bearer ${localStorage.getItem(`access_token`)}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journal_entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem(`access_token`)}`
        },
        body: JSON.stringify(data),
      });
      

      if (!response.ok) {
        throw new Error(`response code: ${response.status}, error: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error with submit: ${error}`);
    }
  }

  function ShowAddingJournal() {
    return (
      <div className="xl:col-span-1 xl:row-span-2 col-span-2 mt-12 md:mt-0">
        {<JournalEntry patientId={patientId} />}
      </div>
    );
  }

  if (api.loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="px-2">
        <h1 className="text-3xl font-semibold">
          {Capitalize(patientData.firstName)} {Capitalize(patientData.lastName)}
        </h1>
        <section className="grid grid-cols-1 md:grid-cols-[auto_1fr] xl:grid-cols-[1fr_1fr_1fr] py-3 gap-x-6 md:gap-y-12">
          <div className="col-1 col-span-2 md:col-span-1">
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Adresse</label>
              <label className="whitespace-nowrap col-1">
                {Capitalize(patientData.contactInfo?.address)},{" "}
                {Capitalize(patientData.contactInfo?.city)}
              </label>
            </div>

            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Telefon nr.</label>
              <label className="whitespace-nowrap col-1">
                {TlfSpacing(patientData.contactInfo?.tlf)}
              </label>
            </div>

            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Email</label>
              <label className="whitespace-nowrap col-1">
                {patientData.contactInfo?.email}
              </label>
            </div>
          </div>
          <div className="col-1">
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">CPR nr.</label>
              <label className="whitespace-nowrap col-1">
                {patientData.cpr}
              </label>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Forsikring</label>
              <label className="whitespace-nowrap col-1">
                {patientData.insurence?.name}
              </label>
            </div>
          </div>
          
          {addJournalButton && ShowAddingJournal()}


          <section className="col-span-2 ">
            {!addJournalButton ? (<Button className="my-4" onClick={() => setAddJournalButton((value) => !value)}>Tilføj journal note</Button>) : (<></>)}

            <section className="max-h-[600px]">
              <h1 className="text-xl mt-4 mb-1">Journal</h1>
              {patientData.journal?.map((journalEntry,index) => {
                return <JournalNotat key={`note-${index}`} journalEntry={journalEntry}/>
              })}
            </section>
          </section>
        </section>
      </div>
    );
  }
}
