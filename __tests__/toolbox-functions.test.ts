import { Timestamp } from 'firebase/firestore';
import { emptyContact, isDatePassed, isDateSoon, getUniqueSortedValues } from '@/app/utils/toolbox';

// isDatePassed
describe('Toolbox function : isDatePassed => Should returns True or False depending on whether the date is in the past.', () => {
  it('should returns True (date is one year in the past)', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1); // set to one year in the past
    const pastTimestamp = Timestamp.fromMillis(pastDate.getTime());
    expect(isDatePassed(pastTimestamp)).toBe(true);
  });
  it('should returns False (date is one year in the future)', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // set to one year in the future
    const futureTimestamp = Timestamp.fromMillis(futureDate.getTime());
    expect(isDatePassed(futureTimestamp)).toBe(false);
  });
  it('should returns True (date is one minute in the past)', () => {
    expect(isDatePassed(Timestamp.fromMillis(Date.now() - 60 * 1000))).toBe(true)
  });
  it('should returns False (date is one minute in the future)', () => {
    expect(isDatePassed(Timestamp.fromMillis(Date.now() + 60 * 1000))).toBe(false)
  });
  it ('should returns True (date is yesterday)', () => {
      expect(isDatePassed(Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000))).toBe(true)
  })
  it ('should returns False (date is tomorrow)', () => {
      expect(isDatePassed(Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000))).toBe(false)
  })
});

// isDateSoon
describe('Toolbox function : isDateSoon => Should returns True or False depending on whether the date is in the next week.', () => {
  it ('should returns True (date is tomorrow)', () => {
      expect(isDateSoon(Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000))).toBe(true)
  })
  it ('should returns False (date is today)', () => {
      expect(isDateSoon(Timestamp.fromMillis(Date.now()))).toBe(false)
  })
  it ('should returns True (date is in 6 days)', () => {
      expect(isDateSoon(Timestamp.fromMillis(Date.now() + 6 * 24 * 60 * 60 * 1000))).toBe(true)
  })
  it ('should returns False (date is in 8 days)', () => {
      expect(isDateSoon(Timestamp.fromMillis(Date.now() + 8 * 24 * 60 * 60 * 1000))).toBe(false)
  })
  it ('should returns True (date is in 7 days)', () => {
      expect(isDateSoon(Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000))).toBe(true)
  })
  it ('should returns False (date is in 14 days)', () => {
      expect(isDateSoon(Timestamp.fromMillis(Date.now() + 14 * 24 * 60 * 60 * 1000))).toBe(false)
  })
  it ('should returns Flase (date is yesterday)', () => {
      expect(isDateSoon(Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000))).toBe(false)
  })
})

// getUniqueSortedValues
describe('getUniqueSortedValues', () => {
  const contacts = [
    {...emptyContact, businessName: 'Alice'},
    {...emptyContact, businessName: 'alice'},
    {...emptyContact, businessName: 'Nicolas'},
    {...emptyContact, businessName: 'Carine'},
    {...emptyContact, businessName: 'nico'},
    {...emptyContact, businessName: 'Nicolas'},
  ];

  it('should return unique sorted values case sensitive', () => {
    const uniqueSortedValues = getUniqueSortedValues(contacts, 'businessName');
    expect(uniqueSortedValues).toEqual([
      { value: 'Alice', count: 1 },
      { value: 'Carine', count: 1 },
      { value: 'Nicolas', count: 2 },
      { value: 'alice', count: 1 },
      { value: 'nico', count: 1 },
    ]);
  });
  it('should return unique sorted values not case insensitive', () => {
    const uniqueSortedValues = getUniqueSortedValues(contacts, 'businessName', false);
    expect(uniqueSortedValues).toEqual([
      { value: 'ALICE', count: 2 },
      { value: 'CARINE', count: 1 },
      { value: 'NICO', count: 1 },
      { value: 'NICOLAS', count: 2 },
    ]);
  });

  
});
