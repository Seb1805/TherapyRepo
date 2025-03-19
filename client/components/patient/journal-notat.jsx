import React from "react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Label } from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Capitalize } from "@/lib/utils";

export default function JournalNotat({journalEntry}) {

  return (
    <div className="w-full mb-12 shadow">
      <div className="text-gray-500 text-lg">
        <div className="font-size-lg">{Capitalize(journalEntry.diagnosis)}</div>
        <div className="text-sm">
          {format(journalEntry.date, "d MMMM. yyyy", { locale: da })}
        </div>
      </div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><Label>Behandling</Label></TableCell>
            <TableCell>{journalEntry.treatment}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Label>Behandlings plan</Label></TableCell>
            <TableCell>{journalEntry.treatmentPlan}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Label>Noter</Label></TableCell>
            <TableCell>{journalEntry.notes}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}


