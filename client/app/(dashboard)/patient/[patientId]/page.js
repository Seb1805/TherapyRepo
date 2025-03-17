"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Capitalize, TlfSpacing } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PatientData() {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState({});
  const [addJournalButton, setAddJournalButton] = useState(false);
  const { register, handleSubmit, formState: { errors }} = useForm();
  const route = useRouter()

  const api = useApi();

  useEffect(() => {
    async function GetPatientData() {
      try {
        const responseData = await api.get(`patient/${patientId}`);
        setPatientData(() => responseData);
      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }

    GetPatientData();
  }, [patientId]);


  async function Submitfunction(data) {
    data = {...data, "patient": patientId}
    try {
      const response = await api.post("api/journal_entry", data);
      
      if(!response.ok) {
        console.log(`something went wrong: ${response.status}`);
      }
      route.refresh()
    } catch (error) {
      console.log(`Error with submit: ${error}`);
    }
  }


  function ShowAddingJournal() {
    return (
      <div className="xl:col-span-1 xl:row-span-2 col-span-full mt-12 md:mt-0">
      <form
        onSubmit={handleSubmit(Submitfunction)}
        className="flex flex-col gap-3"
      >
        <div>
          <label>diagnosis</label>
          <Input {...register("diagnosis", { required: true })} />
          {errors.email && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="grid">
          <label>notes</label>
          <textarea />
        </div>

        <div className="">
          <label>treatment</label>
          <Input {...register("treatment", { required: true })} />
          {errors.email && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="">
          <label>treatmentPlan</label>
          <Input {...register("treatmentPlan", { required: true })} />
          {errors.email && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="">
          <label>exerciseRecommendations</label>
        </div>

        <Button className="mt-4" type="submit">
          Opret journal note
        </Button>
      </form>
    </div>
    )
  }

  if (api.loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="px-2">
        <h1 className="text-3xl font-semibold">
          {Capitalize(patientData.firstName)} {Capitalize(patientData.lastName)}
        </h1>
        <section className="grid xl:grid-cols-[1fr_1fr_1fr] md:grid-cols-[auto_1fr] grid-cols-1 py-3 gap-x-6 md:gap-y-12">
          <div className="col-1">
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

            <h1>journal</h1> journal notes
          </section>
        </section>
      </div>
    );
  }
}
