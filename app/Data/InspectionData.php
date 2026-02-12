<?php

namespace App\Data;

use Illuminate\Support\Str;

class InspectionData
{
    private static string $filePath = 'app/data/inspection_records.json';

    public static function yards(): array
    {
        return [
            [
                'id' => '65b366808f07e83c4e7a4b23',
                'name' => 'MHPC',
                'code' => 'MHPC',
            ],
        ];
    }

    public static function customers(): array
    {
        return [
            [
                'id' => '5e49e7e48ac96a718736e3f2',
                'name' => 'MITME',
                'code' => 'MITME',
            ],
        ];
    }

    public static function tpiCompanies(): array
    {
        return [
            [
                'id' => '5e9ef269b1a73d755847ec7e',
                'name' => 'NOV Middle East Oil and Gas Wells Equipments and Devices L.L.C',
            ],
        ];
    }

    public static function items(): array
    {
        return [
            [
                'id' => '62972983244a9372244224ff',
                'item_code' => 'ITM001278',
                'item_desc' => 'Casing 13 3/8", 68 PPF, L80, JFELION, R3, Coated',
                'item_type' => '0',
                'item_type_name' => 'Casing',
                'item_pipe_family' => 'OCTG',
            ],
        ];
    }

    /**
     * Get all records from the JSON file.
     */
    public static function all(): array
    {
        return self::readFile();
    }

    /**
     * Find a record by its "no" field.
     */
    public static function findByNo(string $no): ?array
    {
        return collect(self::readFile())->firstWhere('no', $no);
    }

    /**
     * Get records filtered by status.
     */
    public static function getByStatus(string $status): array
    {
        return collect(self::readFile())->where('status', $status)->values()->all();
    }

    /**
     * Store a new record and return it.
     */
    public static function store(array $data): array
    {
        $records = self::readFile();

        $record = array_merge(self::defaultRecord(), $data, [
            'id' => Str::random(24),
            'create_date' => now()->timestamp,
        ]);

        $records[] = $record;
        self::writeFile($records);

        return $record;
    }

    public static function findYard(string $id): ?array
    {
        return collect(self::yards())->firstWhere('id', $id);
    }

    public static function findCustomer(string $id): ?array
    {
        return collect(self::customers())->firstWhere('id', $id);
    }

    public static function findTpiCompany(string $id): ?array
    {
        return collect(self::tpiCompanies())->firstWhere('id', $id);
    }

    public static function findItem(string $id): ?array
    {
        return collect(self::items())->firstWhere('id', $id);
    }

    private static function filePath(): string
    {
        return storage_path(self::$filePath);
    }

    private static function readFile(): array
    {
        $path = self::filePath();

        if (! file_exists($path)) {
            self::writeFile(self::seedRecords());
        }

        return json_decode(file_get_contents($path), true) ?? [];
    }

    private static function writeFile(array $records): void
    {
        $dir = dirname(self::filePath());
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents(self::filePath(), json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private static function defaultRecord(): array
    {
        return [
            'status' => 'Open',
            'unit' => null,
            'yard' => null,
            'yard_name' => null,
            'type' => null,
            'insp_type' => null,
            'screening_number' => 1,
            'progress' => 0,
            'link_to' => null,
            'id_transfer' => null,
            'id_trans' => null,
            'id_si' => null,
            'iwo' => null,
            'carrier' => null,
            'arrival_date' => null,
            'transfer_condition' => null,
            'operator_name' => null,
            'operator_sign' => null,
            'action' => null,
            'batch_action' => null,
            'rack' => null,
            'template' => null,
            'use_sow' => null,
            'cancel_reason' => null,
            'cancel_date' => null,
            'revision_no' => 0,
            'revision_date' => null,
            'imei' => null,
            'qty' => 0,
            'total_lisi' => 0,
            'customer' => null,
            'tpi' => null,
            'tpi_name' => null,
            'notes' => null,
            'approved_by' => null,
            'approved_at' => null,
            'posting_date' => null,
            'created_by_id' => null,
            'created_by_name' => null,
            'updated_by_id' => null,
            'updated_by_name' => null,
            'invoiced' => null,
            'invoiced_at' => null,
            'invoiced_by' => null,
            'items_raw' => [],
            'reserved_stock' => [],
            'released_stock' => [],
            'lisi' => [],
            'stages' => [],
            'works' => [],
            'drift_inspections' => [],
            'journaled' => [],
            'sow' => [],
        ];
    }

    private static function seedRecords(): array
    {
        return [
            [
                'id' => '67f9540009889f1437009344',
                'no' => 'RRIN-2025-0002',
                'status' => 'Completed',
                'unit' => 'FT',
                'yard' => '65b366808f07e83c4e7a4b23',
                'yard_name' => 'MHPC',
                'type' => '11',
                'insp_type' => 'Return Inspection',
                'screening_number' => 1,
                'progress' => 100.0,
                'link_to' => 'RRIN-2025-0002',
                'id_transfer' => '6777a26f8a359a4f7c364c25',
                'id_trans' => null,
                'id_si' => null,
                'iwo' => null,
                'carrier' => null,
                'arrival_date' => null,
                'transfer_condition' => null,
                'operator_name' => null,
                'operator_sign' => null,
                'action' => null,
                'batch_action' => null,
                'rack' => null,
                'template' => null,
                'use_sow' => null,
                'cancel_reason' => null,
                'cancel_date' => null,
                'revision_no' => 0,
                'revision_date' => 1744393216,
                'imei' => null,
                'qty' => 0,
                'total_lisi' => 2,
                'customer' => [
                    'customer' => '5e49e7e48ac96a718736e3f2',
                    'customer_ref' => 'ADNOC MR 10345183 / 10345893 / 10345620',
                    'name' => 'MITME',
                ],
                'tpi' => '5e9ef269b1a73d755847ec7e',
                'tpi_name' => 'NOV Middle East Oil and Gas Wells Equipments and Devices L.L.C',
                'notes' => [
                    'initial' => [
                        'msg' => "2 X Casing,13-3/8\",68LB/FT,L-80,JFELION,Drift:API,R3(40-44FT),STD-01,Coated.\r\nADNOC MR # 10423348.\r\nOLDMR-2024-2168",
                        'by' => 'MITME',
                    ],
                ],
                'approved_by' => 'Eldhos Kunjukunju',
                'approved_at' => 1735893615,
                'posting_date' => 1735893615,
                'create_date' => 1735893615,
                'created_by_id' => '616fe3a5cdcaf435b626a33a',
                'created_by_name' => 'Eldhos Kunjukunju',
                'updated_by_id' => null,
                'updated_by_name' => 'System Tubestream',
                'invoiced' => null,
                'invoiced_at' => null,
                'invoiced_by' => null,
                'items_raw' => [
                    [
                        'id_item' => '62972983244a9372244224ff',
                        'item_code' => 'ITM001278',
                        'item_desc' => 'Casing 13 3/8", 68 PPF, L80, JFELION, R3, Coated',
                        'batch' => 'PO-2024-00457-A-RR',
                        'original_batch' => 'PO-2024-00457-A-RR',
                        'condition' => 'good',
                        'owned' => '5e49e7e48ac96a718736e3f2',
                        'locked' => '5e49e7e48ac96a718736e3f2',
                        'allocation' => 'Unallocated',
                        'tag' => null,
                        'qty' => 2,
                        'id_quarantine' => null,
                        'customer_item_no' => '150013006908',
                        'owned_name' => 'OFFSHORE',
                        'locked_name' => 'OFFSHORE',
                        'item_type' => '0',
                        'item_type_name' => 'Casing',
                        'item_pipe_family' => 'OCTG',
                        'inspected_qty' => 2,
                        'balance' => 0,
                        'inprogress_qty' => 0,
                    ],
                ],
                'reserved_stock' => [
                    [
                        'locked' => '5e49e7e48ac96a718736e3f2',
                        'allocation' => 'Unallocated',
                        'tag' => null,
                        'qty' => 2,
                    ],
                ],
                'released_stock' => [
                    [
                        'id_item' => '62972983244a9372244224ff',
                        'batch' => 'PO-2024-00457-A-RR',
                        'original_condition' => 'good',
                        'condition' => 'good',
                        'owned' => '5e49e7e48ac96a718736e3f2',
                        'locked' => '5e49e7e48ac96a718736e3f2',
                        'allocation' => 'Unallocated',
                        'tag' => null,
                        'qty' => 2,
                        'id_screening' => '67f9540009889f1437009345',
                    ],
                ],
                'lisi' => [
                    [
                        'id' => '68c7cf21c5ff2efac5040a19',
                        'no' => 'SI-2025-0169',
                        'url' => '/index.php/external_document/instruction/det/68c7cf21c5ff2efac5040a19',
                        'type' => 'text',
                    ],
                    [
                        'id' => '68c7cf21c5ff2efac5040a10',
                        'no' => 'SI-2025-0170',
                        'url' => '/index.php/external_document/instruction/det/68c7cf21c5ff2efac5040a10',
                        'type' => 'text',
                    ],
                ],
                'stages' => [],
                'works' => [],
                'drift_inspections' => [],
                'journaled' => [],
                'sow' => [
                    [
                        'template' => '5f17d801b0ae06193e5e3bd6',
                        'template_name' => 'ADNOC Requirements',
                        'items' => [
                            ['id_item' => '62972983244a9372244224ff'],
                        ],
                        'works' => [
                            [
                                '_id' => '5d8a38e7e0bb337413523a8c',
                                'subscope' => '38b3aae109c86bc7435403d21a924649ca1e79b2',
                                'subscope_name' => 'Coating Chemical',
                                'fields' => [
                                    ['name' => 'External GT', 'type' => 'checkbox', 'selected' => false, 'value' => 'External GT', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Internal GT', 'type' => 'checkbox', 'selected' => false, 'value' => 'Internal GT', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                ],
                            ],
                            [
                                '_id' => '5d8a38e7e0bb337413523a8e',
                                'subscope' => 'f60d875bcd98a60f067a50cdb6d790efee55b1c6',
                                'subscope_name' => 'Storage Compound',
                                'fields' => [
                                    ['name' => 'Jet Lube HP', 'type' => 'checkbox', 'selected' => false, 'value' => 'Jet Lube HP', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Kendex', 'type' => 'checkbox', 'selected' => false, 'value' => 'Kendex', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'PTT EP2', 'type' => 'checkbox', 'selected' => false, 'value' => 'PTT EP2', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Bestolife Modified', 'type' => 'checkbox', 'selected' => false, 'value' => 'Bestolife Modified', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                ],
                            ],
                            [
                                '_id' => '5d8a38e7e0bb337413523a86',
                                'subscope' => '90f9b69fcbf8f390ac4d5e5928546de9006014a9',
                                'subscope_name' => 'Inspection',
                                'fields' => [
                                    ['name' => 'Visual Thread', 'type' => 'checkbox', 'selected' => true, 'value' => 'Visual Thread', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Visual Body', 'type' => 'checkbox', 'selected' => true, 'value' => 'Visual Body', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Full Length Drift', 'type' => 'checkbox', 'selected' => true, 'value' => 'Full Length Drift', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => true],
                                    ['name' => 'End Drift', 'type' => 'checkbox', 'selected' => false, 'value' => 'End Drift', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => true],
                                    ['name' => 'Magnetic Particle', 'type' => 'checkbox', 'selected' => false, 'value' => 'Magnetic Particle', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Electro Magnetic', 'type' => 'checkbox', 'selected' => false, 'value' => 'Electro Magnetic', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Thread Gauging', 'type' => 'checkbox', 'selected' => false, 'value' => 'Thread Gauging', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Ring and Plug Gauging', 'type' => 'checkbox', 'selected' => false, 'value' => 'Ring and Plug Gauging', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Hardness Check', 'type' => 'checkbox', 'selected' => false, 'value' => 'Hardness Check', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Wall Thickness Check', 'type' => 'checkbox', 'selected' => false, 'value' => 'Wall Thickness Check', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Ultrasonic', 'type' => 'checkbox', 'selected' => false, 'value' => 'Ultrasonic', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Demagnetize', 'type' => 'checkbox', 'selected' => false, 'value' => 'Demagnetize', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Penetrant Check', 'type' => 'checkbox', 'selected' => false, 'value' => 'Penetrant Check', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Straigthening', 'type' => 'checkbox', 'selected' => false, 'value' => 'Straigthening', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Straigtheness Check', 'type' => 'checkbox', 'selected' => false, 'value' => 'Straigtheness Check', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Hook End Check', 'type' => 'checkbox', 'selected' => false, 'value' => 'Hook End Check', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Visual Sling', 'type' => 'checkbox', 'selected' => false, 'value' => 'Visual Sling', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Visual Hook', 'type' => 'checkbox', 'selected' => false, 'value' => 'Visual Hook', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Visual Shackle', 'type' => 'checkbox', 'selected' => false, 'value' => 'Visual Shackle', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Tally Report', 'type' => 'checkbox', 'selected' => true, 'value' => 'Tally Report', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Coating', 'type' => 'checkbox', 'selected' => false, 'value' => 'Coating', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                ],
                            ],
                            [
                                '_id' => '5d8a38e7e0bb337413523a90',
                                'subscope' => 'dc724af18fbdd4e59189f5fe768a5f8311527050',
                                'subscope_name' => 'Testing',
                                'fields' => [
                                    ['name' => 'Webbing Slings', 'type' => 'checkbox', 'selected' => false, 'value' => 'Webbing Slings', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Wire Slings', 'type' => 'checkbox', 'selected' => false, 'value' => 'Wire Slings', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Spreader Bar', 'type' => 'checkbox', 'selected' => false, 'value' => 'Spreader Bar', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Steel Baskets', 'type' => 'checkbox', 'selected' => false, 'value' => 'Steel Baskets', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Tensile', 'type' => 'checkbox', 'selected' => false, 'value' => 'Tensile', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Chemical', 'type' => 'checkbox', 'selected' => false, 'value' => 'Chemical', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Charpy', 'type' => 'checkbox', 'selected' => false, 'value' => 'Charpy', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Hardness', 'type' => 'checkbox', 'selected' => false, 'value' => 'Hardness', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Silver Nitrate', 'type' => 'checkbox', 'selected' => false, 'value' => 'Silver Nitrate', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                ],
                            ],
                            [
                                '_id' => '5d8a38e7e0bb337413523a92',
                                'subscope' => '246279c5c0ab0418e57c98e62f538d3b706fdd71',
                                'subscope_name' => 'TPI Survellience',
                                'fields' => [
                                    ['name' => 'Loading', 'type' => 'checkbox', 'selected' => false, 'value' => 'Loading', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Unloading', 'type' => 'checkbox', 'selected' => false, 'value' => 'Unloading', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Stuffing Container', 'type' => 'checkbox', 'selected' => false, 'value' => 'Stuffing Container', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Unstuffing Container', 'type' => 'checkbox', 'selected' => false, 'value' => 'Unstuffing Container', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                ],
                            ],
                            [
                                '_id' => '5d8a38e7e0bb337413523a8a',
                                'subscope' => 'e8831801e2fb87001799f58c253616d120c720c3',
                                'subscope_name' => 'Stenciling & Marking',
                                'fields' => [
                                    ['name' => 'API Color Band', 'type' => 'checkbox', 'selected' => false, 'value' => 'API Color Band', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'TRFR & TRFS Color Band', 'type' => 'checkbox', 'selected' => false, 'value' => 'TRFR & TRFS Color Band', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Customer Color Band', 'type' => 'checkbox', 'selected' => false, 'value' => 'Customer Color Band', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Tally Marking Full Length', 'type' => 'checkbox', 'selected' => false, 'value' => 'Tally Marking Full Length', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Tally Marking Running Length', 'type' => 'checkbox', 'selected' => false, 'value' => 'Tally Marking Running Length', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'TPI Stencil Marking', 'type' => 'checkbox', 'selected' => false, 'value' => 'TPI Stencil Marking', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'MITME Lot no.', 'type' => 'checkbox', 'selected' => false, 'value' => 'MITME Lot no.', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                ],
                            ],
                            [
                                '_id' => '5d8a38e7e0bb337413523a88',
                                'subscope' => 'c2040f46102e126d791b2637599a24d57a0f88a9',
                                'subscope_name' => 'Refurbish',
                                'fields' => [
                                    ['name' => 'Internal Coating End', 'type' => 'checkbox', 'selected' => false, 'value' => 'Internal Coating End', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Internal Coating Full Length', 'type' => 'checkbox', 'selected' => false, 'value' => 'Internal Coating Full Length', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'Internal Cleaning/Blowing', 'type' => 'checkbox', 'selected' => false, 'value' => 'Internal Cleaning/Blowing', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'External Cleaning', 'type' => 'checkbox', 'selected' => false, 'value' => 'External Cleaning', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                    ['name' => 'External Coating', 'type' => 'checkbox', 'selected' => false, 'value' => 'External Coating', 'editableDescription' => true, 'requiredDescription' => false, 'drift_inspection' => false],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}