<script setup lang="ts">
import axios from 'axios';
import { ChevronLeft, Pencil } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout.vue';
import { DetailHeaderCard, DetailItemsTable, DetailNotes, DetailSowTable } from '@/modules/inspection-record/components';
import type { DetailRecord } from '@/modules/inspection-record/types/inspection';

const props = defineProps<{
    no: string;
}>();

const record = ref<DetailRecord | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        const { data } = await axios.get<DetailRecord>(`/api/inspection/${props.no}`);
        record.value = data;
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to load inspection record';
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <AppLayout title="Yard Services Details">
        <template #breadcrumb>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Operation</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/inspection-record" class="text-teal-600">Yard Services</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Yard Services Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </template>

        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="text-sm text-muted-foreground">Loading inspection record...</div>
        </div>

        <div v-else-if="error" class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <p class="font-medium">Error</p>
            <p class="text-sm">{{ error }}</p>
        </div>

        <div v-else-if="record" class="space-y-6">
            <div class="flex items-center justify-between">
                <a href="/inspection-record" class="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700">
                    <ChevronLeft class="h-4 w-4" />
                    Back
                </a>
                <Button variant="outline" size="sm" class="gap-1.5">
                    <Pencil class="h-3.5 w-3.5" />
                    Modify
                </Button>
            </div>

            <DetailHeaderCard :record="record" />

            <DetailSowTable v-if="record.sow?.length" :sow="record.sow" />

            <DetailItemsTable :items="record.items_raw ?? []" />

            <DetailNotes v-if="record.notes?.initial?.msg" :message="record.notes.initial.msg" :by="record.notes.initial.by || '-'" />
        </div>
    </AppLayout>
</template>
