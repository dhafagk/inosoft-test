import axios from 'axios';
import { createPinia, setActivePinia } from 'pinia';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInspectionStore } from '../inspectionStore';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockedGet = axios.get as Mock;

describe('useInspectionStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('initial state', () => {
        it('has correct defaults', () => {
            const store = useInspectionStore();
            expect(store.yards).toEqual([]);
            expect(store.customers).toEqual([]);
            expect(store.sowTemplates).toEqual([]);
            expect(store.items).toEqual([]);
            expect(store.inspectionRecords).toEqual([]);
            expect(store.isLoading).toBe(false);
            expect(store.isInitialized).toBe(false);
            expect(store.error).toBeNull();
        });
    });

    describe('getters', () => {
        it('getYardById returns matching yard', () => {
            const store = useInspectionStore();
            store.yards = [{ id: 'y1', name: 'Yard 1', code: 'Y1' }];
            expect(store.getYardById('y1')).toEqual({ id: 'y1', name: 'Yard 1', code: 'Y1' });
        });

        it('getYardById returns undefined for non-existent id', () => {
            const store = useInspectionStore();
            expect(store.getYardById('missing')).toBeUndefined();
        });

        it('getCustomerById returns matching customer', () => {
            const store = useInspectionStore();
            store.customers = [{ id: 'c1', name: 'Customer 1', code: 'C1' }];
            expect(store.getCustomerById('c1')?.name).toBe('Customer 1');
        });

        it('getSowTemplateById returns matching template', () => {
            const store = useInspectionStore();
            store.sowTemplates = [{ id: 't1', name: 'Template 1', works: [] }];
            expect(store.getSowTemplateById('t1')?.name).toBe('Template 1');
        });

        it('getItemById returns matching item', () => {
            const store = useInspectionStore();
            store.items = [
                {
                    id: 'i1',
                    item_code: 'IC1',
                    item_desc: 'Item 1',
                    item_type: 'pipe',
                    item_type_name: 'Pipe',
                    item_pipe_family: 'PF1',
                },
            ];
            expect(store.getItemById('i1')?.item_code).toBe('IC1');
        });

        it('getInspectionRecordByNo returns matching record', () => {
            const store = useInspectionStore();
            store.inspectionRecords = [{ id: '1', no: 'INS-001', status: 'New' }];
            expect(store.getInspectionRecordByNo('INS-001')?.status).toBe('New');
        });

        it('getInspectionRecordByNo returns undefined for non-existent no', () => {
            const store = useInspectionStore();
            expect(store.getInspectionRecordByNo('missing')).toBeUndefined();
        });
    });

    describe('addInspectionRecord', () => {
        it('prepends record to array', () => {
            const store = useInspectionStore();
            store.inspectionRecords = [{ id: '1', no: 'INS-001', status: 'New' }];
            store.addInspectionRecord({ id: '2', no: 'INS-002', status: 'Draft' });
            expect(store.inspectionRecords[0].no).toBe('INS-002');
            expect(store.inspectionRecords).toHaveLength(2);
        });
    });

    describe('updateInspectionRecord', () => {
        it('updates matching record', () => {
            const store = useInspectionStore();
            store.inspectionRecords = [{ id: '1', no: 'INS-001', status: 'New' }];
            store.updateInspectionRecord('INS-001', { status: 'Completed' });
            expect(store.inspectionRecords[0].status).toBe('Completed');
        });

        it('does nothing for non-existent no', () => {
            const store = useInspectionStore();
            store.inspectionRecords = [{ id: '1', no: 'INS-001', status: 'New' }];
            store.updateInspectionRecord('INS-999', { status: 'Completed' });
            expect(store.inspectionRecords[0].status).toBe('New');
        });
    });

    describe('resetStore', () => {
        it('resets all state', () => {
            const store = useInspectionStore();
            store.yards = [{ id: 'y1', name: 'Yard', code: 'Y' }];
            store.isInitialized = true;
            store.isLoading = true;
            store.error = 'some error';
            store.resetStore();
            expect(store.yards).toEqual([]);
            expect(store.isInitialized).toBe(false);
            expect(store.isLoading).toBe(false);
            expect(store.error).toBeNull();
        });
    });

    describe('fetch actions', () => {
        it('fetchYards populates yards from API', async () => {
            const store = useInspectionStore();
            const yardsData = [{ id: 'y1', name: 'Yard 1', code: 'Y1' }];
            mockedGet.mockResolvedValueOnce({ data: yardsData });

            await store.fetchYards();
            expect(mockedGet).toHaveBeenCalledWith('/api/inspection/yards');
            expect(store.yards).toEqual(yardsData);
        });

        it('fetchYards throws on error', async () => {
            const store = useInspectionStore();
            mockedGet.mockRejectedValueOnce(new Error('Network error'));

            await expect(store.fetchYards()).rejects.toThrow('Failed to fetch yards');
        });

        it('fetchCustomers populates customers', async () => {
            const store = useInspectionStore();
            mockedGet.mockResolvedValueOnce({ data: [{ id: 'c1', name: 'C1', code: 'CC' }] });

            await store.fetchCustomers();
            expect(store.customers).toHaveLength(1);
        });

        it('fetchInspectionRecords maps response data', async () => {
            const store = useInspectionStore();
            mockedGet.mockResolvedValueOnce({
                data: [{ id: '1', no: 'INS-001', status: 'New', customer: { name: 'Cust' } }],
            });

            await store.fetchInspectionRecords();
            expect(store.inspectionRecords[0]).toEqual({
                id: '1',
                no: 'INS-001',
                status: 'New',
                customer_name: 'Cust',
            });
        });
    });

    describe('initializeReferenceData', () => {
        it('skips if already initialized', async () => {
            const store = useInspectionStore();
            store.isInitialized = true;

            await store.initializeReferenceData();
            expect(mockedGet).not.toHaveBeenCalled();
        });

        it('sets isLoading during initialization', async () => {
            const store = useInspectionStore();
            mockedGet.mockResolvedValue({ data: [] });

            const promise = store.initializeReferenceData();
            expect(store.isLoading).toBe(true);

            await promise;
            expect(store.isLoading).toBe(false);
            expect(store.isInitialized).toBe(true);
        });

        it('sets error when initialization fails', async () => {
            const store = useInspectionStore();
            mockedGet.mockRejectedValue(new Error('Failed'));

            await store.initializeReferenceData();
            expect(store.isLoading).toBe(false);
        });
    });
});
