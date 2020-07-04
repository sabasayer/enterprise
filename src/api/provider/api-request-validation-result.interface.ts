export interface IApiRequestValidationResult {
    valid: boolean;
    /**
     * exp: {search:'search field length must be 4-6'}
     */
    errorMessages?: Record<string, string>;
}
