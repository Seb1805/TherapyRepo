'use client'
import { useEffect } from "react"
import { useParams, usePathname } from 'next/navigation'

export default function PatientData() {
  const {patientId} = useParams()

  useEffect(() => {

    async function GetPatientData() {
      try {
        const response = fetch('', {
          method: "POST",
          body: new URLSearchParams({
            patientId: patientId,
          })
        })
      } catch (error) {
        
      }
    }

    console.log(patientId);
  }, [patientId])
  return (
    <div>page</div>
  )
}
