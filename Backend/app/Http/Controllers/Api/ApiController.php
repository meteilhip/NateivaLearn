<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

abstract class ApiController extends Controller
{
    protected function success(mixed $data = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
        ], $code);
    }

    protected function error(string $message, int $code = 400, array $errors = []): JsonResponse
    {
        $payload = ['success' => false, 'message' => $message];
        if (! empty($errors)) {
            $payload['errors'] = $errors;
        }
        return response()->json($payload, $code);
    }
}
