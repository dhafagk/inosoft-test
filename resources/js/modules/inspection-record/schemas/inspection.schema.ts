import { z } from 'zod';

export const sowFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
    selected: z.boolean(),
    value: z.string(),
    editableDescription: z.boolean(),
    requiredDescription: z.boolean(),
    drift_inspection: z.boolean(),
});

export const sowWorkSchema = z.object({
    _id: z.string(),
    subscope: z.string(),
    subscope_name: z.string(),
    fields: z.array(sowFieldSchema),
});

export const lotRowSchema = z.object({
    batch: z.string(),
    allocation: z.string(),
    owned: z.string(),
    owned_name: z.string(),
    condition: z.string(),
    available_qty: z.number().min(0),
    qty: z.number().min(1, 'Quantity must be at least 1'),
    inspection_required: z.boolean(),
});

export const orderItemSchema = z.object({
    id_item: z.string().min(1, 'Item is required'),
    item_code: z.string(),
    item_desc: z.string(),
    item_type: z.string(),
    item_type_name: z.string(),
    item_pipe_family: z.string(),
    qty: z.number().min(1, 'Quantity must be at least 1'),
    expanded: z.boolean().default(false),
    lots: z.array(lotRowSchema),
});

export const createInspectionFormSchema = z.object({
    type: z.string().min(1, 'Type is required'),
    insp_type: z.string().optional(), // Auto-derived from type selection
    sow_template: z.string().min(1, 'SOW template is required'),
    sow_template_name: z.string(),
    sow_works: z.array(sowWorkSchema),
    charge_to_customer: z.boolean().default(false),
    customer_id: z.string().min(1, 'Customer is required'),
    customer_name: z.string(),
    yard: z.string().min(1, 'Yard is required'),
    yard_name: z.string(),
    ecd: z.string().min(1, 'ECD is required'),
    link_to: z.string().optional(),
    dc_code: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['Draft', 'New']).default('New'),
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export type CreateInspectionFormValues = z.infer<typeof createInspectionFormSchema>;
export type OrderItemFormValues = z.infer<typeof orderItemSchema>;
export type LotRowFormValues = z.infer<typeof lotRowSchema>;
