import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


/**
 * CustomDateParserFormatter provides a custom date parsing and formatting service
 * for NgbDatePicker, using the "yyyy-MM-dd" format.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {


    /**
   * Parses a string in "yyyy-MM-dd" format into an NgbDateStruct.
   * @param value - The date string to parse.
   * @returns An NgbDateStruct if parsing is successful, otherwise null.
   */
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 3) {
        return {
          year: parseInt(dateParts[0], 10),
          month: parseInt(dateParts[1], 10),
          day: parseInt(dateParts[2], 10),
        };
      }
    }
    return null;
  }


    /**
   * Formats an NgbDateStruct into a string in "yyyy-MM-dd" format.
   * @param date - The NgbDateStruct to format.
   * @returns A formatted date string or an empty string if the date is null.
   */
  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const month = date.month < 10 ? '0' + date.month : date.month;
    const day = date.day < 10 ? '0' + date.day : date.day;
    return `${date.year}-${month}-${day}`;
  }
}
