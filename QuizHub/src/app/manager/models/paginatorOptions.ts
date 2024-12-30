export class PaginatorOptions {
  rowsPerPage: number[];
  first: number;
  rows: number;
  totalItems: number;

  constructor(
    first: number,
    rows: number,
    totalItems: number,
    rowsPerPage: number[]
  ) {
    this.first = first;
    this.rows = rows;
    this.totalItems = totalItems;
    this.rowsPerPage = rowsPerPage;
  }

  setFirst(pageNumber: number): void {
    this.first = this.rows * pageNumber;
  }
}
