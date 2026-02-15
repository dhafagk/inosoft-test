<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DetailRecordItem } from '../../types/inspection';

defineProps<{
    items: DetailRecordItem[];
}>();

const CONDITION_COLORS: Record<string, string> = {
    good: 'text-green-600',
    fair: 'text-yellow-600',
    excellent: 'text-teal-600',
};

const expanded = ref(true);

function conditionColor(condition: string): string {
    return CONDITION_COLORS[condition?.toLowerCase()] ?? 'text-gray-700';
}
</script>

<template>
    <div>
        <button class="flex w-full items-center justify-between" @click="expanded = !expanded">
            <h3 class="text-base font-bold text-gray-900">Item Information</h3>
            <ChevronDown class="h-5 w-5 text-gray-400 transition-transform" :class="{ 'rotate-180': !expanded }" />
        </button>

        <div v-show="expanded" class="mt-3 rounded-lg border bg-white">
            <div class="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow class="bg-teal-600 hover:bg-teal-600">
                            <TableHead class="text-white">Item No.</TableHead>
                            <TableHead class="text-white">Item Description</TableHead>
                            <TableHead class="text-white">Lot No.</TableHead>
                            <TableHead class="text-white">Allocation</TableHead>
                            <TableHead class="text-white">Owner</TableHead>
                            <TableHead class="text-center text-white">Condition</TableHead>
                            <TableHead class="text-center text-white" colspan="2">Requested</TableHead>
                            <TableHead class="text-center text-white" colspan="2">Pending</TableHead>
                            <TableHead class="text-center text-white" colspan="2">Completed</TableHead>
                        </TableRow>
                        <TableRow class="bg-teal-600 hover:bg-teal-600">
                            <TableHead colspan="6" />
                            <TableHead class="text-center text-xs text-white">PCS</TableHead>
                            <TableHead class="text-center text-xs text-white">MT</TableHead>
                            <TableHead class="text-center text-xs text-white">PCS</TableHead>
                            <TableHead class="text-center text-xs text-white">MT</TableHead>
                            <TableHead class="text-center text-xs text-white">PCS</TableHead>
                            <TableHead class="text-center text-xs text-white">MT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="!items.length">
                            <TableCell :colspan="12" class="text-center text-muted-foreground">No items found.</TableCell>
                        </TableRow>
                        <TableRow v-for="(item, idx) in items" :key="idx">
                            <TableCell class="text-sm whitespace-nowrap">{{ item.item_code || '-' }}</TableCell>
                            <TableCell class="text-sm">{{ item.item_desc || '-' }}</TableCell>
                            <TableCell class="text-sm whitespace-nowrap">{{ item.batch || '-' }}</TableCell>
                            <TableCell class="text-sm whitespace-nowrap">{{ item.allocation || '-' }}</TableCell>
                            <TableCell class="text-sm whitespace-nowrap">{{ item.owned_name || '-' }}</TableCell>
                            <TableCell class="text-center">
                                <span :class="['text-sm font-medium capitalize', conditionColor(item.condition || '')]">
                                    {{ item.condition || '-' }}
                                </span>
                            </TableCell>
                            <TableCell class="text-center text-sm">{{ item.qty ?? 0 }}</TableCell>
                            <TableCell class="text-center text-sm">-</TableCell>
                            <TableCell class="text-center text-sm">{{ item.balance ?? 0 }}</TableCell>
                            <TableCell class="text-center text-sm">-</TableCell>
                            <TableCell class="text-center text-sm">{{ item.inspected_qty ?? 0 }}</TableCell>
                            <TableCell class="text-center text-sm">-</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</template>
