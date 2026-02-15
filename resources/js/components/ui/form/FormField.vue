<script setup lang="ts">
import { useFormField } from '@/composables/useFormField';
import type { HTMLAttributes } from 'vue';
import { Field as VeeField } from '@/components/ui/field';
import { FieldLabel, FieldDescription, FieldError } from '@/components/ui/field';

const props = defineProps<{
    name: string;
    label?: string;
    description?: string;
    class?: HTMLAttributes['class'];
    labelClass?: HTMLAttributes['class'];
    required?: boolean;
}>();

const { errorMessage, hasError } = useFormField({ name: () => props.name });
</script>

<template>
    <VeeField :class="props.class">
        <FieldLabel v-if="label" :for="name" :class="labelClass">
            {{ label }}
            <span v-if="required" class="text-destructive">*</span>
        </FieldLabel>
        <slot :has-error="hasError" :error-message="errorMessage" />
        <FieldDescription v-if="description">
            {{ description }}
        </FieldDescription>
        <FieldError v-if="hasError">
            {{ errorMessage }}
        </FieldError>
    </VeeField>
</template>
