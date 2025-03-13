// import { DynamicTable } from '@/components/tables/dynamicTable'
// import React from 'react'

// const invoices = [
//   {
//     invoice: "INV001",
//     paymentStatus: "Paid",
//     totalAmount: "$250.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV002",
//     paymentStatus: "Pending",
//     totalAmount: "$150.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV003",
//     paymentStatus: "Unpaid",
//     totalAmount: "$350.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV004",
//     paymentStatus: "Paid",
//     totalAmount: "$450.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV005",
//     paymentStatus: "Paid",
//     totalAmount: "$550.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV006",
//     paymentStatus: "Pending",
//     totalAmount: "$200.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV007",
//     paymentStatus: "Unpaid",
//     totalAmount: "$300.00",
//     paymentMethod: "Credit Card",
//   },
// ];

// export default function Staff() {
//   return (
//     <div>
//       <h1>Medarbejdere</h1>
//       <DynamicTable
//               data={invoices}
//               showFooter
//               utils
//               overwriteHeaders={[
//                 "invoice",
//                 "paymentStatus",
//                 "paymentMethod",
//                 "totalAmount",
//               ]}
//             />
//     </div>
//   )
// }

"use client";

import { DynamicTable } from "@/components/tables/dynamicTable";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const api= useApi()

  useEffect(() => {
    async function getUsers() {
      try {
        const userdata = await api.get("user");
        setStaff(() => userdata);
      } catch (error) {
        throw new Error("fetching data failed");
      }
    }

    getUsers()
    // fetch("http://localhost:8000/user")
    //   .then(response => response.json())
    //   .then(data => {
    //     setStaff(data);
    //   })
    //   .catch(error => {
    //     console.error("There was an error fetching the staff data!", error);
    //   });
  }, []);

  if(api.loading) {
    return (
      <div>
        test
      </div>
    )
  } else {
    return (
      <div>
        <h1>Medarbejdere</h1>
        <DynamicTable
          data={staff}
          utils
          overwriteHeaders={[
            "email",
            "role",
            "firstName",
            "lastName",
            "phoneNumber"
          ]}
        />
      </div>
    );
  }
  
}