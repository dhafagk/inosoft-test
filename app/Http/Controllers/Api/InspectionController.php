<?php

namespace App\Http\Controllers\Api;

use App\Data\InspectionData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InspectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $records = InspectionData::all();

        if ($request->has('status')) {
            $records = InspectionData::getByStatus($request->query('status'));
        }

        return response()->json($records);
    }

    public function show(string $no): JsonResponse
    {
        $record = InspectionData::findByNo($no);

        if (! $record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json($record);
    }

    public function yards(): JsonResponse
    {
        return response()->json(InspectionData::yards());
    }

    public function customers(): JsonResponse
    {
        return response()->json(InspectionData::customers());
    }

    public function tpiCompanies(): JsonResponse
    {
        return response()->json(InspectionData::tpiCompanies());
    }

    public function store(Request $request): JsonResponse
    {
        $record = InspectionData::store($request->all());

        return response()->json($record, 201);
    }

    public function items(): JsonResponse
    {
        return response()->json(InspectionData::items());
    }
}