<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Form, type SelectOption } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useInspectionForm } from '../../composables/useInspectionForm';
import { useReferenceData } from '../../composables/useReferenceData';
import type { CreateInspectionFormValues } from '../../schemas/inspection.schema';
import InspectionFormBasicInfo from './InspectionFormBasicInfo.vue';
import InspectionFormItems from './InspectionFormItems.vue';
import InspectionFormNotes from './InspectionFormNotes.vue';

const props = defineProps<{
    typeOptions?: SelectOption[];
}>();

const emit = defineEmits<{
    submit: [values: CreateInspectionFormValues];
    cancel: [];
}>();

const defaultTypeOptions: SelectOption[] = props.typeOptions ?? [
    { label: 'New Arrival', value: '11' },
    { label: 'Maintenance', value: '12' },
    { label: 'On Spot', value: '13' },
];

const {
    formContext,
    isSubmitting,
    submitError,
    handleSubmit,
    addItem,
    removeItem,
    updateItem,
    addLotToItem,
    removeLotFromItem,
    updateLotField,
    setType,
    setYard,
    setCustomer,
    setSowTemplate,
} = useInspectionForm();

const { yards, customers, sowTemplates, items, inspectionRecords, isLoading } = useReferenceData();

const handleTypeChange = (typeValue: string) => {
    const selectedType = defaultTypeOptions.find((t) => t.value === typeValue);
    if (selectedType) {
        setType(selectedType.value, selectedType.label);
    }
};

const handleYardChange = (yardId: string) => {
    const yard = yards.value.find((y) => y.id === yardId);
    if (yard) setYard(yard);
};

const handleCustomerChange = (customerId: string) => {
    const customer = customers.value.find((c) => c.id === customerId);
    if (customer) setCustomer(customer);
};

const handleSowTemplateChange = (templateId: string) => {
    const template = sowTemplates.value.find((t) => t.id === templateId);
    if (template) setSowTemplate(template);
};

const handleCreateNewSow = () => {
    // TODO: Implement create new SOW modal/dialog
};

const handleItemSelected = (itemIndex: number, itemId: string) => {
    const selectedItem = items.value.find((i) => i.id === itemId);
    if (selectedItem) {
        updateItem(itemIndex, {
            id_item: selectedItem.id,
            item_code: selectedItem.item_code,
            item_desc: selectedItem.item_desc,
            item_type: selectedItem.item_type,
            item_type_name: selectedItem.item_type_name,
            item_pipe_family: selectedItem.item_pipe_family,
        });
    }
};

const handleDraftSubmit = handleSubmit(async (values) => {
    emit('submit', { ...values, status: 'Draft' });
});

const handleFinalSubmit = handleSubmit(async (values) => {
    emit('submit', { ...values, status: 'New' });
});
</script>

<template>
    <div class="bg-white p-4 sm:p-6">
        <div v-if="isLoading" class="flex items-center justify-center py-12">
            <Spinner class="h-8 w-8" />
            <span class="ml-2 text-muted-foreground">Loading form data...</span>
        </div>

        <Form v-else :form-context="formContext" :submit-handler="handleFinalSubmit" class="space-y-6">
            <div>
                <h2 class="text-2xl font-bold">Create Inspection Request</h2>
                <p class="mt-1 text-sm text-muted-foreground">Fill in the details to create a new inspection request</p>
            </div>

            <Separator />

            <InspectionFormBasicInfo
                :type-options="defaultTypeOptions"
                :yards="yards"
                :customers="customers"
                :sow-templates="sowTemplates"
                :sow-works="formContext.values.sow_works"
                :inspection-records="inspectionRecords"
                :status="formContext.values.status"
                :on-type-change="handleTypeChange"
                :on-yard-change="handleYardChange"
                :on-customer-change="handleCustomerChange"
                :on-sow-template-change="handleSowTemplateChange"
                :on-create-new-sow="handleCreateNewSow"
            />

            <Separator />

            <InspectionFormItems
                :items="formContext.values.items"
                :available-items="items"
                @add-item="addItem"
                @remove-item="removeItem"
                @add-lot="addLotToItem"
                @remove-lot="removeLotFromItem"
                @update-lot="updateLotField"
                @item-selected="handleItemSelected"
            />

            <Separator />

            <InspectionFormNotes />

            <div v-if="submitError" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {{ submitError }}
            </div>

            <div class="flex items-center justify-between">
                <Button type="button" variant="outline" @click="emit('cancel')" :disabled="isSubmitting"> Cancel </Button>

                <div class="flex gap-3">
                    <Button type="button" variant="secondary" @click="handleDraftSubmit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
                    </Button>
                    <Button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                    </Button>
                </div>
            </div>
        </Form>
    </div>
</template>
