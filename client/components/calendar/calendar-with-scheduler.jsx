"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { da } from "date-fns/locale";

import { Calendar } from "./calendar";
import { Scheduler } from "./scheduler";
import { Capitalize, cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";

// Enhanced sample events data with start and end times
export const events = [
  {
    id: 1,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Morten'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 10, 9).toISOString(),
    endTime: new Date(2025, 2, 10, 10, 30).toISOString(),
  },
  {
    id: 2,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Morten'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 12, 14).toISOString(),
    endTime: new Date(2025, 2, 12, 15).toISOString(),
  },
  {
    id: 3,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Morten'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 15, 12).toISOString(),
    endTime: new Date(2025, 2, 15, 13).toISOString(),
  },
  {
    id: 4,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Morten'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 18, 9).toISOString(),
    endTime: new Date(2025, 2, 18, 17).toISOString(),
  },
  {
    id: 5,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Thomas'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 18, 11,30).toISOString(),
    endTime: new Date(2025, 2, 18, 12, 30).toISOString(),
  },
  {
    id: 6,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Morten'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 25, 16).toISOString(),
    endTime: new Date(2025, 2, 25, 17).toISOString(),
  },
  {
    id: 7,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Thomas'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 28, 10).toISOString(),
    endTime: new Date(2025, 2, 28, 11).toISOString(),
  },
  {
    id: 7,
    type: 'reservation',
    therapistId: "234-213-4134",
    patientInfo: { firstName: 'Thomas'},
    therapistInfo: { email: 'user@example.com'},
    startTime: new Date(2025, 2, 5, 12).toISOString(),
    endTime: new Date(2025, 2, 5, 13, 30).toISOString(),
  },
]

// export const events = [
//   {
//     id: 1,
//     title: "Fod terapi - Martin ",
//     date: new Date(2025, 2, 10),
//     startTime: "09:00",
//     endTime: "10:30",
//     color: "bg-blue-500",
//   },
//   {
//     id: 2,
//     title: "Fysio terapi - Martin",
//     date: new Date(2025, 2, 12),
//     startTime: "14:00",
//     endTime: "15:00",
//     color: "bg-green-500",
//   },
//   {
//     id: 3,
//     title: "Ryg brækning - Peter",
//     date: new Date(2025, 2, 15),
//     startTime: "18:00",
//     endTime: "21:00",
//     color: "bg-purple-500",
//   },
//   {
//     id: 4,
//     title: "Kursus",
//     date: new Date(2025, 2, 18),
//     startTime: "09:00",
//     endTime: "17:00",
//     color: "bg-yellow-500",
//   },
//   {
//     id: 5,
//     title: "Pause",
//     date: new Date(2025, 2, 18),
//     startTime: "11:30",
//     endTime: "12:30",
//     color: "bg-red-500",
//   },
//   {
//     id: 6,
//     title: "Pause",
//     date: new Date(2025, 2, 25),
//     startTime: "16:00",
//     endTime: "17:00",
//     color: "bg-pink-500",
//   },
//   {
//     id: 7,
//     title: "Pause",
//     date: new Date(2025, 2, 28),
//     startTime: "10:00",
//     endTime: "11:00",
//     color: "bg-indigo-500",
//   },
//   {
//     id: 8,
//     title: "Pause",
//     date: new Date(2025, 2, 5),
//     startTime: "12:00",
//     endTime: "13:30",
//     color: "bg-orange-500",
//   },
// ];

export function CalendarWithScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredItems, setFilteredItems] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [eventsData, setEventsData] = useState(events);
  const api = useApi();

  useEffect(() => {
    async function fetchData() {
      try {
        const userdata = await api.get("user");
        setUsersData(() => userdata);

      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const listOfUserIds = usersData.map((user) => {
          return ({"_id": user["_id"]})
        })
        console.log(JSON.stringify(listOfUserIds));
        const appointmentData = await fetch("/api/appointment/users" , {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(listOfUserIds)
        })
        const data = await appointmentData.json()
        console.log(data);
        // setEventsData(() => data)

      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, [usersData]);

  function SubmitFilteredChanges(selectedFilter) {
    setFilteredItems(() => selectedFilter);
  }

  return (
    <div className={cn("grid gap-6", "lg:grid-cols-[2fr_minmax(400px,_1fr)]")}>
      <div className="border rounded-lg p-4 shadow-sm">
        <Calendar
          events={eventsData}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          filterOptions={usersData}
          filteredItems={filteredItems}
          setFilteredItems={setFilteredItems}
          SubmitFilteredChanges={SubmitFilteredChanges}
        />
      </div>
      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {Capitalize(
            format(selectedDate, "eee d. MMMM, yyyy", { locale: da })
          )}
        </h2>
        <Scheduler selectedDate={selectedDate} events={events} />
      </div>
    </div>
  );
}
