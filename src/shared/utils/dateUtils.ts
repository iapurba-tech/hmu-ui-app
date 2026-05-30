/**
 * Formats a date string into DD/MM/YYYY format.
 *
 * @param dateString - The date string to format (e.g., "2023-10-27")
 * @returns Formatted date string (e.g., "27/10/2023") or '-' if invalid/empty
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "-";

  // Try to parse the date
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
