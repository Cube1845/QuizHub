export class PaginatorOptions {
  rowsPerPage: number[];
  first: number;
  rows: number;
  totalItems: number;

  constructor(
    page: number,
    rows: number,
    totalItems: number,
    rowsPerPage: number[]
  ) {
    this.first = rows * page;
    this.rows = rows;
    this.totalItems = totalItems;
    this.rowsPerPage = rowsPerPage;
  }

  setFirst(pageNumber: number): void {
    this.first = this.rows * pageNumber;
  }

  getLastPageNumberAfterAddition(): number {
    return Math.ceil((this.totalItems + 1) / this.rows);
  }
}
