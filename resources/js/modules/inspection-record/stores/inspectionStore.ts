import axios from 'axios';
import { defineStore } from 'pinia';
import type { Yard, Customer, SowTemplate, Item, InspectionRecord } from '@/modules/inspection-record/types/inspection';

interface InspectionStoreState {
    yards: Yard[];
    customers: Customer[];
    sowTemplates: SowTemplate[];
    items: Item[];
    inspectionRecords: InspectionRecord[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
}

export const useInspectionStore = defineStore('inspection', {
    state: (): InspectionStoreState => ({
        yards: [],
        customers: [],
        sowTemplates: [],
        items: [],
        inspectionRecords: [],
        isLoading: false,
        isInitialized: false,
        error: null,
    }),

    getters: {
        getYardById: (state) => (id: string) => {
            return state.yards.find((yard) => yard.id === id);
        },

        getCustomerById: (state) => (id: string) => {
            return state.customers.find((customer) => customer.id === id);
        },

        getSowTemplateById: (state) => (id: string) => {
            return state.sowTemplates.find((template) => template.id === id);
        },

        getItemById: (state) => (id: string) => {
            return state.items.find((item) => item.id === id);
        },

        getInspectionRecordByNo: (state) => (no: string) => {
            return state.inspectionRecords.find((record) => record.no === no);
        },
    },

    actions: {
        async fetchYards() {
            try {
                const response = await axios.get('/api/inspection/yards');
                this.yards = response.data;
            } catch (err) {
                console.error('Error fetching yards:', err);
                throw new Error('Failed to fetch yards');
            }
        },

        async fetchCustomers() {
            try {
                const response = await axios.get('/api/inspection/customers');
                this.customers = response.data;
            } catch (err) {
                console.error('Error fetching customers:', err);
                throw new Error('Failed to fetch customers');
            }
        },

        async fetchSowTemplates() {
            try {
                const response = await axios.get('/api/inspection/sow-templates');
                this.sowTemplates = response.data;
            } catch (err) {
                console.error('Error fetching SOW templates:', err);
                throw new Error('Failed to fetch SOW templates');
            }
        },

        async fetchItems() {
            try {
                const response = await axios.get('/api/inspection/items');
                this.items = response.data;
            } catch (err) {
                console.error('Error fetching items:', err);
                throw new Error('Failed to fetch items');
            }
        },

        async fetchInspectionRecords() {
            try {
                const response = await axios.get('/api/inspection');
                this.inspectionRecords = response.data.map((record: any) => ({
                    id: record.id,
                    no: record.no,
                    status: record.status,
                    customer_name: record.customer?.name,
                }));
            } catch (err) {
                console.error('Error fetching inspection records:', err);
                throw new Error('Failed to fetch inspection records');
            }
        },

        async initializeReferenceData() {
            if (this.isInitialized) {
                return;
            }

            this.isLoading = true;
            this.error = null;

            try {
                await Promise.allSettled([
                    this.fetchYards(),
                    this.fetchCustomers(),
                    this.fetchSowTemplates(),
                    this.fetchItems(),
                    this.fetchInspectionRecords(),
                ]);

                this.isInitialized = true;
            } catch (err) {
                console.error('Error initializing reference data:', err);
                this.error = err instanceof Error ? err.message : 'Failed to initialize reference data';
            } finally {
                this.isLoading = false;
            }
        },

        async refreshInspectionRecords() {
            await this.fetchInspectionRecords();
        },

        addInspectionRecord(record: InspectionRecord) {
            this.inspectionRecords.unshift(record);
        },

        updateInspectionRecord(no: string, updates: Partial<InspectionRecord>) {
            const index = this.inspectionRecords.findIndex((record) => record.no === no);
            if (index !== -1) {
                this.inspectionRecords[index] = { ...this.inspectionRecords[index], ...updates };
            }
        },

        resetStore() {
            this.yards = [];
            this.customers = [];
            this.sowTemplates = [];
            this.items = [];
            this.inspectionRecords = [];
            this.isLoading = false;
            this.isInitialized = false;
            this.error = null;
        },
    },
});
