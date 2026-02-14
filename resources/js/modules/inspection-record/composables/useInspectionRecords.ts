import axios from 'axios';
import { computed, ref } from 'vue';
import type { InspectionRequest } from '@/modules/inspection-record/types/inspection';

interface InspectionRecord {
    id: string;
    no: string;
    status: string;
    yard_name?: string;
    insp_type?: string;
    type?: string;
    create_date?: number;
    revision_date?: number;
    link_to?: string;
    tpi_name?: string;
    progress?: number;
    customer?: {
        name: string;
        customer: string;
        customer_ref?: string;
    };
    items_raw?: Array<{
        item_desc?: string;
        owned_name?: string;
        batch?: string;
        qty?: number;
    }>;
}

export function useInspectionRecords() {
    const records = ref<InspectionRecord[]>([]);
    const error = ref<string | null>(null);

    /**
     * Transform a Unix timestamp to ISO date string
     */
    const formatDate = (timestamp?: number): string => {
        if (!timestamp) return '';
        return new Date(timestamp * 1000).toISOString().split('T')[0];
    };

    const transformRecord = (record: InspectionRecord, index: number): InspectionRequest => {
        const subItems = (record.items_raw || []).map((item) => ({
            itemDescription: item.item_desc || '',
            ownership: item.owned_name || '',
            lotNo: item.batch || '',
            qty: item.qty || 0,
            progress: record.progress ? `${Math.round(record.progress)}%` : '0%',
        }));

        const numericId = record.id ? Array.from(record.id).reduce((acc, char) => acc + char.charCodeAt(0), 0) : index + 1;

        return {
            id: numericId,
            requestNo: record.no || '',
            location: record.yard_name || '',
            scopeOfWork: record.customer?.name || '',
            type: record.insp_type || record.type || '',
            dateSubmitted: formatDate(record.create_date),
            ecd: formatDate(record.revision_date), // not sure
            relatedTo: record.link_to || '',
            thirdParty: record.tpi_name || '',
            status: record.status || 'Open',
            subItems,
        };
    };

    /**
     * Filter records by status
     */
    const filterByStatus = (status: string) => {
        return records.value.filter((r) => r.status === status).map((record, index) => transformRecord(record, index));
    };

    /**
     * Computed properties for each status
     */
    const openRecords = computed(() => filterByStatus('Open'));
    const forReviewRecords = computed(() => filterByStatus('For Review'));
    const completedRecords = computed(() => filterByStatus('Completed'));

    /**
     * Fetch inspection records from API
     */
    const fetchRecords = async (status?: string) => {
        error.value = null;

        try {
            const url = status ? `/api/inspection?status=${status}` : '/api/inspection';
            const { data } = await axios.get<InspectionRecord[]>(url);
            records.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch inspection records';
            console.error('Failed to fetch inspection records:', err);
        }
    };

    const refresh = () => fetchRecords();

    return {
        records,
        error,
        openRecords,
        forReviewRecords,
        completedRecords,
        fetchRecords,
        refresh,
        transformRecord,
    };
}
