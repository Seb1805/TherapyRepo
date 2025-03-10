import { format } from "date-fns";
import { da } from "date-fns/locale";

export default function JournalNote({ journalEntry }) {
  return (
    <div>
      <div className="text-gray-500 text-sm">
        <label>
          {format(journalEntry?.date, "d MMM. yyyy", { locale: da })}
        </label>
        <div className="flex">
          <label className="">user role</label>
          <label className="">user name</label>
          <label className="">klinik adresse</label>
        </div>
      </div>
      <div>
        <h2>jounral treatment</h2>
        {journalEntry?.exerciseRecommendations.length > 0 && (
          <>
            <p>exerciseRecommendations name</p>
            <ul>
              {journalEntry?.exerciseRecommendations.map((execise) => {
                <li>{execise.execiseInfo.name}</li>;
              })}
            </ul>
          </>
        )}
        <p>{journalEntry?.notes}</p>
        {journalEntry?.treatmentPlan.length > 0 && (
          <>
            <h3>Behandlingsplan</h3>
            <p>{journalEntry?.treatmentPlan}</p>
          </>
        )}
      </div>
    </div>
  );
}
