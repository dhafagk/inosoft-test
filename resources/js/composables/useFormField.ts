import { useField } from 'vee-validate';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

export interface UseFormFieldOptions {
    name: MaybeRefOrGetter<string>;
}

export function useFormField(options: UseFormFieldOptions) {
    const name = computed(() => toValue(options.name));

    const { value, errorMessage, handleChange, handleBlur, meta } = useField(name, undefined, {
        validateOnValueUpdate: false,
    });

    const hasError = computed(() => !!errorMessage.value && meta.touched);

    return {
        name,
        value,
        errorMessage,
        hasError,
        handleChange,
        handleBlur,
        meta,
    };
}
