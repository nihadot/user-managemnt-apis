export const sanitizePayload = (payload: any): any => {
    if (Array.isArray(payload)) {
        return payload
            .map((item) => sanitizePayload(item))
            .filter((item) => item !== undefined && item !== null && item !== "" && !(typeof item === "object" && Object.keys(item).length === 0));
    } else if (typeof payload === "object" && payload !== null) {
        const sanitizedObject = Object.entries(payload).reduce((acc, [key, value]) => {
            const sanitizedValue = sanitizePayload(value);
            if (sanitizedValue !== undefined && sanitizedValue !== null && sanitizedValue !== "" && !(typeof sanitizedValue === "object" && Object.keys(sanitizedValue).length === 0)) {
                acc[key] = sanitizedValue;
            }
            return acc;
        }, {} as Record<string, any>);
        
        // Remove empty objects
        return Object.keys(sanitizedObject).length > 0 ? sanitizedObject : undefined;
    }
    return payload;
};
