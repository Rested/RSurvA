import { format, parseISO } from "date-fns";

export const convertUTCToLocal = (utcDateStr) => {
    const parsedDate = parseISO(utcDateStr); // Parse the UTC date string
    return format(parsedDate, "PPpp");       // Format the date in a human-readable way
};
