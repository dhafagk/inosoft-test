<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, onMounted } from 'vue';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import AppLayout from '@/layouts/AppLayout.vue';
import { InspectionListLayout } from '@/modules/inspection-record/components';
import { useInspectionRecords } from '@/modules/inspection-record/composables';

const { error, openRecords, forReviewRecords, completedRecords, fetchRecords } = useInspectionRecords();

const tabs = computed(() => [
    { value: 'open', label: 'Open', items: openRecords.value },
    { value: 'for-review', label: 'For Review', items: forReviewRecords.value },
    { value: 'completed', label: 'Completed', items: completedRecords.value },
]);

const handleCreateRequest = () => {
    router.visit('/inspection-record/create');
};

const handleSearch = () => {
    // TODO: Implement search functionality
};

const handleExport = () => {
    // TODO: Implement export functionality
};

// Fetch data on mount
onMounted(() => {
    fetchRecords();
});
</script>

<template>
    <AppLayout title="Inspection Record">
        <template #breadcrumb>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Quality & HSE</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Inspection</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Inspection Record</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </template>

        <div v-if="error" class="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <p class="font-medium">Error loading inspection records</p>
            <p class="text-sm">{{ error }}</p>
        </div>

        <InspectionListLayout :tabs="tabs" default-tab="open" @create-request="handleCreateRequest" @search="handleSearch" @export="handleExport" />
    </AppLayout>
</template>
