import { CalendarWithScheduler } from "@/components/calendar/calendar-with-scheduler";


export const metadata = {
  title: {
    template: "%s | Terapi App",
    default: 'Terapi App'
  },
  description: "Made by Sebastian & Frank",
  metadataBase: new URL('http://localhost:3000')
};

export default function Kalender() {
  return (
    <div className="flex justify-center">
      <div className="container py-4">
        <CalendarWithScheduler />
      </div>
    </div>
  )
}
