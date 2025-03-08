"use client"

import { cn } from "@/lib/utils"

export function CalendarDay({
  day,
  events,
  date,
  isSelected,
  isOutsideCurrentMonth = false,
  weekNumber,
  onSelect,
}) {
  const maxEventsToShow = 3
  const hasMoreEvents = events.length > maxEventsToShow

  return (
    <div
      className={cn(
        "h-24 border border-border p-1 overflow-hidden cursor-pointer transition-colors relative",
        isSelected && "bg-primary/10 border-primary",
        isOutsideCurrentMonth && "bg-muted/30",
      )}
      onClick={onSelect}
    >
      {weekNumber !== undefined && (
        <div className="absolute top-1 left-1 bg-muted/50 text-muted-foreground text-xs rounded-sm px-1 font-medium">
          {weekNumber}
        </div>
      )}

      <div
        className={cn(
          "text-sm font-medium text-right mb-1",
          isSelected && "text-primary",
          isOutsideCurrentMonth && "text-muted-foreground",
          weekNumber !== undefined && "pl-6",
        )}
      >
        {day}
      </div>

      <div className="space-y-1">
        {events.slice(0, maxEventsToShow).map((event) => (
          <div
            key={event.id}
            className={cn(
              "text-xs px-2 py-0.5 rounded truncate",
              event.color,
              event.color.includes("yellow") || event.color.includes("green") ? "text-black" : "text-white",
            )}
          >
            {event.title}
          </div>
        ))}
        {hasMoreEvents && <div className="text-xs text-muted-foreground">+{events.length - maxEventsToShow} more</div>}
      </div>
    </div>
  )
}

