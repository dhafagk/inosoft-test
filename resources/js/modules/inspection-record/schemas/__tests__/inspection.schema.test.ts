import { describe, expect, it } from 'vitest';
import { sowFieldSchema, sowWorkSchema, lotRowSchema, orderItemSchema, createInspectionFormSchema } from '../inspection.schema';

const validSowField = {
    name: 'Field 1',
    type: 'text',
    selected: true,
    value: 'test',
    editableDescription: false,
    requiredDescription: false,
    drift_inspection: false,
};

const validSowWork = {
    _id: 'work-1',
    subscope: 'scope-1',
    subscope_name: 'Scope One',
    fields: [validSowField],
};

const validLotRow = {
    batch: 'BATCH-001',
    allocation: 'ALLOC-1',
    owned: 'OWN-1',
    owned_name: 'Owner One',
    condition: 'new',
    available_qty: 100,
    qty: 10,
    inspection_required: true,
};

const validOrderItem = {
    id_item: 'item-1',
    item_code: 'IC-001',
    item_desc: 'Test Item',
    item_type: 'pipe',
    item_type_name: 'Pipe',
    item_pipe_family: 'PF-1',
    qty: 5,
    lots: [validLotRow],
};

const validCreateForm = {
    type: 'Regular',
    sow_template: 'tmpl-1',
    sow_template_name: 'Template One',
    sow_works: [validSowWork],
    customer_id: 'cust-1',
    customer_name: 'Customer One',
    yard: 'yard-1',
    yard_name: 'Yard One',
    ecd: '2026-03-01',
    items: [validOrderItem],
};

describe('sowFieldSchema', () => {
    it('validates valid data', () => {
        expect(sowFieldSchema.parse(validSowField)).toEqual(validSowField);
    });

    it('rejects missing required fields', () => {
        const result = sowFieldSchema.safeParse({ name: 'Field 1' });
        expect(result.success).toBe(false);
    });
});

describe('sowWorkSchema', () => {
    it('validates valid data', () => {
        expect(sowWorkSchema.parse(validSowWork)).toEqual(validSowWork);
    });

    it('accepts empty fields array', () => {
        const result = sowWorkSchema.parse({ ...validSowWork, fields: [] });
        expect(result.fields).toEqual([]);
    });
});

describe('lotRowSchema', () => {
    it('validates valid data', () => {
        expect(lotRowSchema.parse(validLotRow)).toEqual(validLotRow);
    });

    it('rejects qty less than 1', () => {
        const result = lotRowSchema.safeParse({ ...validLotRow, qty: 0 });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Quantity must be at least 1');
        }
    });

    it('rejects negative available_qty', () => {
        const result = lotRowSchema.safeParse({ ...validLotRow, available_qty: -1 });
        expect(result.success).toBe(false);
    });
});

describe('orderItemSchema', () => {
    it('validates valid data', () => {
        const result = orderItemSchema.parse(validOrderItem);
        expect(result.id_item).toBe('item-1');
    });

    it('applies default expanded = false', () => {
        const { ...withoutExpanded } = validOrderItem;
        const result = orderItemSchema.parse(withoutExpanded);
        expect(result.expanded).toBe(false);
    });

    it('rejects empty id_item', () => {
        const result = orderItemSchema.safeParse({ ...validOrderItem, id_item: '' });
        expect(result.success).toBe(false);
    });

    it('rejects qty less than 1', () => {
        const result = orderItemSchema.safeParse({ ...validOrderItem, qty: 0 });
        expect(result.success).toBe(false);
    });
});

describe('createInspectionFormSchema', () => {
    it('validates valid data', () => {
        const result = createInspectionFormSchema.parse(validCreateForm);
        expect(result.type).toBe('Regular');
    });

    it('applies default values', () => {
        const result = createInspectionFormSchema.parse(validCreateForm);
        expect(result.charge_to_customer).toBe(false);
        expect(result.status).toBe('New');
    });

    it('accepts optional fields', () => {
        const result = createInspectionFormSchema.parse({
            ...validCreateForm,
            insp_type: 'Third Party',
            link_to: 'LINK-001',
            dc_code: 'DC-001',
            notes: 'Some notes',
        });
        expect(result.insp_type).toBe('Third Party');
        expect(result.notes).toBe('Some notes');
    });

    it('rejects empty type', () => {
        const result = createInspectionFormSchema.safeParse({ ...validCreateForm, type: '' });
        expect(result.success).toBe(false);
    });

    it('rejects empty items array', () => {
        const result = createInspectionFormSchema.safeParse({ ...validCreateForm, items: [] });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('At least one item is required');
        }
    });

    it('rejects missing customer_id', () => {
        const result = createInspectionFormSchema.safeParse({ ...validCreateForm, customer_id: '' });
        expect(result.success).toBe(false);
    });

    it('only allows Draft or New status', () => {
        const draft = createInspectionFormSchema.parse({ ...validCreateForm, status: 'Draft' });
        expect(draft.status).toBe('Draft');

        const result = createInspectionFormSchema.safeParse({ ...validCreateForm, status: 'Invalid' });
        expect(result.success).toBe(false);
    });
});
