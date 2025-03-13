"use client";

import { DynamicTable } from "@/components/tables/dynamicTable";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";

export default function Economy() {
  const [invoices, setInvoice] = useState([]);
  const api = useApi()

  useEffect(() => {

    async function getData() {
      try {
        const data = await api.get("invoice");
        setInvoice(() => data);
      } catch (error) {
        throw new Error("fetching data failed");
      }
    }

    getData()
  }, []);

  
 if(api.loading) {
  return (
    <div className="w-full flex justify-center py-40">
      Loading
    </div>
  )
 } else {
  return (
    <div>
      <h1>økonomi</h1>
      <DynamicTable
        data={invoices}
        showFooter
        sumColumns={["amounts.subtotal","amounts.totalAmount"]} // Specify the columns to sum
        overwriteHeaders={[
          "invoiceNumber",
          "status",
          "amounts.subtotal",
          "amounts.totalAmount",
        ]}
      />
    </div>
  );
 }
}