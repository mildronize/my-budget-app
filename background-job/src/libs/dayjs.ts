import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { env } from '../env';

dayjs.extend(utc);
dayjs.extend(timezone);

const defaultTimezone = env.TIMEZONE;

export function dayjsUTC(date?: dayjs.ConfigType) {
  return dayjs(date).utc();
}

export function dateTimeString(date?: dayjs.ConfigType) {
  return dayjs(date).format('MM/DD/YYYY HH:mm:ss');
}

export function dateString(date?: dayjs.ConfigType) {
  return dayjs(date).format('MM/DD/YYYY');
}

export function dateTimezone(date?: dayjs.ConfigType) {
  return dayjsUTC(date).tz(defaultTimezone);
}

export function dateStringTimezone(date?: dayjs.ConfigType) {
  return dayjsUTC(date).tz(defaultTimezone).format('MM/DD/YYYY');
}

export function dateTimeStringTimezone(date?: dayjs.ConfigType) {
  return dayjsUTC(date).tz(defaultTimezone).format('MM/DD/YYYY HH:mm:ss');
}

