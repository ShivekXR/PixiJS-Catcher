class MathHelpers {
    public static RandomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min
    }

    public static RandomRangeIntIncl(min: number, max: number): number {
        return this.RandomRangeIntExcl(min, max) + 1
    }

    public static RandomRangeIntExcl(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min)
    }
}

export default MathHelpers
