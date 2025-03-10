"use client"

import { isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

export function Scheduler({ selectedDate, events }) {
  // Filter events for the selected date
  const dayEvents = events.filter((event) => isSameDay(event.date, selectedDate))

  // Sort events by start time
  const sortedEvents = [...dayEvents].sort((a, b) => a.startTime.localeCompare(b.startTime))

  // Generate hours for the timeline (7 AM to 9 PM)
  const hours = Array.from({ length: 15 }, (_, i) => i + 7)

  // Calculate position and height for an event based on its time
  const getEventStyle = (event) => {
    const [startHour, startMinute] = event.startTime.split(":").map(Number)
    const [endHour, endMinute] = event.endTime.split(":").map(Number)

    const startPosition = (startHour - 7) * 60 + startMinute
    const endPosition = (endHour - 7) * 60 + endMinute
    const duration = endPosition - startPosition

    return {
      top: `${startPosition}px`,
      height: `${duration}px`,
    }
  }

  return (
    <div className="relative overflow-y-auto h-[90%]">
      {sortedEvents.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No events scheduled for this day</div>
      ) : (
        <div className="relative">
          {/* Time markers */}
          <div className="absolute left-0 top-0 w-12 h-full border-r border-border">
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute text-xs text-muted-foreground"
                style={{ top: `${(hour - 7) * 60}px` }}
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Hour lines */}
          <div className="ml-12 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute w-full border-t border-border/50"
                style={{ top: `${(hour - 7) * 60}px` }}
              />
            ))}

            {/* Events */}
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "absolute left-2 right-2 rounded p-2 overflow-hidden",
                  event.color,
                  event.color.includes("yellow") || event.color.includes("green") ? "text-black" : "text-white",
                )}
                style={getEventStyle(event)}
              >
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs opacity-90">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

