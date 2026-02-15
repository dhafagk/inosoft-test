<script setup lang="ts">
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { FormField, FormInput, FormSelect, FormSwitch, FormDatePicker, type SelectOption } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import type { Yard, Customer, SowTemplate, SowWork, InspectionRecord } from '../../types/inspection';
import SowScopeChips from './SowScopeChips.vue';

const props = defineProps<{
    typeOptions: SelectOption[];
    yards: Yard[];
    customers: Customer[];
    sowTemplates: SowTemplate[];
    sowWorks: SowWork[];
    inspectionRecords: InspectionRecord[];
    status?: 'Draft' | 'New';
    onTypeChange: (typeValue: string) => void;
    onYardChange: (yardId: string) => void;
    onCustomerChange: (customerId: string) => void;
    onSowTemplateChange: (templateId: string) => void;
    onCreateNewSow?: () => void;
}>();

const yardOptions = computed<SelectOption[]>(() =>
    props.yards.map((yard) => ({
        label: `${yard.name} (${yard.code})`,
        value: yard.id,
    })),
);

const customerOptions = computed<SelectOption[]>(() =>
    props.customers.map((customer) => ({
        label: `${customer.name} (${customer.code})`,
        value: customer.id,
    })),
);

const sowTemplateOptions = computed<SelectOption[]>(() =>
    props.sowTemplates.map((template) => ({
        label: template.name,
        value: template.id,
    })),
);

const inspectionRecordOptions = computed<SelectOption[]>(() =>
    props.inspectionRecords.map((record) => ({
        label: `${record.no} - ${record.status}${record.customer_name ? ` (${record.customer_name})` : ''}`,
        value: record.no,
    })),
);
</script>

<template>
    <FieldGroup>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[65%_1%_30%]">
            <div class="space-y-4">
                <div class="flex items-end-safe space-x-4">
                    <FormField name="type" label="Service Type" required>
                        <FormSelect name="type" placeholder="Select service type" :options="typeOptions" @update:model-value="onTypeChange" />
                    </FormField>

                    <FormField name="sow_template" label="Scope of Work (SOW)" required>
                        <FormSelect
                            name="sow_template"
                            placeholder="Select SOW template"
                            :options="sowTemplateOptions"
                            @update:model-value="onSowTemplateChange"
                        />
                    </FormField>
                    <span>or</span>
                    <Button type="button" variant="outline" @click="onCreateNewSow" class="shrink-0"> Create New SOW </Button>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">Scope Included</label>
                    <div class="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background">
                        <SowScopeChips :sow-works="sowWorks" />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField name="yard" label="Location" required>
                        <FormSelect name="yard" placeholder="Select yard" :options="yardOptions" @update:model-value="onYardChange" />
                    </FormField>

                    <FormField name="ecd" label="Estimated Completion Date" required>
                        <FormDatePicker name="ecd" placeholder="Select date" />
                    </FormField>

                    <FormField name="link_to" label="Related To" required>
                        <FormSelect name="link_to" placeholder="Select inspection record" :options="inspectionRecordOptions" />
                    </FormField>
                </div>

                <div class="space-y-4">
                    <div class="border-b pb-2">
                        <h3 class="text-sm font-semibold">Custom Field Header</h3>
                    </div>

                    <FormField name="dc_code" label="D/C Code">
                        <FormInput name="dc_code" placeholder="Enter D/C code" />
                    </FormField>
                </div>
            </div>

            <Separator orientation="vertical" />

            <div class="space-y-4 pr-5">
                <div class="flex flex-row justify-between">
                    <FormField name="charge_to_customer" label="Charge to Customer" class="flex flex-col gap-2" label-class="w-auto!" required>
                        <FormSwitch name="charge_to_customer" class="w-fit! pr-3.75" />
                    </FormField>

                    <div class="space-y-2">
                        <label class="text-sm font-medium">Status</label>
                        <div>
                            <Badge variant="secondary">
                                {{ status }}
                            </Badge>
                        </div>
                    </div>
                </div>

                <FormField name="customer_id" label="Customer Name" required>
                    <FormSelect name="customer_id" placeholder="Select customer" :options="customerOptions" @update:model-value="onCustomerChange" />
                </FormField>
            </div>
        </div>
    </FieldGroup>
</template>
