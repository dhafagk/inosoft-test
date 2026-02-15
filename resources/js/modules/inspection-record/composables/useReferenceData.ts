import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useInspectionStore } from '../stores/inspectionStore';

export function useReferenceData() {
    const inspectionStore = useInspectionStore();

    const { yards, customers, sowTemplates, items, inspectionRecords, isLoading, error } = storeToRefs(inspectionStore);

    onMounted(async () => {
        await inspectionStore.initializeReferenceData();
    });

    const getYardById = (id: string) => inspectionStore.getYardById(id);
    const getCustomerById = (id: string) => inspectionStore.getCustomerById(id);
    const getSowTemplateById = (id: string) => inspectionStore.getSowTemplateById(id);
    const getItemById = (id: string) => inspectionStore.getItemById(id);
    const getInspectionRecordByNo = (no: string) => inspectionStore.getInspectionRecordByNo(no);

    return {
        yards,
        customers,
        sowTemplates,
        items,
        inspectionRecords,
        isLoading,
        error,

        getYardById,
        getCustomerById,
        getSowTemplateById,
        getItemById,
        getInspectionRecordByNo,

        refreshInspectionRecords: inspectionStore.refreshInspectionRecords,
        addInspectionRecord: inspectionStore.addInspectionRecord,
        updateInspectionRecord: inspectionStore.updateInspectionRecord,
    };
}
