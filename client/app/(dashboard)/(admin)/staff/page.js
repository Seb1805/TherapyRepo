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