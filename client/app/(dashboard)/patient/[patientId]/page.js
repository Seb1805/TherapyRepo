'use client'
import { useEffect, useState } from "react"
import { useParams, usePathname } from 'next/navigation'
import { Capitalize } from "@/lib/utils"

export default function PatientData() {
  const {patientId} = useParams()
  const [userdata, setUserData] = useState()

  useEffect(() => {

    async function GetPatientData() {
      try {
        const response = fetch('', {
          method: "POST",
          body: new URLSearchParams({
            patientId: patientId,
          })
        })

        if (response.ok) {
          setUserData(() => response.data)
        }
      } catch (error) {
        
      }
    }

    console.log(patientId);
  }, [patientId])
  return (
    <div className="px-2">
      <h1 className="text-3xl font-semibold">{Capitalize("Firstname")} {Capitalize("Lastname")}</h1>
      <section className="grid grid-cols-3 py-3">
        <div className="col-1">
          <div className="grid grid-cols-[120px_1fr]">
            <label className="whitespace-nowrap col-1">Adresse</label>
            <label className="whitespace-nowrap col-1">Bøgeskovvej 234, 8260 Viby</label>
          </div>

          <div className="grid grid-cols-[120px_1fr]">
            <label className="whitespace-nowrap col-1">Telefon nr.</label>
            <label className="whitespace-nowrap col-1">11 22 33 44</label>
          </div>

          <div className="grid grid-cols-[120px_1fr]">
            <label className="whitespace-nowrap col-1">Email</label>
            <label className="whitespace-nowrap col-1">somemail@example.com</label>
          </div>

        </div>
        <div className="col-1">
          <div className="grid grid-cols-[120px_1fr]">
            <label className="whitespace-nowrap col-1">CPR nr.</label>
            <label className="whitespace-nowrap col-1">123456-1234</label>
          </div>
          <div className="grid grid-cols-[120px_1fr]">
            <label className="whitespace-nowrap col-1">Forsikring</label>
            <label className="whitespace-nowrap col-1">Tryg</label>
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
