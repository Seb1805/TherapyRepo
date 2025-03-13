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
import { Capitalize, cn } from "@/lib/utils";
import { FaPen, FaTrashAlt } from "react-icons/fa";

export function DynamicTable({
  data = [],
  showFooter = false,
  overwriteHeaders = [],
  utils = false,
  sumColumns = [],
}) {
  function OverwriteLayout() {
    let headerData = Object.keys(data[0]);
    if (overwriteHeaders.length > 0) {
      headerData = overwriteHeaders;
    }

    // console.log(flattenObjectToArray(data[0]));[{key: 'amounts.totalAmount', value: 210}]

    // console.log(AccountForNestedData(headerData)); // ['invoiceNumber', 'status', 'totalAmount']
    return AccountForNestedData(headerData)
  }

  
  function flattenObjectToArray(obj, returnProperty) {
    const result = [];
    
    function traverse(current, path = '') {
      if (current === null || current === undefined) {
        result.push({ key: path, value: current });
        return;
      }
      
      // If it's an array, traverse each element with index in the path
      if (Array.isArray(current)) {
        for (let i = 0; i < current.length; i++) {
          const newPath = path ? `${path}[${i}]` : `[${i}]`;
          traverse(current[i], newPath);
        }
      } 
      // If it's an object, traverse each property
      else if (typeof current === 'object') {
        for (const key in current) {
          const newPath = path ? `${path}.${key}` : key;
          traverse(current[key], newPath);
        }
      } 
      // If it's a primitive value, add it to the result with its path
      else {
        result.push({ key: path, value: current });
      }
    }
    
    traverse(obj);
    if(returnProperty) return result.find((objec) => objec.key == returnProperty);
    else return result;
  }


  function AccountForNestedData(nestedData) {
    return nestedData.map((header) => {
      const property = header.split(".");
      return property[property.length - 1];
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
          keys.forEach((key) => {
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
              <TableCell key={selectedProperty + index}>{value}</TableCell>
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
        keys.forEach((key) => {
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


  const calculateColumnSum = (data, columnKey) => {
    return data.reduce((sum, row) => {
      const value = row[columnKey];
      // Only add if the value is a number
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  };


  function FlattenAndFindColumnValue(propertyName) {
    let sum = 0
    data.map((entity) => {
      const temp = flattenObjectToArray(entity, propertyName)
      sum += temp.value
    })
    return sum
  }

  return data.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>{GenerateHeaders()}</TableRow>
      </TableHeader>
      <TableBody>{GenerateRows()}</TableBody>
      {sumColumns.length > 0 && (
        <TableFooter>
          <TableRow>
            {overwriteHeaders.map((Title, index, rows) => {
              if(index === 0 ) {
                return (<TableCell key={`footer-${index}`} className="font-medium col-span-1">Total</TableCell>)
              }
              return (
                <TableCell key={`footer-${index}`} className={cn("", rows.length - 1 == index && "text-right")}>
                    {sumColumns.includes(Title) ? FlattenAndFindColumnValue(Title) : ""}
                </TableCell>
              )
                
        
              
            })}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  ) : (
    <p>cannot fetch data</p>
  );
}
