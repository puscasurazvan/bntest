import { format } from "date-fns";

export const formatDate = (date: string | Date, dateFormat = "dd/MM/yyyy") => {
  if (!date) return undefined;

  const isDateString = typeof date === "string";
  if (isDateString) return format(new Date(date), dateFormat);

  return format(date, dateFormat);
};
