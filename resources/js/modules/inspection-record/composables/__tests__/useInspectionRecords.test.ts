import axios from 'axios';
import { type Mock, describe, expect, it, vi, beforeEach } from 'vitest';
import { useInspectionRecords } from '../useInspectionRecords';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockedGet = axios.get as Mock;

describe('useInspectionRecords', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('formatDate / transformRecord', () => {
        it('transforms a record correctly', () => {
            const { transformRecord } = useInspectionRecords();

            const record = {
                id: 'abc123',
                no: 'INS-001',
                status: 'New',
                yard_name: 'Yard A',
                type: 'Regular',
                create_date: 1700000000,
                ecd: '2026-03-01',
                link_to: 'LINK-1',
                tpi_name: 'TPI Co',
                progress: 75,
                customer: { name: 'Customer A', customer: 'C1' },
                items_raw: [{ item_desc: 'Pipe A', owned_name: 'Owner 1', batch: 'B1', qty: 10 }],
            };

            const result = transformRecord(record, 0);
            expect(result.requestNo).toBe('INS-001');
            expect(result.location).toBe('Yard A');
            expect(result.scopeOfWork).toBe('Customer A');
            expect(result.type).toBe('Regular');
            expect(result.dateSubmitted).toBe('2023-11-14');
            expect(result.ecd).toBe('2026-03-01');
            expect(result.relatedTo).toBe('LINK-1');
            expect(result.thirdParty).toBe('TPI Co');
            expect(result.status).toBe('New');
            expect(result.subItems).toHaveLength(1);
            expect(result.subItems[0].itemDescription).toBe('Pipe A');
            expect(result.subItems[0].progress).toBe('75%');
        });

        it('handles missing optional fields gracefully', () => {
            const { transformRecord } = useInspectionRecords();

            const result = transformRecord({ id: '', no: '', status: '' }, 0);
            expect(result.requestNo).toBe('');
            expect(result.location).toBe('');
            expect(result.thirdParty).toBe('-');
            expect(result.dateSubmitted).toBe('');
            expect(result.subItems).toEqual([]);
        });
    });

    describe('status filtering', () => {
        it('openRecords filters New, In Progress, Draft', () => {
            const { records, openRecords } = useInspectionRecords();
            records.value = [
                { id: '1', no: 'A', status: 'New' },
                { id: '2', no: 'B', status: 'In Progress' },
                { id: '3', no: 'C', status: 'Draft' },
                { id: '4', no: 'D', status: 'Completed' },
                { id: '5', no: 'E', status: 'Ready to Review' },
            ];
            expect(openRecords.value).toHaveLength(3);
            expect(openRecords.value.map((r) => r.requestNo)).toEqual(['A', 'B', 'C']);
        });

        it('forReviewRecords filters Ready to Review', () => {
            const { records, forReviewRecords } = useInspectionRecords();
            records.value = [
                { id: '1', no: 'A', status: 'New' },
                { id: '2', no: 'B', status: 'Ready to Review' },
            ];
            expect(forReviewRecords.value).toHaveLength(1);
            expect(forReviewRecords.value[0].requestNo).toBe('B');
        });

        it('completedRecords filters Completed', () => {
            const { records, completedRecords } = useInspectionRecords();
            records.value = [
                { id: '1', no: 'A', status: 'Completed' },
                { id: '2', no: 'B', status: 'New' },
            ];
            expect(completedRecords.value).toHaveLength(1);
        });
    });

    describe('fetchRecords', () => {
        it('fetches records from API', async () => {
            mockedGet.mockResolvedValueOnce({
                data: [{ id: '1', no: 'INS-001', status: 'New' }],
            });

            const { records, fetchRecords } = useInspectionRecords();
            await fetchRecords();

            expect(mockedGet).toHaveBeenCalledWith('/api/inspection');
            expect(records.value).toHaveLength(1);
        });

        it('passes status parameter to API', async () => {
            mockedGet.mockResolvedValueOnce({ data: [] });

            const { fetchRecords } = useInspectionRecords();
            await fetchRecords('New');

            expect(mockedGet).toHaveBeenCalledWith('/api/inspection?status=New');
        });

        it('sets error on failure', async () => {
            mockedGet.mockRejectedValueOnce(new Error('Network error'));

            const { error, fetchRecords } = useInspectionRecords();
            await fetchRecords();

            expect(error.value).toBe('Network error');
        });
    });
});
