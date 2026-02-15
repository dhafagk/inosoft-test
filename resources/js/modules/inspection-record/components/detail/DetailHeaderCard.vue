<script setup lang="ts">
import { Ban } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/utils/formatDate';
import type { DetailRecord } from '../../types/inspection';

defineProps<{
    record: DetailRecord;
}>();
</script>

<template>
    <div class="rounded-lg border bg-white">
        <div class="flex flex-col lg:flex-row">
            <div class="flex-1 p-6">
                <div class="grid grid-cols-3 gap-6">
                    <div>
                        <p class="text-xs text-gray-400">Request No.</p>
                        <p class="text-base font-bold">{{ record.no }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">Service Type</p>
                        <p class="text-sm font-semibold">{{ record.insp_type || '-' }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">Location</p>
                        <p class="text-sm font-semibold">{{ record.yard_name || '-' }}</p>
                    </div>
                </div>

                <div class="mt-5 grid grid-cols-3 gap-6">
                    <div>
                        <p class="text-xs text-gray-400">Date Submitted</p>
                        <p class="text-sm font-semibold">{{ formatDate(record.create_date) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">Estimated Completion Date</p>
                        <p class="text-sm font-semibold">{{ record.ecd || formatDate(record.posting_date) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">Related To</p>
                        <a
                            v-if="record.link_to"
                            :href="`/inspection-record/${record.link_to}`"
                            class="text-sm font-semibold text-teal-600 hover:underline"
                        >
                            {{ record.link_to }}
                        </a>
                        <p v-else class="text-sm text-gray-400">-</p>
                    </div>
                </div>

                <Separator class="my-4" />
                <p class="text-xs text-gray-400">Custom Field Header</p>
                <div class="mt-1">
                    <p class="text-xs text-gray-400">D/C Code</p>
                    <p class="text-sm font-bold">
                        {{ record.items_raw?.[0]?.customer_item_no || '-' }}
                    </p>
                </div>
            </div>

            <div class="flex flex-col border-t lg:w-64 lg:border-t-0 lg:border-l">
                <div class="flex flex-1 items-start justify-between p-6">
                    <div>
                        <p class="text-xs text-gray-400">Charge to customer</p>
                        <p class="mt-1 text-lg font-semibold">{{ record.customer?.name || '-' }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400">Status</p>
                        <Badge variant="outline" class="mt-1">{{ record.status }}</Badge>
                    </div>
                </div>
                <div class="border-t p-4 text-right">
                    <Button
                        v-if="record.status !== 'Cancelled' && record.status !== 'Completed'"
                        variant="outline"
                        size="sm"
                        class="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <Ban class="h-3.5 w-3.5" />
                        Terminate
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
