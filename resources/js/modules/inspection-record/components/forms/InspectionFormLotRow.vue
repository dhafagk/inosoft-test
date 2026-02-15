<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { FormField, FormInput, FormCombobox, FormCheckbox } from '@/components/ui/form';
import type { LotStockOptions } from '../../composables/useLotStockOptions';
import type { LotRowFormValues } from '../../schemas/inspection.schema';

defineProps<{
    itemIndex: number;
    lotIndex: number;
    lot: LotRowFormValues;
    hasItem: boolean;
    stockOptions: LotStockOptions;
}>();

const emit = defineEmits<{
    removeLot: [itemIndex: number, lotIndex: number];
    lotFieldChange: [itemIndex: number, lotIndex: number, field: string, value: any];
}>();
</script>

<template>
    <div class="space-y-3 rounded-md bg-muted/30 p-3">
        <div class="flex items-center justify-between">
            <h6 class="text-sm font-medium text-muted-foreground">Lot {{ lotIndex + 1 }}</h6>
            <Button type="button" @click="emit('removeLot', itemIndex, lotIndex)" variant="ghost" size="sm">
                <Trash2 class="h-4 w-4" />
            </Button>
        </div>

        <div v-if="hasItem" class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <FormField :name="`items[${itemIndex}].lots[${lotIndex}].batch`" label="Lot Selection" required>
                <FormCombobox
                    :name="`items[${itemIndex}].lots[${lotIndex}].batch`"
                    placeholder="Search lot..."
                    :options="stockOptions.batchOptions"
                    @update:model-value="(value: any) => emit('lotFieldChange', itemIndex, lotIndex, 'batch', value)"
                />
            </FormField>

            <FormField :name="`items[${itemIndex}].lots[${lotIndex}].allocation`" label="Allocation" required>
                <FormCombobox
                    :name="`items[${itemIndex}].lots[${lotIndex}].allocation`"
                    placeholder="Search allocation..."
                    :options="stockOptions.allocationOptions"
                    :disabled="!lot.batch"
                    @update:model-value="(value: any) => emit('lotFieldChange', itemIndex, lotIndex, 'allocation', value)"
                />
            </FormField>

            <FormField :name="`items[${itemIndex}].lots[${lotIndex}].owned`" label="Owner" required>
                <FormInput :name="`items[${itemIndex}].lots[${lotIndex}].owned_name`" type="hidden" />
                <FormCombobox
                    :name="`items[${itemIndex}].lots[${lotIndex}].owned`"
                    placeholder="Search owner..."
                    :options="stockOptions.ownerOptions"
                    :disabled="!lot.allocation"
                    @update:model-value="(value: any) => emit('lotFieldChange', itemIndex, lotIndex, 'owned', value)"
                />
            </FormField>

            <FormField :name="`items[${itemIndex}].lots[${lotIndex}].condition`" label="Condition" required>
                <FormCombobox
                    :name="`items[${itemIndex}].lots[${lotIndex}].condition`"
                    placeholder="Search condition..."
                    :options="stockOptions.conditionOptions"
                    :disabled="!lot.owned"
                    @update:model-value="(value: any) => emit('lotFieldChange', itemIndex, lotIndex, 'condition', value)"
                />
            </FormField>

            <FormField :name="`items[${itemIndex}].lots[${lotIndex}].available_qty`" label="Avail. Qty" description="From inventory stock">
                <FormInput
                    :name="`items[${itemIndex}].lots[${lotIndex}].available_qty`"
                    type="number"
                    :model-value="stockOptions.availableQuantity"
                    readonly
                    class="bg-muted"
                />
            </FormField>

            <FormField :name="`items[${itemIndex}].lots[${lotIndex}].qty`" label="Qty Required" required>
                <FormInput :name="`items[${itemIndex}].lots[${lotIndex}].qty`" type="number" placeholder="0" min="1" />
            </FormField>

            <FormField :name="`items[${itemIndex}].lots[${lotIndex}].inspection_required`" label="Inspection Required" class="flex items-end">
                <div class="flex items-center space-x-2">
                    <FormCheckbox :name="`items[${itemIndex}].lots[${lotIndex}].inspection_required`" />
                    <span class="text-sm text-muted-foreground">Required</span>
                </div>
            </FormField>
        </div>
        <div v-else class="rounded-md bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            Please select an item first to view available stock
        </div>
    </div>
</template>
