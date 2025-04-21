interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
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