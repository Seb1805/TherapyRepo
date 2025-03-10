'use client'
import { useEffect, useState } from "react"
import { useParams, usePathname } from 'next/navigation'

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
    <div>
      <h1>firstname lastname</h1>
      <section className="flex">
        <div>
          <div className="flex flex-nowrap">
            <label className="whitespace-nowrap">address</label>
          </div>
          <div>
            <label className="whitespace-nowrap">telefon nr.</label>
          </div>
          <div>
          <label className="whitespace-nowrap">email</label>
          </div>
        </div>
        <div>
          <div>
            <label className="whitespace-nowrap">CPR nr.</label>
          </div>
        </div>
      </section>

      <section>
        journal
        journal notes
      </section>
    </div>
  )
}
