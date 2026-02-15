<script setup lang="ts">
import { useFormField } from '@/composables/useFormField';
import { Input } from '@/components/ui/input';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    name: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    class?: HTMLAttributes['class'];
}>();

const { value, handleChange, handleBlur, hasError } = useFormField({ name: () => props.name });
</script>

<template>
    <Input
        :id="name"
        :name="name"
        :type="type || 'text'"
        :model-value="value as string | number | undefined"
        @update:model-value="handleChange"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="props.class"
        :aria-invalid="hasError"
    />
</template>
