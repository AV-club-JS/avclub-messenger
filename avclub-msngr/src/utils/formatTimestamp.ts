export function formatTimestamp(timestampString: string): string {
    const timestamp = parseInt(timestampString, 10);
    if (isNaN(timestamp)) {
        return 'Invalid Date';
    }

    const date = new Date(timestamp);

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

export function formatTimestampWithTime(timestampString: string): string {
    const timestamp = parseInt(timestampString, 10);
    if (isNaN(timestamp)) {
        return 'Invalid Date';
    }

    const date = new Date(timestamp);

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}`;
}
