<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import axios from 'axios';
import { toast } from 'vue-sonner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import AppLayout from '@/layouts/AppLayout.vue';
import { CreateInspectionForm, type CreateInspectionFormValues } from '@/modules/inspection-record';
import { useInspectionStore } from '@/modules/inspection-record/stores/inspectionStore';

const inspectionStore = useInspectionStore();

const handleSubmit = async (values: CreateInspectionFormValues) => {
    try {
        const response = await axios.post('/api/inspection', values);

        inspectionStore.addInspectionRecord({
            id: response.data.id,
            no: response.data.no,
            status: response.data.status,
            customer_name: values.customer_name,
        });

        toast.success('Inspection request created successfully!', {
            description: `Inspection ${response.data.no} has been created`,
        });

        setTimeout(() => {
            router.visit('/inspection-record');
        }, 1000);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create inspection request';

        toast.error('Failed to create inspection request', {
            description: errorMessage,
        });

        throw error;
    }
};

const handleCancel = () => {
    router.visit('/inspection-record');
};
</script>

<template>
    <AppLayout title="Create Yard Service Request">
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
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </template>

        <CreateInspectionForm @submit="handleSubmit" @cancel="handleCancel" />
    </AppLayout>
</template>
