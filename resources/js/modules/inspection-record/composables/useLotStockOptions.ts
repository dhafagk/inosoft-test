import { shallowRef, ref, type ComputedRef, type Ref } from 'vue';
import type { SelectOption } from '@/components/ui/form';
import type { OrderItemFormValues } from '../schemas/inspection.schema';
import { useItemStock, type LotFilters, type StockRecord } from './useItemStock';

export interface LotStockOptions {
    batchOptions: SelectOption[];
    allocationOptions: SelectOption[];
    ownerOptions: SelectOption[];
    conditionOptions: SelectOption[];
    availableQuantity: number;
}

const EMPTY_FILTERS: LotFilters = { batch: '', allocation: '', owned: '', condition: '' };

const CASCADING_FIELDS = ['batch', 'allocation', 'owned', 'condition'] as const;

function toSelectOptions(values: string[]): SelectOption[] {
    return [...new Set(values)].map((v) => ({ label: v, value: v }));
}

function filterByField(records: StockRecord[], field: string, value: string): StockRecord[] {
    if (!value) return records;
    return records.filter((s) => s[field as keyof StockRecord] === value);
}

export function useLotStockOptions(
    items: Ref<OrderItemFormValues[]> | ComputedRef<OrderItemFormValues[]>,
    emit: (event: string, ...args: any[]) => void,
) {
    const itemStockCache = shallowRef<Map<string, ReturnType<typeof useItemStock>>>(new Map());

    function getOrCreateItemStock(itemId: string): ReturnType<typeof useItemStock> | null {
        if (!itemId) return null;

        if (!itemStockCache.value.has(itemId)) {
            itemStockCache.value.set(itemId, useItemStock(ref(itemId), ref<LotFilters>({ ...EMPTY_FILTERS })));
        }

        return itemStockCache.value.get(itemId) ?? null;
    }

    function getLotStockOptions(itemIndex: number, lotIndex: number): LotStockOptions {
        const item = items.value[itemIndex];
        const lot = item?.lots?.[lotIndex];
        const emptyResult: LotStockOptions = {
            batchOptions: [],
            allocationOptions: [],
            ownerOptions: [],
            conditionOptions: [],
            availableQuantity: 0,
        };

        if (!item?.id_item) return emptyResult;

        const stock = getOrCreateItemStock(item.id_item);
        if (!stock) return emptyResult;

        const records = stock.stockRecords.value;
        if (!Array.isArray(records)) return emptyResult;

        const batch = lot?.batch || '';
        const allocation = lot?.allocation || '';
        const owned = lot?.owned || '';
        const condition = lot?.condition || '';

        const batchOptions = toSelectOptions(records.map((s) => s.batch));

        const filteredByBatch = filterByField(records, 'batch', batch);
        const allocationOptions = toSelectOptions(filteredByBatch.map((s) => s.allocation));

        const filteredByAllocation = filterByField(filteredByBatch, 'allocation', allocation);
        const ownerOptions = [...new Map(filteredByAllocation.map((s) => [s.owned, s])).values()].map((s) => ({
            label: s.owned_name,
            value: s.owned,
        }));

        const filteredByOwner = filterByField(filteredByAllocation, 'owned', owned);
        const conditionOptions = toSelectOptions(filteredByOwner.map((s) => s.condition)).map((opt) => ({
            ...opt,
            label: opt.label.charAt(0).toUpperCase() + opt.label.slice(1),
        }));

        const availableQuantity =
            batch && allocation && owned && condition
                ? (records.find((s) => s.batch === batch && s.allocation === allocation && s.owned === owned && s.condition === condition)
                      ?.available_qty ?? 0)
                : 0;

        return { batchOptions, allocationOptions, ownerOptions, conditionOptions, availableQuantity };
    }

    function resetDependentFields(itemIndex: number, lotIndex: number, fromField: string): void {
        const fromIndex = CASCADING_FIELDS.indexOf(fromField as (typeof CASCADING_FIELDS)[number]);
        if (fromIndex === -1) return;

        for (let i = fromIndex + 1; i < CASCADING_FIELDS.length; i++) {
            emit('updateLot', itemIndex, lotIndex, CASCADING_FIELDS[i], '');
        }
        emit('updateLot', itemIndex, lotIndex, 'owned_name', '');
        emit('updateLot', itemIndex, lotIndex, 'available_qty', 0);
    }

    function handleLotFieldChange(itemIndex: number, lotIndex: number, field: string, value: any): void {
        emit('updateLot', itemIndex, lotIndex, field, value);

        if (field === 'condition') {
            const stockOptions = getLotStockOptions(itemIndex, lotIndex);
            emit('updateLot', itemIndex, lotIndex, 'available_qty', stockOptions.availableQuantity);
            return;
        }

        resetDependentFields(itemIndex, lotIndex, field);

        if (field === 'owned') {
            const item = items.value[itemIndex];
            const stock = item?.id_item ? getOrCreateItemStock(item.id_item) : null;
            const stockRecords = stock?.stockRecords.value;
            const ownerRecord = Array.isArray(stockRecords) ? stockRecords.find((s) => s.owned === value) : null;

            if (ownerRecord) {
                emit('updateLot', itemIndex, lotIndex, 'owned_name', ownerRecord.owned_name);
            }
        }
    }

    return { getLotStockOptions, handleLotFieldChange };
}
