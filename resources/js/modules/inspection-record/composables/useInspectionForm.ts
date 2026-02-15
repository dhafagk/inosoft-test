import { ref, computed } from 'vue';
import { useForm } from '@/composables/useForm';
import { createInspectionFormSchema, type CreateInspectionFormValues } from '../schemas/inspection.schema';
import type { Yard, Customer, SowTemplate } from '../types/inspection';

export function useInspectionForm() {
    const isSubmitting = ref(false);
    const submitError = ref<string | null>(null);

    const initialValues: CreateInspectionFormValues = {
        type: '',
        sow_template: '',
        sow_template_name: '',
        sow_works: [],
        charge_to_customer: false,
        customer_id: '',
        customer_name: '',
        yard: '',
        yard_name: '',
        ecd: '',
        link_to: '',
        dc_code: '',
        notes: '',
        status: 'Draft',
        items: [],
    };

    const formContext = useForm<CreateInspectionFormValues>({
        validationSchema: createInspectionFormSchema,
        initialValues,
    });

    const handleSubmit = (onSuccess?: (values: CreateInspectionFormValues) => void | Promise<void>) => {
        return formContext.handleSubmit(async (values) => {
            isSubmitting.value = true;
            submitError.value = null;

            try {
                if (onSuccess) {
                    await onSuccess(values as CreateInspectionFormValues);
                }
            } catch (error) {
                submitError.value = error instanceof Error ? error.message : 'An error occurred';
                throw error;
            } finally {
                isSubmitting.value = false;
            }
        });
    };

    const setType = (typeValue: string, typeLabel: string) => {
        formContext.setFieldValue('type', typeValue);
        formContext.setFieldValue('insp_type', typeLabel);
    };

    const setYard = (yard: Yard) => {
        formContext.setFieldValue('yard', yard.id);
        formContext.setFieldValue('yard_name', yard.name);
    };

    const setCustomer = (customer: Customer) => {
        formContext.setFieldValue('customer_id', customer.id);
        formContext.setFieldValue('customer_name', customer.name);
    };

    const setSowTemplate = (template: SowTemplate) => {
        formContext.setFieldValue('sow_template', template.id);
        formContext.setFieldValue('sow_template_name', template.name);
        formContext.setFieldValue('sow_works', template.works);
    };

    const addItem = () => {
        const currentItems = formContext.values.items || [];
        formContext.setFieldValue('items', [
            ...currentItems,
            {
                id_item: '',
                item_code: '',
                item_desc: '',
                item_type: '',
                item_type_name: '',
                item_pipe_family: '',
                qty: 1,
                expanded: false,
                lots: [],
            },
        ]);
    };

    const removeItem = (index: number) => {
        const currentItems = formContext.values.items || [];
        formContext.setFieldValue(
            'items',
            currentItems.filter((_, i) => i !== index),
        );
    };

    const updateItem = (index: number, updates: Partial<CreateInspectionFormValues['items'][0]>) => {
        const currentItems = formContext.values.items || [];
        const updatedItems = [...currentItems];
        updatedItems[index] = { ...updatedItems[index], ...updates };
        formContext.setFieldValue('items', updatedItems);
    };

    const addLotToItem = (itemIndex: number) => {
        const currentItems = formContext.values.items || [];
        const item = currentItems[itemIndex];
        const updatedItem = {
            ...item,
            lots: [
                ...item.lots,
                {
                    batch: '',
                    allocation: '',
                    owned: '',
                    owned_name: '',
                    condition: '',
                    available_qty: 0,
                    qty: 1,
                    inspection_required: false,
                },
            ],
        };
        updateItem(itemIndex, updatedItem);
    };

    const removeLotFromItem = (itemIndex: number, lotIndex: number) => {
        const currentItems = formContext.values.items || [];
        const item = currentItems[itemIndex];
        const updatedItem = {
            ...item,
            lots: item.lots.filter((_, i) => i !== lotIndex),
        };
        updateItem(itemIndex, updatedItem);
    };

    const updateLotField = (itemIndex: number, lotIndex: number, field: string, value: any) => {
        formContext.setFieldValue(`items[${itemIndex}].lots[${lotIndex}].${field}` as any, value);
    };

    const updateLotBatch = (itemIndex: number, lotIndex: number, updates: Record<string, any>) => {
        for (const [field, value] of Object.entries(updates)) {
            formContext.setFieldValue(`items[${itemIndex}].lots[${lotIndex}].${field}` as any, value);
        }
    };

    const resetForm = () => {
        formContext.resetForm();
        submitError.value = null;
    };

    const isValid = computed(() => {
        return Object.keys(formContext.errors.value).length === 0;
    });

    return {
        formContext,
        isSubmitting,
        submitError,
        isValid,
        handleSubmit,
        setType,
        setYard,
        setCustomer,
        setSowTemplate,
        addItem,
        removeItem,
        updateItem,
        addLotToItem,
        removeLotFromItem,
        updateLotField,
        updateLotBatch,
        resetForm,
    };
}
