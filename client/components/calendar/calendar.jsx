"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  getISOWeek,
  isSameDay,
  subMonths,
} from "date-fns";
import { da } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { CalendarDay } from "./calendar-day";
import { Capitalize } from "@/lib/utils";
import CalendarAddEventDialog from "./calendar-add-event-dialog";
import FilterButton from "../dialog/filter-button";

export function Calendar({
  users,
  events,
  selectedDate,
  onSelectDate,
  filterOptions,
  filteredItems,
  SubmitFilteredChanges,
}) {
  const [reservationData, setReservationData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [filteredItems, setFilteredItems] = useState([])

  const daysOfWeek = ["Man", "Tirs", "Ons", "Tors", "Fre", "Lør", "Søn"];
  const days = [];

  function handlePreviousMonth() {
    setCurrentMonth(subMonths(currentMonth, 1));
  }

  function handleNextMonth() {
    setCurrentMonth(addMonths(currentMonth, 1));
  }

  function HandleToday() {
    onSelectDate(() => new Date());
    setCurrentMonth(() => new Date());
  }

  function HandleReservationCreation(newReservation) {
    setReservationData(() => newReservation);
  }

  function RenderCalendarDays() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);

    // change first day of week (0 = Monday, 6 = Sunday)
    const adjustedStartingDay =
      getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;

    // Adds remaining days from previous month
    const daysFromPreviousMonth = adjustedStartingDay;
    const previousMonth = subMonths(currentMonth, 1);
    const daysInPreviousMonth = getDaysInMonth(previousMonth);
    CalendarDaysCalculation(
      adjustedStartingDay,
      new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
      daysInPreviousMonth - daysFromPreviousMonth
    );

    // Adds days from current month
    CalendarDaysCalculation(
      getDaysInMonth(currentMonth),
      new Date(year, month, 1),
      0,
      false
    );

    // Adds remaining days from next month
    const totalDaysToShow = 42;
    const daysFromNextMonth = totalDaysToShow - days.length;
    const nextMonth = addMonths(currentMonth, 1);
    CalendarDaysCalculation(
      daysFromNextMonth,
      new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1),
      0
    );

    return days;
  }

  function CalendarDaysCalculation(
    daysFromMonth,
    dateCalculateMissingDays,
    dayToCountFrom,
    currentMonth = true
  ) {
    for (let i = 1; i <= daysFromMonth; i++) {
      const day = dayToCountFrom + i;

      const date = new Date(
        dateCalculateMissingDays.getFullYear(),
        dateCalculateMissingDays.getMonth(),
        day
      );

      const dayEvents = events.filter((event) => isSameDay(new Date(event.startTime), date));
      const isSelected = isSameDay(date, selectedDate);
      const dayOfWeek = getDay(date);
      const isMonday = dayOfWeek === 1;
      const weekNumber = isMonday ? getISOWeek(date) : undefined;

      if (isSelected) {
        days.push(
          <CalendarDay
            key={`calendar-daynr-${days.length}`}
            day={day}
            events={dayEvents}
            isSelected={isSelected}
            isOutsideCurrentMonth={currentMonth}
            weekNumber={weekNumber}
            onSelect={() => onSelectDate(date)}
          />
        );
      } else {
        days.push(
          <CalendarAddEventDialog
            key={`event-daynr-${days.length}`}
            selectedDate={selectedDate}
            newReservation
            reservationData={reservationData}
            changeReservationData={setReservationData}
          >
            <CalendarDay
              key={`calendar-daynr-${days.length}`}
              day={day}
              events={dayEvents}
              isSelected={isSelected}
              isOutsideCurrentMonth={currentMonth}
              weekNumber={weekNumber}
              onSelect={() => onSelectDate(date)}
            />
          </CalendarAddEventDialog>
        );
      }
    }
  }

  return (
    <div className="w-full">
      <section className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold whitespace-nowrap pr-2">
          {Capitalize(format(currentMonth, "MMMM yyyy", { locale: da }))}
        </h2>
        <div className="flex justify-end flex-wrap md:flex-nowrap gap-2">
          <CalendarAddEventDialog
            users={users}
            selectedDate={selectedDate}
            newReservation
            reservationData={reservationData}
            changeReservationData={setReservationData}
          >
            <Button>Tilføj Reservation</Button>
          </CalendarAddEventDialog>
          <div className="flex gap-2">
            <FilterButton
              filterOptions={filterOptions}
              selectedOptions={filteredItems}
              SubmitFilteredChanges={SubmitFilteredChanges}
            />
            <Button variant="outline" onClick={HandleToday}>
              I dag
            </Button>
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
  );
}
