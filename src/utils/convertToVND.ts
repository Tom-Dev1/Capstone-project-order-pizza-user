
export const convertToVND = (amount: number): string => {
    return amount.toLocaleString("en-US").replace(/\./g, ",")
};
