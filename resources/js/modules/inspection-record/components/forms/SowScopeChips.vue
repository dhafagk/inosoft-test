<script setup lang="ts">
import { computed } from 'vue';
import type { SowWork } from '../../types/inspection';

const props = defineProps<{
    sowWorks: SowWork[];
}>();

const selectedFields = computed(() => {
    const fields: Array<{ name: string; subscope: string }> = [];

    props.sowWorks.forEach((work) => {
        work.fields.forEach((field) => {
            if (field.selected) {
                fields.push({
                    name: field.name,
                    subscope: work.subscope_name,
                });
            }
        });
    });

    return fields;
});
</script>

<template>
    <div v-if="selectedFields.length > 0" class="flex flex-wrap gap-1.5">
        <div
            v-for="(field, index) in selectedFields"
            :key="index"
            class="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
        >
            {{ field.name }}
            <span class="ml-1 text-[10px] text-primary/60">({{ field.subscope }})</span>
        </div>
    </div>
    <p v-else class="text-sm text-muted-foreground">No scope selected. Please select a SOW template.</p>
</template>
