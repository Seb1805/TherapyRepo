'use client'
import { useEffect, useState } from "react"
import { useParams, usePathname } from 'next/navigation'
import { Capitalize, TlfSpacing } from "@/lib/utils"
import { useApi } from "@/hooks/useApi"

export default function PatientData() {
  const {patientId} = useParams()
  const [patientData, setPatientData] = useState({})
  const api = useApi();

  useEffect(() => {

    async function GetPatientData() {
      try {
        const responseData = await api.get(`patient/${patientId}`)
        setPatientData(() => responseData);
      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }

    GetPatientData()
  }, [patientId])

  if(api.loading) {
    return (
      <div>
        loading
      </div>
    )
  }
  else {
    return (
      <div className="px-2">
        <h1 className="text-3xl font-semibold">{Capitalize(patientData.firstName)} {Capitalize(patientData.lastName)}</h1>
        <section className="grid xl:grid-cols-3 md:grid-cols-[auto_1fr] grid-cols-1 py-3 gap-x-6">
          <div className="col-1">
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Adresse</label>
              <label className="whitespace-nowrap col-1">{Capitalize(patientData.contactInfo.address)}, {Capitalize(patientData.contactInfo.city)}</label>
            </div>
  
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Telefon nr.</label>
              <label className="whitespace-nowrap col-1">{TlfSpacing(patientData.contactInfo.tlf)}</label>
            </div>
  
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Email</label>
              <label className="whitespace-nowrap col-1">{patientData.contactInfo.email}</label>
            </div>
  
          </div>
          <div className="col-1">
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">CPR nr.</label>
              <label className="whitespace-nowrap col-1">{patientData.cpr}</label>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <label className="whitespace-nowrap col-1">Forsikring</label>
              <label className="whitespace-nowrap col-1">{patientData.insurence?.name}</label>
            </div>
          </div>
        </section>
  
        <section className="py-3">
          journal
  
          journal notes
        </section>
      </div>
    )
  }
}
