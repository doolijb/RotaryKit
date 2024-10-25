
export class ImageSizes {
    static readonly SMALL = "small"
    static readonly MEDIUM = "medium"
    static readonly LARGE = "large"
    static readonly ORIGINAL = "original"
    static readonly NO_OPTIMIZATION = "no optimization"

    static Option: typeof ImageSizes.SMALL | typeof ImageSizes.MEDIUM | typeof ImageSizes.LARGE | typeof ImageSizes.ORIGINAL | typeof ImageSizes.NO_OPTIMIZATION

    static options = [
        ImageSizes.SMALL,
        ImageSizes.MEDIUM,
        ImageSizes.LARGE,
        ImageSizes.ORIGINAL,
        ImageSizes.NO_OPTIMIZATION
    ]
}