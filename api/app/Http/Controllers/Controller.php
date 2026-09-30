<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Return a standard success envelope.
     */
    protected function success(mixed $data, ?string $message = null, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => $message,
        ], $status);
    }

    /**
     * Return a standard error envelope.
     */
    protected function error(string $message, array $errors = [], int $status = 422): JsonResponse
    {
        return response()->json([
            'success' => false,
            'data'    => null,
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }

    /**
     * Return a cursor-paginated success envelope.
     *
     * @param  \Illuminate\Pagination\CursorPaginator  $paginator
     */
    protected function paginatedSuccess(\Illuminate\Pagination\CursorPaginator $paginator, ?string $message = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $paginator->items(),
            'meta'    => [
                'next_cursor' => $paginator->nextCursor()?->encode(),
                'prev_cursor' => $paginator->previousCursor()?->encode(),
                'per_page'    => $paginator->perPage(),
                'has_more'    => $paginator->hasMorePages(),
            ],
            'message' => $message,
        ]);
    }
}
