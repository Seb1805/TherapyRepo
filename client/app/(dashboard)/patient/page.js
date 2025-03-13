'use client'
import PatientCard from "@/components/patient/patient-card"
import { useApi } from "@/hooks/useApi"
import { useEffect } from "react"

export default function Patient() {

  return (
    <div>
      <PatientCard />
    </div>
  )
}
