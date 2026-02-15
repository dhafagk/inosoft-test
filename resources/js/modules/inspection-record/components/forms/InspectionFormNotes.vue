<script setup lang="ts">
import { FieldGroup } from '@/components/ui/field';
import { FormField, FormTextarea } from '@/components/ui/form';
</script>

<template>
    <FieldGroup>
        <FormField name="notes" label="Notes" description="Add any additional notes or comments">
            <FormTextarea name="notes" placeholder="Enter notes here..." :rows="5" />
        </FormField>
    </FieldGroup>
</template>
