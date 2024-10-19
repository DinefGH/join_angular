import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
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

  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const month = date.month < 10 ? '0' + date.month : date.month;
    const day = date.day < 10 ? '0' + date.day : date.day;
    return `${date.year}-${month}-${day}`;
  }
}

