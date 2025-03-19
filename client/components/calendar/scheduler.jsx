"use client"

import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

export function Scheduler({ selectedDate, events }) {
  const dayEvents = events.filter((event) => isSameDay(new Date(event.startTime), selectedDate))

  
  const sortedEvents = [...dayEvents].sort((a, b) => a.startTime.localeCompare(b.startTime))

  const hours = Array.from({ length: 15 }, (_, i) => i + 7)

  const getEventStyle = (event) => {

    const startHour = new Date(event.startTime).getHours()
    const startMinute = new Date(event.startTime).getMinutes()
    const endHour = new Date(event.endTime).getHours()
    const endMinute = new Date(event.endTime).getMinutes()

    const startPosition = (startHour - 7) * 60 + startMinute
    const endPosition = (endHour - 7) * 60 + endMinute
    const duration = endPosition - startPosition

    return {
      top: `${startPosition}px`,
      height: `${duration}px`,
    }
  }

  return (
    <div className="relative overflow-y-auto lg:h-[93%] h-[60dvh]">
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
                  "absolute left-2 right-2 rounded p-2 overflow-hidden bg-blue-600 border text-white",
                  // event.color,
                  // event.color.includes("yellow") || event.color.includes("green") ? "text-black" : "text-white",
                )}
                style={getEventStyle(event)}
              >
                <div className="font-medium text-sm">{`${event.type} - ${event.patientInfo.firstName}`}</div>
                <div className="text-xs opacity-90">
                  {format(new Date(event.startTime), "H:mm")} - {format(new Date(event.endTime), "H:mm")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

