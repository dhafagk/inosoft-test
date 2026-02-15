<script setup lang="ts">
defineProps<{
    message: string;
    by: string;
}>();
</script>

<template>
    <div>
        <h3 class="mb-3 text-base font-bold text-gray-900">Notes</h3>
        <div class="rounded-lg border bg-white p-6">
            <p class="text-sm whitespace-pre-wrap">{{ message }}</p>
            <p class="mt-2 text-xs text-gray-400">By: {{ by }}</p>
        </div>
    </div>
</template>
