import { TestBed } from '@angular/core/testing';
import { CustomDateParserFormatter } from './custom-date-parser-formatter.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


describe('CustomDateParserFormatter', () => {
  let formatter: CustomDateParserFormatter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomDateParserFormatter],
    });
    formatter = TestBed.inject(CustomDateParserFormatter);
  });

  describe('parse', () => {
    it('should parse a valid date string', () => {
      const dateString = '2023-03-15';
      const dateStruct = formatter.parse(dateString);
      expect(dateStruct).toEqual({ year: 2023, month: 3, day: 15 });
    });

    it('should return null for an invalid date string', () => {
      const dateString = 'invalid-date';
      const dateStruct = formatter.parse(dateString);
      expect(dateStruct).toBeNull();
    });

    it('should return null for an empty string', () => {
      const dateStruct = formatter.parse('');
      expect(dateStruct).toBeNull();
    });

    it('should return null for empty input', () => {
      const dateStruct = formatter.parse('');
      expect(dateStruct).toBeNull();
    });

    it('should parse date strings with leading zeros', () => {
      const dateString = '2023-03-05';
      const dateStruct = formatter.parse(dateString);
      expect(dateStruct).toEqual({ year: 2023, month: 3, day: 5 });
    });

    it('should parse date strings with extra whitespace', () => {
      const dateString = ' 2023-03-15 ';
      const dateStruct = formatter.parse(dateString);
      expect(dateStruct).toEqual({ year: 2023, month: 3, day: 15 });
    });
  });

  describe('format', () => {
    it('should format a valid date struct', () => {
      const dateStruct: NgbDateStruct = { year: 2023, month: 3, day: 15 };
      const dateString = formatter.format(dateStruct);
      expect(dateString).toBe('2023-03-15');
    });

    it('should return an empty string for null date', () => {
      const dateString = formatter.format(null);
      expect(dateString).toBe('');
    });

    it('should format date with single-digit month and day', () => {
      const dateStruct: NgbDateStruct = { year: 2023, month: 3, day: 5 };
      const dateString = formatter.format(dateStruct);
      expect(dateString).toBe('2023-03-05');
    });

    it('should format date with double-digit month and day', () => {
      const dateStruct: NgbDateStruct = { year: 2023, month: 12, day: 25 };
      const dateString = formatter.format(dateStruct);
      expect(dateString).toBe('2023-12-25');
    });
  });
});
