import moment from "moment";



export const secondsPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asSeconds());
  return hoursPastAmount;
}

export const minutesPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asMinutes());
  return hoursPastAmount;
}

export const hoursPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asHours());
  return hoursPastAmount;
}

export const daysPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asDays());
  return hoursPastAmount;
}

export const weeksPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asWeeks());
  return hoursPastAmount;
}

export const monthsPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asMonths());
  return hoursPastAmount;
}

export const yearsPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asYears());
  return hoursPastAmount;
}