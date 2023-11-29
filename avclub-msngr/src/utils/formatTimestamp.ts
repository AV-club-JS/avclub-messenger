export function formatTimestamp(timestampString: string): string {
    const timestamp = parseInt(timestampString, 10); // Assuming the timestamp is an integer, use parseFloat for a floating-point timestamp
    if (isNaN(timestamp)) {
        return 'Invalid Date';
    }

    const date = new Date(timestamp);

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}