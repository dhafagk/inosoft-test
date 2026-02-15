<script setup lang="ts">
import { computed } from 'vue';
import { type DateValue, DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { useFormField } from '@/composables/useFormField';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const props = defineProps<{
    name: string;
    placeholder?: string;
    disabled?: boolean;
}>();

const { value, handleChange, handleBlur, hasError } = useFormField({ name: () => props.name });

const df = new DateFormatter('en-US', {
    dateStyle: 'long',
});

const dateValue = computed(() => {
    if (!value.value || typeof value.value !== 'string') {
        return undefined;
    }
    try {
        return parseDate(value.value);
    } catch {
        return undefined;
    }
});

const handleDateSelect = (date: DateValue | undefined) => {
    if (date) {
        handleChange(date.toString());
    } else {
        handleChange('');
    }
};
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button
                variant="outline"
                :class="
                    cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        hasError && 'border-destructive',
                    )
                "
                :disabled="disabled"
                @blur="handleBlur"
            >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : (placeholder || 'Pick a date') }}
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
            <Calendar :model-value="dateValue" @update:model-value="handleDateSelect" />
        </PopoverContent>
    </Popover>
</template>
