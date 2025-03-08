"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, format, getDay, getDaysInMonth, getISOWeek, isSameDay, subMonths } from "date-fns"
import { da } from 'date-fns/locale';

import { Button } from "@/components/ui/button"
import { CalendarDay } from "./calendar-day"
import { events } from "./calendar-with-scheduler"
import { Capitalize } from "@/lib/utils";


export function Calendar({ selectedDate, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysOfWeek = ["Man", "Tirs", "Ons", "Tors", "Fre", "Lør", "Søn"]
  const days = []

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  

  function RenderCalendarDays() {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)

    // change first day of week (0 = Monday, 6 = Sunday)
    const adjustedStartingDay = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1

    // Adds remaining days from previous month 
    const daysFromPreviousMonth = adjustedStartingDay
    const previousMonth = subMonths(currentMonth, 1)
    const daysInPreviousMonth = getDaysInMonth(previousMonth)
    CalendarDaysCalculation(adjustedStartingDay, new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1), daysInPreviousMonth - daysFromPreviousMonth)

    // Adds days from current month 
    CalendarDaysCalculation(getDaysInMonth(currentMonth), new Date(year, month, 1), 0, false)
    
    // Adds remaining days from next month 
    const totalDaysToShow = 42
    const daysFromNextMonth = totalDaysToShow - days.length
    const nextMonth = addMonths(currentMonth, 1)
    CalendarDaysCalculation(daysFromNextMonth, new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1), 0 )

    
    return days
  }

  function CalendarDaysCalculation(daysFromMonth, dateCalculateMissingDays, dayToCountFrom, currentMonth = true ) {
    for (let i = 1; i <= daysFromMonth; i++) {
      let day = dayToCountFrom + i;

      let date = dateCalculateMissingDays
      date.setDate(day)
      
      const dayEvents = events.filter((event) => isSameDay(event.date, date))
      const isSelected = isSameDay(date, selectedDate)
      const dayOfWeek = getDay(date)
      const isMonday = dayOfWeek === 1
      const weekNumber = isMonday ? getISOWeek(date) : undefined

      days.push(
        <CalendarDay
          key={`calendar-daynr-${days.length}`}
          day={day}
          events={dayEvents}
          isSelected={isSelected}
          isOutsideCurrentMonth={currentMonth}
          weekNumber={weekNumber}
          onSelect={() => onSelectDate(date)}
        />,
      )
    }
  }

  return (
    <div className="w-full">
      <section className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{Capitalize(format(currentMonth, "MMMM yyyy", {locale: da}))}</h2>
        <div className="flex gap-2">
          <Button variant="outline"  onClick={() => setCurrentMonth(new Date())}>I dag</Button>
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-7 gap-px">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center font-medium">
            {day}
          </div>
        ))}
        {RenderCalendarDays()}
      </div>
    </div>
  )
}

