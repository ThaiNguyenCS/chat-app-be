interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
    limit?: number;
    page?: number;
    totalPages?: number;
}

export function successResponse<T>(message: string, data?: T, limit?: number, page?: number, totalPages?: number): ApiResponse<T> {
    if (totalPages && page && limit) {
        return {
            success: true,
            message,
            data,
            page,
            limit,
            totalPages
        };
    }
    return {
        success: true,
        message,
        data,
    };
}

export function errorResponse<T>(message: string, error?: T): ApiResponse<T> {
    return {
        success: false,
        message,
        error,
    };
}