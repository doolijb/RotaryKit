import { ImageSizes } from "./ImageSizes"

export class ImageResolutions {
    static readonly SMALL: [number, number] = [200, 200]
    static readonly MEDIUM: [number, number] = [1280, 720]
    static readonly LARGE: [number, number] = [3840, 2160]

    static Options: typeof ImageResolutions.SMALL | typeof ImageResolutions.MEDIUM | typeof ImageResolutions.LARGE

    static getResolution(size: string): [number, number] {
        switch (size) {
            case ImageSizes.SMALL:
                return ImageResolutions.SMALL
            case ImageSizes.MEDIUM:
                return ImageResolutions.MEDIUM
            case ImageSizes.LARGE:
                return ImageResolutions.LARGE
            default:
                return ImageResolutions.LARGE
        }
    }
}