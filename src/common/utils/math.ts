

export default class MathUtils{

    static round(num: number, decimalPlaces: number): number {
        const multiplier = Math.pow(10, decimalPlaces);
        return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
    }
    
}