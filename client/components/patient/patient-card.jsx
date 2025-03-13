import React from 'react'
import { Card, CardContent } from '../ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Capitalize, TlfSpacing } from '@/lib/utils';

export default function PatientCard({patientData}) {
  const router = useRouter()
    
  return (
    <Link href={`/patient/${patientData._id}`}>
    <Card>
      <CardContent >
        <div>
          <h2 className="text-lg font-bold">{Capitalize(patientData.firstName)} {Capitalize(patientData.lastName)}</h2>
          <p>Adresse: {patientData.contactInfo.address}, {patientData.contactInfo.city}</p>
          <p>Tlf: {TlfSpacing(patientData.contactInfo.tlf)}</p>
          <p>email: {patientData.contactInfo.email}</p>
        </div>
        <div></div>
      </CardContent>
    </Card>
    </Link>
  )
}
