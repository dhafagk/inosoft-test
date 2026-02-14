<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import type { InspectionRequest } from '@/modules/inspection-record/types/inspection';
import { InspectionTabNavigation, InspectionRecordsTable } from '../index';

defineProps<{
    tabs: Array<{ value: string; label: string; items: InspectionRequest[] }>;
    defaultTab: string;
}>();

const emit = defineEmits<{
    createRequest: [];
    search: [];
    export: [];
}>();
</script>

<template>
    <div class="bg-white p-4 sm:p-6">
        <slot name="breadcrumb" />

        <Tabs :default-value="defaultTab">
            <InspectionTabNavigation :tabs="tabs" @search="emit('search')" @export="emit('export')" />

            <div class="mt-4">
                <Button class="bg-teal text-teal-foreground hover:bg-teal/90" @click="emit('createRequest')">
                    <Plus />
                    Create Request
                </Button>
            </div>

            <TabsContent v-for="tab in tabs" :key="tab.value" :value="tab.value" class="mt-4">
                <InspectionRecordsTable :items="tab.items" />
            </TabsContent>
        </Tabs>
    </div>
</template>
