<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { computed, toRef } from 'vue';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import type { SelectOption } from '@/components/ui/form';
import { useLotStockOptions } from '../../composables/useLotStockOptions';
import type { OrderItemFormValues } from '../../schemas/inspection.schema';
import type { Item } from '../../types/inspection';
import InspectionFormItemCard from './InspectionFormItemCard.vue';

const props = defineProps<{
    items: OrderItemFormValues[];
    availableItems: Item[];
}>();

const emit = defineEmits<{
    addItem: [];
    removeItem: [index: number];
    addLot: [itemIndex: number];
    removeLot: [itemIndex: number, lotIndex: number];
    itemSelected: [itemIndex: number, itemId: string];
    updateLot: [itemIndex: number, lotIndex: number, field: string, value: any];
}>();

const itemOptions = computed<SelectOption[]>(() =>
    props.availableItems.map((item) => ({
        label: `${item.item_code} - ${item.item_desc}`,
        value: item.id,
    })),
);

const { getLotStockOptions, handleLotFieldChange } = useLotStockOptions(toRef(props, 'items'), emit as (event: string, ...args: any[]) => void);
</script>

<template>
    <FieldGroup>
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Items</h3>
            <Button type="button" @click="emit('addItem')" variant="outline" size="sm">
                <Plus class="mr-2 h-4 w-4" />
                Add Item
            </Button>
        </div>

        <div v-if="items.length === 0" class="rounded-md border border-dashed border-muted-foreground/20 bg-muted/50 p-8 text-center">
            <p class="text-sm text-muted-foreground">No items added yet. Click "Add Item" to get started.</p>
        </div>

        <div v-else class="space-y-4">
            <InspectionFormItemCard
                v-for="(item, itemIndex) in items"
                :key="itemIndex"
                :item="item"
                :item-index="itemIndex"
                :item-options="itemOptions"
                :get-lot-stock-options="getLotStockOptions"
                :handle-lot-field-change="handleLotFieldChange"
                @remove-item="emit('removeItem', $event)"
                @add-lot="emit('addLot', $event)"
                @remove-lot="(iIdx, lIdx) => emit('removeLot', iIdx, lIdx)"
                @item-selected="(iIdx, itemId) => emit('itemSelected', iIdx, itemId)"
            />
        </div>
    </FieldGroup>
</template>
