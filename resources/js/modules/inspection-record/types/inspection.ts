export interface InspectionSubItem {
    itemDescription: string;
    ownership: string;
    lotNo: string;
    qty: number;
    progress: string;
}

export interface InspectionRequest {
    id: number;
    requestNo: string;
    location: string;
    scopeOfWork: string;
    type: string;
    dateSubmitted: string;
    ecd: string;
    relatedTo: string;
    thirdParty: string;
    status: string;
    subItems: InspectionSubItem[];
}

// --- Create form types ---

export interface SowField {
    name: string;
    type: string;
    selected: boolean;
    value: string;
    editableDescription: boolean;
    requiredDescription: boolean;
    drift_inspection: boolean;
}

export interface SowWork {
    _id: string;
    subscope: string;
    subscope_name: string;
    fields: SowField[];
}

export interface SowTemplate {
    id: string;
    name: string;
    works: SowWork[];
}

export interface Yard {
    id: string;
    name: string;
    code: string;
}

export interface Customer {
    id: string;
    name: string;
    code: string;
}

export interface Item {
    id: string;
    item_code: string;
    item_desc: string;
    item_type: string;
    item_type_name: string;
    item_pipe_family: string;
}

export interface InspectionRecord {
    id: string;
    no: string;
    status: string;
    customer_name?: string;
}

export interface StockEntry {
    id_item: string;
    batch: string;
    allocation: string;
    owned: string;
    owned_name: string;
    condition: string;
    available_qty: number;
}

export interface LotRow {
    batch: string;
    allocation: string;
    owned: string;
    owned_name: string;
    condition: string;
    available_qty: number;
    qty: number;
    inspection_required: boolean;
}

export interface OrderItem {
    id_item: string;
    item_code: string;
    item_desc: string;
    item_type: string;
    item_type_name: string;
    item_pipe_family: string;
    qty: number;
    expanded: boolean;
    lots: LotRow[];
}

// --- Detail page types ---

export interface DetailRecordItem {
    item_code?: string;
    item_desc?: string;
    batch?: string;
    allocation?: string;
    owned_name?: string;
    condition?: string;
    customer_item_no?: string;
    qty?: number;
    balance?: number;
    inspected_qty?: number;
}

export interface DetailRecordSow {
    template_name?: string;
    works: SowWork[];
}

export interface DetailRecord {
    no: string;
    status: string;
    insp_type?: string;
    yard_name?: string;
    create_date?: number;
    posting_date?: number;
    ecd?: string;
    link_to?: string;
    customer?: { name: string };
    items_raw?: DetailRecordItem[];
    sow?: DetailRecordSow[];
    notes?: {
        initial?: { msg?: string; by?: string };
    };
}

// --- Create form types ---

export interface CreateInspectionForm {
    type: string;
    insp_type: string;
    sow_template: string;
    sow_template_name: string;
    sow_works: SowWork[];
    charge_to_customer: boolean;
    customer_id: string;
    customer_name: string;
    yard: string;
    yard_name: string;
    ecd: string;
    link_to: string;
    dc_code: string;
    notes: string;
    items: OrderItem[];
}
