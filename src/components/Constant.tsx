export const work = {
  on: 1,
  off: -1,
  reserved: 0,
};

export interface CLickEvents {
  detect: boolean;
  date: string;
}

export const getMonthUrlQuery = (yy: number, mm: number) => {
  if (mm > 12) {
    let addYear = 0;
    let gap = mm;

    while (gap > 12) {
      gap -= 12;
      addYear++;
    }
    mm = gap;
    yy += addYear;
  } else {
    mm++;
  }
  return `${yy.toString()}-${mm.toString()}`;
};
