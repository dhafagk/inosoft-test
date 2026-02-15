<script setup lang="ts">
import { useFormField } from '@/composables/useFormField';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { HTMLAttributes } from 'vue';

export interface SelectOption {
    label: string;
    value: string;
}

const props = defineProps<{
    name: string;
    placeholder?: string;
    disabled?: boolean;
    options: SelectOption[];
    class?: HTMLAttributes['class'];
}>();

const { value, handleChange, hasError } = useFormField({ name: () => props.name });
</script>

<template>
    <Select :model-value="value" @update:model-value="handleChange" :disabled="disabled">
        <SelectTrigger :id="name" :class="props.class" :aria-invalid="hasError">
            <SelectValue :placeholder="placeholder" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectItem v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>
