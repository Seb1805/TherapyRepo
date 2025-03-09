"use client"

import { useState } from "react"
import { format } from "date-fns"
import { da } from 'date-fns/locale';

import { Calendar } from "./calendar"
import { Scheduler } from "./scheduler"
import { Capitalize, cn } from "@/lib/utils"

// Enhanced sample events data with start and end times
export const events = [
  {
    id: 1,
    title: "Fod terapi - Martin ",
    date: new Date(2025, 2, 10),
    startTime: "09:00",
    endTime: "10:30",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Fysio terapi - Martin",
    date: new Date(2025, 2, 12),
    startTime: "14:00",
    endTime: "15:00",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Ryg brækning - Peter",
    date: new Date(2025, 2, 15),
    startTime: "18:00",
    endTime: "21:00",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Kursus",
    date: new Date(2025, 2, 18),
    startTime: "09:00",
    endTime: "17:00",
    color: "bg-yellow-500",
  },
  {
    id: 5,
    title: "Pause",
    date: new Date(2025, 2, 18),
    startTime: "11:30",
    endTime: "12:30",
    color: "bg-red-500",
  },
  {
    id: 6,
    title: "Pause",
    date: new Date(2025, 2, 25),
    startTime: "16:00",
    endTime: "17:00",
    color: "bg-pink-500",
  },
  {
    id: 7,
    title: "Pause",
    date: new Date(2025, 2, 28),
    startTime: "10:00",
    endTime: "11:00",
    color: "bg-indigo-500",
  },
  {
    id: 8,
    title: "Pause",
    date: new Date(2025, 2, 5),
    startTime: "12:00",
    endTime: "13:30",
    color: "bg-orange-500",
  },
]

export function CalendarWithScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className={cn("grid gap-6", "lg:grid-cols-[2fr_minmax(400px,_1fr)]")}>
      <div className="border rounded-lg p-4 shadow-sm">
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>
      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{Capitalize(format(selectedDate, 'eee d. MMMM, yyyy', { locale: da }))}</h2>
        <Scheduler selectedDate={selectedDate} events={events} />
      </div>
    </div>
  )
}

