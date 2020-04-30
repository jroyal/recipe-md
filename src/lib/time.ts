import moment from "moment";

export function humanizeTime(dur: string) {
  return moment.duration(dur).humanize();
}
