import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

// Error types
export interface ServiceError {
  message: string;
  code?: string;
  status?: number;
}

// Error handling utility
export class ErrorHandler {
  /**
   * Handle service errors with toast notifications
   */
  static handleServiceError(
    error: unknown,
    defaultMessage: string = 'An error occurred'
  ): ServiceError {
    let errorMessage = defaultMessage;
    let errorCode: string | undefined;
    let status: number | undefined;

    // Check for Axios error first
    if (error instanceof AxiosError) {
      status = error.response?.status;

      // Try to extract error message from response
      if (error.response?.data) {
        const responseData = error.response.data as Record<string, unknown>;

        // Handle different response structures
        if (responseData.message) {
          errorMessage = responseData.message as string;
        } else if (responseData.error) {
          const errorData = responseData.error as Record<string, unknown>;
          errorMessage = (errorData.message as string) || errorMessage;
          errorCode = errorData.code as string;
        } else if (responseData.detail) {
          errorMessage = responseData.detail as string;
        }
      }

      // Fallback to Axios error message if no specific message found
      if (errorMessage === defaultMessage && error.message) {
        errorMessage = error.message;
      }

      // Add status-specific messages
      if (status) {
        switch (status) {
          case 400:
            errorMessage = errorMessage.includes('400')
              ? errorMessage
              : `Bad Request: ${errorMessage}`;
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 403:
            errorMessage =
              "Access denied. You don't have permission to perform this action.";
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 422:
            errorMessage = `Validation Error: ${errorMessage}`;
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage =
              'Service temporarily unavailable. Please try again later.';
            break;
        }
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      errorMessage =
        (errorObj.message as string) ||
        ((errorObj.error as Record<string, unknown>)?.message as string) ||
        defaultMessage;
      errorCode =
        (errorObj.code as string) ||
        ((errorObj.error as Record<string, unknown>)?.code as string);
      status =
        (errorObj.status as number) ||
        ((errorObj.response as Record<string, unknown>)?.status as number);
    }

    const serviceError: ServiceError = {
      message: errorMessage,
      code: errorCode,
      status,
    };

    // Log error for debugging
    console.error('Service Error:', serviceError);

    return serviceError;
  }

  /**
   * Show error toast notification
   */
  static showErrorToast(error: ServiceError | string): void {
    const message = typeof error === 'string' ? error : error.message;
    toast.error(message);
  }

  /**
   * Show success toast notification
   */
  static showSuccessToast(message: string): void {
    toast.success(message);
  }

  /**
   * Show info toast notification
   */
  static showInfoToast(message: string): void {
    toast(message, {
      icon: 'ℹ️',
    });
  }

  /**
   * Handle and show error with toast
   */
  static handleAndShowError(
    error: unknown,
    defaultMessage: string = 'An error occurred'
  ): ServiceError {
    const serviceError = this.handleServiceError(error, defaultMessage);
    this.showErrorToast(serviceError);
    return serviceError;
  }
}
