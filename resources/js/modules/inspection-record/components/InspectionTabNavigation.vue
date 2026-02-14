<script setup lang="ts">
import { FileDown, Search } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { InspectionRequest } from '@/modules/inspection-record/types/inspection';

defineProps<{
    tabs: Array<{ value: string; label: string; items: InspectionRequest[] }>;
}>();

const emit = defineEmits<{
    search: [];
    export: [];
}>();
</script>

<template>
    <div class="flex items-center justify-between">
        <TabsList>
            <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value"> {{ tab.label }} ({{ tab.items.length }}) </TabsTrigger>
        </TabsList>

        <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="emit('search')">
                <Search class="size-4" />
                Search
            </Button>
            <Button variant="outline" size="sm" @click="emit('export')">
                <FileDown class="size-4" />
                Export
            </Button>
        </div>
    </div>
</template>
