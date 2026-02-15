<script setup lang="ts">
import { Plus, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { FormField, FormInput, FormSelect, type SelectOption } from '@/components/ui/form';
import type { LotStockOptions } from '../../composables/useLotStockOptions';
import type { OrderItemFormValues } from '../../schemas/inspection.schema';
import InspectionFormLotRow from './InspectionFormLotRow.vue';

defineProps<{
    item: OrderItemFormValues;
    itemIndex: number;
    itemOptions: SelectOption[];
    getLotStockOptions: (itemIndex: number, lotIndex: number) => LotStockOptions;
    handleLotFieldChange: (itemIndex: number, lotIndex: number, field: string, value: any) => void;
}>();

const emit = defineEmits<{
    removeItem: [index: number];
    addLot: [itemIndex: number];
    removeLot: [itemIndex: number, lotIndex: number];
    itemSelected: [itemIndex: number, itemId: string];
}>();
</script>

<template>
    <div class="space-y-4 rounded-md border border-muted-foreground/20 p-4">
        <div class="flex items-center justify-between">
            <h4 class="font-medium">Item {{ itemIndex + 1 }}</h4>
            <Button type="button" @click="emit('removeItem', itemIndex)" variant="ghost" size="sm">
                <Trash2 class="h-4 w-4" />
            </Button>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField :name="`items[${itemIndex}].id_item`" label="Item" required description="Select item from inventory">
                <FormSelect
                    :name="`items[${itemIndex}].id_item`"
                    placeholder="Select item"
                    :options="itemOptions"
                    @update:model-value="(value: string) => emit('itemSelected', itemIndex, value as string)"
                />
            </FormField>

            <FormField :name="`items[${itemIndex}].qty`" label="Quantity" required>
                <FormInput :name="`items[${itemIndex}].qty`" type="number" placeholder="0" min="1" />
            </FormField>
        </div>

        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <h5 class="text-sm font-medium">Lots</h5>
                <Button type="button" @click="emit('addLot', itemIndex)" variant="outline" size="sm">
                    <Plus class="mr-2 h-3 w-3" />
                    Add Lot
                </Button>
            </div>

            <InspectionFormLotRow
                v-for="(lot, lotIndex) in item.lots"
                :key="lotIndex"
                :item-index="itemIndex"
                :lot-index="lotIndex"
                :lot="lot"
                :has-item="!!item.id_item"
                :stock-options="getLotStockOptions(itemIndex, lotIndex)"
                @remove-lot="(iIdx, lIdx) => emit('removeLot', iIdx, lIdx)"
                @lot-field-change="handleLotFieldChange"
            />
        </div>
    </div>
</template>
