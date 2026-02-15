<script setup lang="ts">
import { useFormField } from '@/composables/useFormField';
import { Textarea } from '@/components/ui/textarea';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    name: string;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
    class?: HTMLAttributes['class'];
}>();

const { value, handleChange, handleBlur, hasError } = useFormField({ name: () => props.name });
</script>

<template>
    <Textarea
        :id="name"
        :name="name"
        :model-value="value"
        @update:model-value="handleChange"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        :class="props.class"
        :aria-invalid="hasError"
    />
</template>
