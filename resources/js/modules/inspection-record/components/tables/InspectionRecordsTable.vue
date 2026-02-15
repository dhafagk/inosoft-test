<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { InspectionRequest } from '@/modules/inspection-record/types/inspection';

defineProps<{
    items: InspectionRequest[];
}>();

const expandedRows = ref<Set<number>>(new Set());

function toggleRow(id: number) {
    const next = new Set(expandedRows.value);
    if (next.has(id)) {
        next.delete(id);
    } else {
        next.add(id);
    }
    expandedRows.value = next;
}

const mainColumns = ['Request No.', 'Location', 'Scope of Work', 'Type', 'Date Submitted', 'ECD', 'Related To', '3rd Party', 'Status', 'Action'];
const subColumns = ['Item Description', 'Ownership', 'Lot No.', 'QTY', 'Progress'];
</script>

<template>
    <div class="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow class="bg-teal-600 hover:bg-teal-600">
                    <TableHead v-for="col in mainColumns" :key="col" class="whitespace-nowrap text-white">{{ col }}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <template v-if="items.length === 0">
                    <TableRow>
                        <TableCell :colspan="mainColumns.length" class="text-center text-muted-foreground">No records found.</TableCell>
                    </TableRow>
                </template>

                <template v-for="item in items" :key="item.id">
                    <TableRow>
                        <TableCell class="font-medium whitespace-nowrap">
                            <a :href="`/inspection-record/${item.requestNo}`" class="text-teal-600 hover:underline">{{ item.requestNo }}</a>
                        </TableCell>
                        <TableCell class="whitespace-nowrap">{{ item.location }}</TableCell>
                        <TableCell>{{ item.scopeOfWork }}</TableCell>
                        <TableCell class="whitespace-nowrap">{{ item.type }}</TableCell>
                        <TableCell class="whitespace-nowrap">{{ item.dateSubmitted }}</TableCell>
                        <TableCell class="whitespace-nowrap">{{ item.ecd }}</TableCell>
                        <TableCell class="whitespace-nowrap">{{ item.relatedTo }}</TableCell>
                        <TableCell class="whitespace-nowrap">{{ item.thirdParty }}</TableCell>
                        <TableCell>
                            <span class="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-blue-800">
                                {{ item.status }}
                            </span>
                        </TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon-sm" @click="toggleRow(item.id)">
                                <ChevronDown class="transition-transform duration-200" :class="{ 'rotate-180': expandedRows.has(item.id) }" />
                            </Button>
                        </TableCell>
                    </TableRow>

                    <TableRow v-if="expandedRows.has(item.id)">
                        <TableCell :colspan="mainColumns.length" class="bg-gray-50 p-4">
                            <div class="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow class="bg-teal-500 hover:bg-teal-500">
                                            <TableHead v-for="col in subColumns" :key="col" class="whitespace-nowrap text-white">{{ col }}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="(sub, idx) in item.subItems" :key="idx">
                                            <TableCell>{{ sub.itemDescription }}</TableCell>
                                            <TableCell class="whitespace-nowrap">{{ sub.ownership }}</TableCell>
                                            <TableCell class="whitespace-nowrap">{{ sub.lotNo }}</TableCell>
                                            <TableCell>{{ sub.qty }}</TableCell>
                                            <TableCell class="whitespace-nowrap">{{ sub.progress }}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>
</template>
