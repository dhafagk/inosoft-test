import axios from 'axios';
import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';
import type { SelectOption } from '@/components/ui/form';

export interface StockRecord {
    batch: string;
    allocation: string;
    owned: string;
    owned_name: string;
    condition: string;
    available_qty: number;
}

export interface LotFilters {
    batch: string;
    allocation: string;
    owned: string;
    condition: string;
}

export function useItemStock(itemId: Ref<string> | ComputedRef<string>, currentFilters: Ref<LotFilters> | ComputedRef<LotFilters>) {
    const stockRecords = ref<StockRecord[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchStock = async () => {
        if (!itemId.value) {
            stockRecords.value = [];
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get(`/api/inspection/items/${itemId.value}/stock`);
            stockRecords.value = response.data;
        } catch (err) {
            console.error('Error fetching stock:', err);
            error.value = 'Failed to fetch stock data';
            stockRecords.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    watch(itemId, fetchStock, { immediate: true });

    const batchOptions = computed<SelectOption[]>(() => {
        const uniqueBatches = [...new Set(stockRecords.value.map((s) => s.batch))];
        return uniqueBatches.map((batch) => ({
            label: batch,
            value: batch,
        }));
    });

    const allocationOptions = computed<SelectOption[]>(() => {
        const filtered = currentFilters.value.batch ? stockRecords.value.filter((s) => s.batch === currentFilters.value.batch) : stockRecords.value;

        const uniqueAllocations = [...new Set(filtered.map((s) => s.allocation))];
        return uniqueAllocations.map((allocation) => ({
            label: allocation,
            value: allocation,
        }));
    });

    const ownerOptions = computed<SelectOption[]>(() => {
        let filtered = stockRecords.value;

        if (currentFilters.value.batch) {
            filtered = filtered.filter((s) => s.batch === currentFilters.value.batch);
        }

        if (currentFilters.value.allocation) {
            filtered = filtered.filter((s) => s.allocation === currentFilters.value.allocation);
        }

        const uniqueOwners = [...new Map(filtered.map((s) => [s.owned, s])).values()];
        return uniqueOwners.map((stock) => ({
            label: stock.owned_name,
            value: stock.owned,
        }));
    });

    const conditionOptions = computed<SelectOption[]>(() => {
        let filtered = stockRecords.value;

        if (currentFilters.value.batch) {
            filtered = filtered.filter((s) => s.batch === currentFilters.value.batch);
        }

        if (currentFilters.value.allocation) {
            filtered = filtered.filter((s) => s.allocation === currentFilters.value.allocation);
        }

        if (currentFilters.value.owned) {
            filtered = filtered.filter((s) => s.owned === currentFilters.value.owned);
        }

        const uniqueConditions = [...new Set(filtered.map((s) => s.condition))];
        return uniqueConditions.map((condition) => ({
            label: condition.charAt(0).toUpperCase() + condition.slice(1),
            value: condition,
        }));
    });

    const availableQuantity = computed<number>(() => {
        const { batch, allocation, owned, condition } = currentFilters.value;

        if (!batch || !allocation || !owned || !condition) {
            return 0;
        }

        const matchingStock = stockRecords.value.find(
            (s) => s.batch === batch && s.allocation === allocation && s.owned === owned && s.condition === condition,
        );

        return matchingStock?.available_qty || 0;
    });

    return {
        stockRecords,
        isLoading,
        error,
        fetchStock,
        batchOptions,
        allocationOptions,
        ownerOptions,
        conditionOptions,
        availableQuantity,
    };
}
