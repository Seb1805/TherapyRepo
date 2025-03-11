"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Capitalize } from "@/lib/utils";
import { FaPen, FaTrashAlt } from "react-icons/fa";

export function DynamicTable({
  data = [],
  showFooter = false,
  overwriteHeaders = [],
  utils = false,
  sumColumns = []
}) {
  function OverwriteLayout() {
    let headerData = Object.keys(data[0]);
    if (overwriteHeaders.length > 0) {
      headerData = overwriteHeaders;
    }
  
    return headerData.map(header => {
      const keys = header.split(".");
      return keys[keys.length - 1];
    });
  }

  function GenerateHeaders() {
    let headerLayout = OverwriteLayout();
  
    return (
      <>
        {headerLayout.map((propertyName, index, rows) => {
          if (index + 1 === rows.length && !utils)
            return (
              <TableHead key={propertyName + index} className="text-right">
                {Capitalize(propertyName.replace(/([A-Z])/g, " $1").trim())}
              </TableHead>
            );
          else
            return (
              <TableHead key={propertyName + index}>
                {Capitalize(propertyName.replace(/([A-Z])/g, " $1").trim())}
              </TableHead>
            );
        })}
        {utils && <TableHead></TableHead>}
      </>
    );
  }

  function GenerateRows() {
    let dataLayout = OverwriteLayout();
  
    return data.map((dataEntity, index) => (
      <TableRow key={index}>
        {dataLayout.map((selectedProperty, index, rows) => {
          const keys = overwriteHeaders[index].split(".");
          let value = dataEntity;
          keys.forEach(key => {
            value = value[key];
          });
  
          if (index + 1 === rows.length && !utils)
            return (
              <TableCell key={selectedProperty + index} className="text-right">
                {value}
              </TableCell>
            );
          else
            return (
              <TableCell key={selectedProperty + index}>
                {value}
              </TableCell>
            );
        })}
        {utils && (
          <TableCell className="flex gap-1 justify-end">
            <div
              className="p-1.5 cursor-pointer hover:bg-gray-500/20 rounded-full"
              onClick={() => EditItem(dataEntity)}
            >
              <FaPen />
            </div>
            <div
              className="p-1.5 cursor-pointer hover:bg-gray-500/20 rounded-full"
              onClick={() => DeleteItem(dataEntity?.Id, dataEntity?.name)}
            >
              <FaTrashAlt color="red" />
            </div>
          </TableCell>
        )}
      </TableRow>
    ));
  }

  function CalculateTotal(columns) {
    return columns.reduce((totals, column) => {
      const keys = column.split(".");
      totals[column] = data.reduce((total, item) => {
        let value = item;
        keys.forEach(key => {
          value = value[key];
        });
        return total + parseFloat(value || 0);
      }, 0);
      return totals;
    }, {});
  }
  const totals = CalculateTotal(sumColumns);
  
  function DeleteItem(id, name) {
    if (confirm(`Er du sikker du vil slette ${name}?`) === true) {
      console.log("deleted");
    }
  }
  function EditItem() {}

  return data.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>{GenerateHeaders()}</TableRow>
      </TableHeader>
      <TableBody>{GenerateRows()}</TableBody>
      {showFooter && sumColumns.length > 0 && (
  <TableFooter>
    {Object.keys(totals).map((column, index) => (
      <TableRow key={index}>
        <TableCell colSpan={Object.keys(data[0]).length - 1}>
          Total for {Capitalize(column.split(".").pop().replace(/([A-Z])/g, " $1").trim())}
        </TableCell>
        <TableCell className="text-right">
          ${totals[column].toFixed(2)}
        </TableCell>
      </TableRow>
    ))}
  </TableFooter>
)}
    </Table>
  ) : (
    <p>cannot fetch data</p>
  );
}
