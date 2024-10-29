import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


/**
 * CustomDateParserFormatter provides custom parsing and formatting for dates in "dd/MM/yyyy" format
 * to be used with NgbDatePicker.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {


    /**
   * Parses a date string in "dd/MM/yyyy" format and converts it to an NgbDateStruct.
   * @param value - The date string to parse.
   * @returns An NgbDateStruct if parsing is successful, otherwise null.
   */
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 3) {
        return {
          day: parseInt(dateParts[0], 10),
          month: parseInt(dateParts[1], 10),
          year: parseInt(dateParts[2], 10),
        };
      }
    }
    return null;
  }


    /**
   * Formats an NgbDateStruct into a string in "dd/MM/yyyy" format.
   * @param date - The NgbDateStruct to format.
   * @returns A formatted date string, or an empty string if the date is null.
   */
  format(date: NgbDateStruct | null): string {
    return date ? `${this.pad(date.day)}/${this.pad(date.month)}/${date.year}` : '';
  }


    /**
   * Adds a leading zero to numbers less than 10 for consistent two-digit formatting.
   * @param number - The number to pad.
   * @returns A string with the number padded to two digits if needed.
   */
  private pad(number: number) {
    return number < 10 ? `0${number}` : number;
  }
}
