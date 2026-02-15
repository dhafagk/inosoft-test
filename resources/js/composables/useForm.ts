import { toTypedSchema } from '@vee-validate/zod';
import { useForm as useVeeForm } from 'vee-validate';
import type { ZodType } from 'zod';

export interface UseFormOptions<TValues extends Record<string, any>> {
    validationSchema?: ZodType<TValues, any, any>;
    initialValues?: Partial<TValues>;
}

export function useForm<TValues extends Record<string, any> = Record<string, any>>(options: UseFormOptions<TValues> = {}) {
    const { validationSchema, initialValues } = options;

    const formContext = useVeeForm<TValues>({
        validationSchema: validationSchema ? toTypedSchema(validationSchema) : undefined,
        initialValues: initialValues as any,
    });

    return formContext;
}
