import type { ExcelSheet } from "../types";

interface ExportRowsToExcelParams<Row extends object = Record<string, string | number>> {
  rows: Row[];
  fileName: string;
  sheetName?: string;
}

interface ExportWorkbookToExcelParams {
  sheets: ExcelSheet<object>[];
  fileName: string;
}

const loadExcelDependencies = async () => {
  const [xlsxModule, fileSaverModule] = await Promise.all([import("xlsx"), import("file-saver")]);
  return {
    XLSX: xlsxModule,
    saveAs: fileSaverModule.saveAs,
  };
};

const buildWorkbook = (XLSX: typeof import("xlsx"), sheets: ExcelSheet<object>[]) => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });

  return workbook;
};

const downloadWorkbook = async (workbook: import("xlsx").WorkBook, fileName: string) => {
  const { XLSX, saveAs } = await loadExcelDependencies();
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

export const exportRowsToExcel = async <Row extends object>({
  rows,
  fileName,
  sheetName = "Herramientas",
}: ExportRowsToExcelParams<Row>): Promise<void> => {
  const { XLSX } = await loadExcelDependencies();
  const workbook = buildWorkbook(XLSX, [{ name: sheetName, rows }]);
  await downloadWorkbook(workbook, fileName);
};

export const exportWorkbookToExcel = async ({ sheets, fileName }: ExportWorkbookToExcelParams): Promise<void> => {
  const { XLSX } = await loadExcelDependencies();
  const workbook = buildWorkbook(XLSX, sheets);
  await downloadWorkbook(workbook, fileName);
};
