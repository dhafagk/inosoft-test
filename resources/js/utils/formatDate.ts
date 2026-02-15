export function formatDate(timestamp?: number | null): string {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
    });
}
