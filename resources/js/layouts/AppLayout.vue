<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

defineProps<{
    title: string;
}>();
</script>

<template>
    <Head :title="title" />

    <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div class="mb-6">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">{{ title }}</h1>
            <div v-if="$slots.breadcrumb" class="mt-1">
                <slot name="breadcrumb" />
            </div>
        </div>

        <slot />
    </div>
</template>
