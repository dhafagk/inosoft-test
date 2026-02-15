<script setup lang="ts">
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DetailRecordSow, SowField } from '../../types/inspection';

const props = defineProps<{
    sow: DetailRecordSow[];
}>();

const templateName = computed(() => {
    return props.sow[0]?.template_name || 'Untitled SOW';
});

const hasSelectedFields = computed(() => {
    return props.sow.some((s) => s.works.some((w) => w.fields.some((f) => f.selected)));
});

function getSelectedFields(fields: SowField[]): SowField[] {
    return fields.filter((f) => f.selected);
}
</script>

<template>
    <div>
        <h3 class="mb-3 text-base font-bold text-gray-900">Scope Of Work</h3>
        <div class="rounded-lg border bg-white p-6">
            <h4 class="mb-4 text-sm font-bold">{{ templateName }}</h4>

            <template v-if="hasSelectedFields">
                <Table>
                    <TableHeader>
                        <TableRow class="bg-teal-600">
                            <TableHead class="w-35 text-white">Service Type</TableHead>
                            <TableHead class="w-40 text-white">Scope Name</TableHead>
                            <TableHead class="text-white">Scope Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <template v-for="(s, sIdx) in sow" :key="sIdx">
                            <template v-for="work in s.works" :key="work._id">
                                <TableRow v-for="(field, fIdx) in getSelectedFields(work.fields)" :key="field.name" class="border-b">
                                    <TableCell v-if="fIdx === 0" :rowspan="getSelectedFields(work.fields).length" class="align-top font-medium">
                                        {{ work.subscope_name }}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" class="font-normal whitespace-nowrap">{{ field.name }}</Badge>
                                    </TableCell>
                                    <TableCell class="text-sm text-gray-500">
                                        {{ field.value || '' }}
                                    </TableCell>
                                </TableRow>
                            </template>
                        </template>
                    </TableBody>
                </Table>
            </template>
            <p v-else class="text-sm text-muted-foreground">No scope of work defined.</p>
        </div>
    </div>
</template>
