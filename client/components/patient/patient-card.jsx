import { useApi } from '@/hooks/useApi';
import React, { useEffect } from 'react'

export default function PatientCard() {
    const api = useApi()
  
    useEffect(() => {
      async function getData() {
        try {
          const responseData = await api.get("user/users_by_clinic")
          console.log(responseData);
        } catch (error) {
          console.log("Failed to fetch data:", error);
        }
      }

      getData();
    }, [])
  return (
    <div>patient-card</div>
  )
}
