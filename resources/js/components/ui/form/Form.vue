<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { provide } from 'vue';
import type { FormContext } from 'vee-validate';

const props = defineProps<{
    class?: HTMLAttributes['class'];
    formContext: FormContext<any>;
    submitHandler?: (e?: Event) => void;
}>();

provide('formContext', props.formContext);
</script>

<template>
    <form @submit="submitHandler" :class="props.class">
        <slot />
    </form>
</template>
