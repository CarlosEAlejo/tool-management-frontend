import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { ToolReportRow } from "../types";

interface ExportRowsToExcelParams {
  rows: ToolReportRow[];
  fileName: string;
  sheetName?: string;
}

export const exportRowsToExcel = ({ rows, fileName, sheetName = "Herramientas" }: ExportRowsToExcelParams): void => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }),
    `${fileName}.xlsx`
  );
};
