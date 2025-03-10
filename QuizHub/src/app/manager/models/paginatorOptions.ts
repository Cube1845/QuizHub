export class PaginatorOptions {
  rowsPerPage: number[];
  first: number;
  rows: number;
  totalItems: number;

  constructor(
    pageNumber: number,
    rows: number,
    totalItems: number,
    rowsPerPage: number[]
  ) {
    this.first = rows * (pageNumber - 1);
    this.rows = rows;
    this.totalItems = totalItems;
    this.rowsPerPage = rowsPerPage;
  }

  setPage(pageNumber: number): void {
    this.first = this.rows * (pageNumber - 1);
  }

  getLastPageNumberAfterAddition(): number {
    return Math.ceil((this.totalItems + 1) / this.rows);
  }
}
