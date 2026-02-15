<script setup lang="ts">
import { useFormField } from '@/composables/useFormField';
import { Switch } from '@/components/ui/switch';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    name: string;
    disabled?: boolean;
    class?: HTMLAttributes['class'];
}>();

const { value, handleChange, hasError } = useFormField({ name: () => props.name });
</script>

<template>
    <Switch
        :id="name"
        :name="name"
        :model-value="value as boolean"
        @update:model-value="handleChange"
        :disabled="disabled"
        :class="props.class"
        :aria-invalid="hasError"
    />
</template>
