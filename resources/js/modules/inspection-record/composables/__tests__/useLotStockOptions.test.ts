import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import type { OrderItemFormValues } from '../../schemas/inspection.schema';
import { useLotStockOptions } from '../useLotStockOptions';

// Mock useItemStock to avoid real API calls
vi.mock('../useItemStock', () => ({
    useItemStock: vi.fn(() => ({
        stockRecords: ref([
            { batch: 'B1', allocation: 'A1', owned: 'O1', owned_name: 'Owner 1', condition: 'new', available_qty: 100 },
            { batch: 'B1', allocation: 'A1', owned: 'O2', owned_name: 'Owner 2', condition: 'used', available_qty: 50 },
            { batch: 'B1', allocation: 'A2', owned: 'O1', owned_name: 'Owner 1', condition: 'new', available_qty: 75 },
            { batch: 'B2', allocation: 'A1', owned: 'O1', owned_name: 'Owner 1', condition: 'new', available_qty: 200 },
        ]),
        isLoading: ref(false),
        error: ref(null),
        fetchStock: vi.fn(),
        batchOptions: ref([]),
        allocationOptions: ref([]),
        ownerOptions: ref([]),
        conditionOptions: ref([]),
        availableQuantity: ref(0),
    })),
}));

function makeItems(overrides: Partial<OrderItemFormValues['lots'][0]> = {}): OrderItemFormValues[] {
    return [
        {
            id_item: 'item-1',
            item_code: 'IC-001',
            item_desc: 'Test Item',
            item_type: 'pipe',
            item_type_name: 'Pipe',
            item_pipe_family: 'PF1',
            qty: 5,
            expanded: false,
            lots: [
                {
                    batch: '',
                    allocation: '',
                    owned: '',
                    owned_name: '',
                    condition: '',
                    available_qty: 0,
                    qty: 1,
                    inspection_required: true,
                    ...overrides,
                },
            ],
        },
    ];
}

describe('useLotStockOptions', () => {
    let emit: (event: string, ...args: any[]) => void;

    beforeEach(() => {
        emit = vi.fn() as unknown as (event: string, ...args: any[]) => void;
    });

    describe('getLotStockOptions', () => {
        it('returns all batch options', () => {
            const items = ref(makeItems());
            const { getLotStockOptions } = useLotStockOptions(items, emit);

            const options = getLotStockOptions(0, 0);
            expect(options.batchOptions).toEqual([
                { label: 'B1', value: 'B1' },
                { label: 'B2', value: 'B2' },
            ]);
        });

        it('filters allocation options by batch', () => {
            const items = ref(makeItems({ batch: 'B1' }));
            const { getLotStockOptions } = useLotStockOptions(items, emit);

            const options = getLotStockOptions(0, 0);
            expect(options.allocationOptions).toEqual([
                { label: 'A1', value: 'A1' },
                { label: 'A2', value: 'A2' },
            ]);
        });

        it('filters owner options by batch + allocation', () => {
            const items = ref(makeItems({ batch: 'B1', allocation: 'A1' }));
            const { getLotStockOptions } = useLotStockOptions(items, emit);

            const options = getLotStockOptions(0, 0);
            expect(options.ownerOptions).toHaveLength(2);
            expect(options.ownerOptions[0]).toEqual({ label: 'Owner 1', value: 'O1' });
        });

        it('filters condition options by batch + allocation + owner', () => {
            const items = ref(makeItems({ batch: 'B1', allocation: 'A1', owned: 'O1' }));
            const { getLotStockOptions } = useLotStockOptions(items, emit);

            const options = getLotStockOptions(0, 0);
            expect(options.conditionOptions).toHaveLength(1);
            expect(options.conditionOptions[0].label).toBe('New');
        });

        it('returns available quantity when all filters set', () => {
            const items = ref(makeItems({ batch: 'B1', allocation: 'A1', owned: 'O1', condition: 'new' }));
            const { getLotStockOptions } = useLotStockOptions(items, emit);

            const options = getLotStockOptions(0, 0);
            expect(options.availableQuantity).toBe(100);
        });

        it('returns 0 available quantity when filters incomplete', () => {
            const items = ref(makeItems({ batch: 'B1' }));
            const { getLotStockOptions } = useLotStockOptions(items, emit);

            const options = getLotStockOptions(0, 0);
            expect(options.availableQuantity).toBe(0);
        });

        it('returns empty options when no item id', () => {
            const items = ref([{ ...makeItems()[0], id_item: '' }]);
            const { getLotStockOptions } = useLotStockOptions(items, emit);

            const options = getLotStockOptions(0, 0);
            expect(options.batchOptions).toEqual([]);
        });
    });

    describe('resetDependentFields', () => {
        it('clears downstream fields when batch changes', () => {
            const items = ref(makeItems());
            const { handleLotFieldChange } = useLotStockOptions(items, emit);

            handleLotFieldChange(0, 0, 'batch', 'B1');

            expect(emit).toHaveBeenCalledWith('updateLotBatch', 0, 0, {
                batch: 'B1',
                allocation: '',
                owned: '',
                condition: '',
                owned_name: '',
                available_qty: 0,
            });
        });

        it('clears condition when allocation changes', () => {
            const items = ref(makeItems());
            const { handleLotFieldChange } = useLotStockOptions(items, emit);

            handleLotFieldChange(0, 0, 'allocation', 'A1');

            expect(emit).toHaveBeenCalledWith('updateLotBatch', 0, 0, {
                allocation: 'A1',
                owned: '',
                condition: '',
                owned_name: '',
                available_qty: 0,
            });
        });
    });

    describe('handleLotFieldChange', () => {
        it('sets available_qty when condition changes', () => {
            const items = ref(makeItems({ batch: 'B1', allocation: 'A1', owned: 'O1' }));
            const { handleLotFieldChange } = useLotStockOptions(items, emit);

            handleLotFieldChange(0, 0, 'condition', 'new');

            expect(emit).toHaveBeenCalledWith('updateLot', 0, 0, 'condition', 'new');
            // available_qty is set from stock options
            expect(emit).toHaveBeenCalledWith('updateLot', 0, 0, 'available_qty', expect.any(Number));
        });

        it('sets owned_name when owned field changes', () => {
            const items = ref(makeItems({ batch: 'B1', allocation: 'A1' }));
            const { handleLotFieldChange } = useLotStockOptions(items, emit);

            handleLotFieldChange(0, 0, 'owned', 'O1');

            expect(emit).toHaveBeenCalledWith('updateLotBatch', 0, 0, {
                owned: 'O1',
                condition: '',
                owned_name: 'Owner 1',
                available_qty: 0,
            });
        });
    });
});
