<script setup lang="ts">
import { computed, ref } from 'vue';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { useFormField } from '@/composables/useFormField';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { SelectOption } from './FormSelect.vue';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    name: string;
    placeholder?: string;
    disabled?: boolean;
    options: SelectOption[];
    class?: HTMLAttributes['class'];
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const { value, handleChange, hasError } = useFormField({ name: () => props.name });

const open = ref(false);

const displayLabel = computed(() => {
    const selected = props.options.find((opt) => opt.value === value.value);
    return selected?.label ?? '';
});
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                :disabled="disabled"
                :class="
                    cn(
                        'h-9 w-full justify-between font-normal',
                        !value && 'text-muted-foreground',
                        hasError && 'border-destructive',
                        props.class,
                    )
                "
            >
                {{ displayLabel || placeholder || 'Select...' }}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[--reka-popover-trigger-width] p-0">
            <Command>
                <CommandInput :placeholder="`Search...`" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        <CommandItem
                            v-for="option in options"
                            :key="option.value"
                            :value="option.label"
                            @select="() => {
                                handleChange(option.value);
                                emit('update:modelValue', option.value);
                                open = false;
                            }"
                        >
                            <Check :class="cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')" />
                            {{ option.label }}
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
