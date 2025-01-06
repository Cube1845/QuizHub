export class PaginatorOptions {
  rowsPerPage: number[];
  first: number;
  private _rows: number;
  totalItems: number;

  onRowsChange: () => void;

  constructor(
    pageNumber: number,
    rows: number,
    totalItems: number,
    rowsPerPage: number[],
    onRowsChange: () => void
  ) {
    this.first = rows * (pageNumber - 1);
    this._rows = rows;
    this.totalItems = totalItems;
    this.rowsPerPage = rowsPerPage;
    this.onRowsChange = onRowsChange;
  }

  get rows(): number {
    return this._rows;
  }

  set rows(value: number) {
    this._rows = value;
    this.onRowsChange();
  }

  setFirst(pageNumber: number): void {
    this.first = this._rows * (pageNumber - 1);
  }

  getLastPageNumberAfterAddition(): number {
    return Math.ceil((this.totalItems + 1) / this._rows);
  }
}
