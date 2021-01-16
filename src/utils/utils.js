export const isNonEmptyObject = obj => {
    return obj !== null && obj !== undefined && Object.keys(obj).length > 0;
};