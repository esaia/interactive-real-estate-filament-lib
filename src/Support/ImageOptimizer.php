<?php

namespace IrepPlugin\FilamentIrep\Support;

use Illuminate\Support\Facades\Log;

/**
 * Re-encodes uploaded raster images to WebP, downscaling anything larger than
 * MAX_DIMENSION on its long edge. Used by every admin upload path so images
 * never reach the public disk at camera/render resolution.
 *
 * Uses Imagick when available and falls back to GD. Every method returns null
 * rather than throwing, so callers can always fall back to storing the
 * original file untouched.
 */
class ImageOptimizer
{
    /** Long-edge cap in pixels. Images below this are never upscaled. */
    public const MAX_DIMENSION = 2560;

    /** WebP encoding quality. */
    public const QUALITY = 82;

    /**
     * Mime types worth re-encoding. SVG, GIF, PDF and video are deliberately
     * excluded: SVG is already small and would be rasterized, animated GIFs
     * would lose their animation, and the IREP uploader accepts pdf/mp4.
     */
    protected const CONVERTIBLE = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/webp',
        'image/bmp',
        'image/tiff',
        'image/avif',
    ];

    public static function isConvertible(?string $mime): bool
    {
        return $mime !== null && in_array(strtolower($mime), self::CONVERTIBLE, true);
    }

    /**
     * Encoded WebP binary for the image at $sourcePath, or null when the image
     * cannot (or need not) be converted — the caller should then store the
     * original file as-is.
     */
    public static function toWebp(string $sourcePath): ?string
    {
        if (! is_readable($sourcePath)) {
            return null;
        }

        [$width, $height] = @getimagesize($sourcePath) ?: [0, 0];

        // Already WebP and within the cap: nothing to gain from a re-encode.
        if (
            $width > 0
            && $width <= self::MAX_DIMENSION
            && $height <= self::MAX_DIMENSION
            && strtolower((string) @mime_content_type($sourcePath)) === 'image/webp'
        ) {
            return null;
        }

        return static::encodeWithImagick($sourcePath)
            ?? static::encodeWithGd($sourcePath);
    }

    protected static function encodeWithImagick(string $sourcePath): ?string
    {
        if (! extension_loaded('imagick')) {
            return null;
        }

        try {
            $image = new \Imagick($sourcePath);

            if (! in_array('WEBP', $image->queryFormats(), true)) {
                $image->clear();

                return null;
            }

            // Bake in the EXIF orientation before stripping the metadata that
            // describes it, otherwise phone photos come out rotated.
            static::autoOrient($image);
            $image->stripImage();

            [$width, $height] = static::targetSize($image->getImageWidth(), $image->getImageHeight());
            if ($width !== null) {
                $image->resizeImage($width, $height, \Imagick::FILTER_LANCZOS, 1);
            }

            $image->setImageFormat('webp');
            $image->setImageCompressionQuality(self::QUALITY);

            $binary = $image->getImageBlob();
            $image->clear();

            return $binary ?: null;
        } catch (\Throwable $e) {
            Log::warning('ImageOptimizer: Imagick encode failed, falling back to GD.', [
                'path' => $sourcePath,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    protected static function encodeWithGd(string $sourcePath): ?string
    {
        if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
            return null;
        }

        // GD decodes to an uncompressed truecolor bitmap in memory. Exhausting
        // memory_limit is a fatal error that no try/catch can rescue, so bail
        // out up front and let the caller store the original instead.
        if (! static::gdCanAfford($sourcePath)) {
            Log::warning('ImageOptimizer: image too large for GD, storing original.', ['path' => $sourcePath]);

            return null;
        }

        try {
            $image = @imagecreatefromstring((string) file_get_contents($sourcePath));

            if ($image === false) {
                return null;
            }

            imagepalettetotruecolor($image);
            imagealphablending($image, false);
            imagesavealpha($image, true);

            [$width, $height] = static::targetSize(imagesx($image), imagesy($image));
            if ($width !== null) {
                $scaled = imagescale($image, $width, $height, IMG_BICUBIC);

                if ($scaled !== false) {
                    imagedestroy($image);
                    $image = $scaled;
                    imagealphablending($image, false);
                    imagesavealpha($image, true);
                }
            }

            $target = tempnam(sys_get_temp_dir(), 'webp');
            $ok = $target !== false && imagewebp($image, $target, self::QUALITY);
            imagedestroy($image);

            if (! $ok) {
                return null;
            }

            $binary = (string) file_get_contents($target);
            @unlink($target);

            return $binary !== '' ? $binary : null;
        } catch (\Throwable $e) {
            Log::warning('ImageOptimizer: GD encode failed, storing original.', [
                'path' => $sourcePath,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Whether GD can decode this image within the remaining memory_limit.
     * Budgets 4 bytes per pixel for the source bitmap plus the same again for
     * the scaled copy, with headroom for GD's own overhead.
     */
    protected static function gdCanAfford(string $sourcePath): bool
    {
        [$width, $height] = @getimagesize($sourcePath) ?: [0, 0];

        if ($width < 1 || $height < 1) {
            return false;
        }

        $limit = static::memoryLimitInBytes();

        if ($limit === null) {
            return true; // Unlimited.
        }

        $needed = (int) ($width * $height * 4 * 2 * 1.3);

        return ($limit - memory_get_usage(true)) > $needed;
    }

    /** The memory_limit in bytes, or null when unlimited. */
    protected static function memoryLimitInBytes(): ?int
    {
        $limit = trim((string) ini_get('memory_limit'));

        if ($limit === '' || $limit === '-1') {
            return null;
        }

        $value = (int) $limit;

        return match (strtolower(substr($limit, -1))) {
            'g' => $value * 1024 * 1024 * 1024,
            'm' => $value * 1024 * 1024,
            'k' => $value * 1024,
            default => $value,
        };
    }

    /**
     * Dimensions to resize to, or [null, null] when the image already fits.
     *
     * @return array{0: ?int, 1: ?int}
     */
    protected static function targetSize(int $width, int $height): array
    {
        $longest = max($width, $height);

        if ($longest <= self::MAX_DIMENSION || $longest === 0) {
            return [null, null];
        }

        $ratio = self::MAX_DIMENSION / $longest;

        return [
            max(1, (int) round($width * $ratio)),
            max(1, (int) round($height * $ratio)),
        ];
    }

    protected static function autoOrient(\Imagick $image): void
    {
        switch ($image->getImageOrientation()) {
            case \Imagick::ORIENTATION_TOPRIGHT:
                $image->flopImage();
                break;
            case \Imagick::ORIENTATION_BOTTOMRIGHT:
                $image->rotateImage('#000', 180);
                break;
            case \Imagick::ORIENTATION_BOTTOMLEFT:
                $image->flopImage();
                $image->rotateImage('#000', 180);
                break;
            case \Imagick::ORIENTATION_LEFTTOP:
                $image->flopImage();
                $image->rotateImage('#000', -90);
                break;
            case \Imagick::ORIENTATION_RIGHTTOP:
                $image->rotateImage('#000', 90);
                break;
            case \Imagick::ORIENTATION_RIGHTBOTTOM:
                $image->flopImage();
                $image->rotateImage('#000', 90);
                break;
            case \Imagick::ORIENTATION_LEFTBOTTOM:
                $image->rotateImage('#000', -90);
                break;
            default:
                return;
        }

        $image->setImageOrientation(\Imagick::ORIENTATION_TOPLEFT);
    }
}
