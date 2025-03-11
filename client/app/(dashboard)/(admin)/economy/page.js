// import { DynamicTable } from "@/components/tables/dynamicTable";
// import React from "react";

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

// export default function Economy() {
//   return (
//     <div>
//       <h1>økonomi</h1>
//       <DynamicTable
//         data={invoices}
//         showFooter
//         //sumColumns="salary,bonus" // Specify the columns to sum
//         sumColumns="totalAmount"
//         overwriteHeaders={[
//           "invoice",
//           "paymentStatus",
//           "paymentMethod",
//           "totalAmount",
          
//         ]}
//       />
//     </div>
//   );
// }



"use client";

import { DynamicTable } from "@/components/tables/dynamicTable";
import React, { useEffect, useState } from "react";

export default function Economy() {
  const [invoices, setInvoice] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/invoice")
      .then(response => response.json())
      .then(data => {
        setInvoice(data);
      })
      .catch(error => {
        console.error("There was an error fetching the staff data!", error);
      });
  }, []);

  
  return (
    <div>
      <h1>økonomi</h1>
      <DynamicTable
        data={invoices}
        showFooter
        //sumColumns={["salary", "bonus"]} // Specify the columns to sum
        sumColumns={["amounts.totalAmount"]}
        overwriteHeaders={[
          "invoiceNumber",
          "status",
          
          "totalAmount",
          
        ]}
      />
    </div>
  );
}