import sharp from 'sharp';

/**
 * 🚀 PERFORMANCE: Optimize uploaded images
 * Reduces image size by 70-90% while maintaining quality
 */
export const optimizeImage = async (req, res, next) => {
    try {
        // Check if file exists and is an image
        if (!req.file || !req.file.mimetype.startsWith('image/')) {
            return next();
        }

        console.log(`📸 Optimizing image: ${req.file.originalname}`);

        const startSize = req.file.buffer.length;

        // Optimize the image
        const optimized = await sharp(req.file.buffer)
            .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 85 })
            .toBuffer();

        const endSize = optimized.length;
        const reduction = ((startSize - endSize) / startSize * 100).toFixed(1);

        console.log(`✅ Image optimized: ${(startSize / 1024).toFixed(1)}KB → ${(endSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);

        // Replace buffer with optimized version
        req.file.buffer = optimized;
        req.file.mimetype = 'image/webp';
        req.file.originalname = req.file.originalname.replace(/\.[^.]+$/, '.webp');

        next();
    } catch (err) {
        console.error('Image optimization error:', err);
        // Continue without optimization if error occurs
        next();
    }
};

/**
 * Optimize multiple images
 */
export const optimizeImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        console.log(`📸 Optimizing ${req.files.length} images`);

        await Promise.all(
            req.files.map(async (file) => {
                if (file.mimetype.startsWith('image/')) {
                    const optimized = await sharp(file.buffer)
                        .resize(1200, 1200, {
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .webp({ quality: 85 })
                        .toBuffer();

                    file.buffer = optimized;
                    file.mimetype = 'image/webp';
                }
            })
        );

        console.log(`✅ ${req.files.length} images optimized`);
        next();
    } catch (err) {
        console.error('Images optimization error:', err);
        next();
    }
};

export default { optimizeImage, optimizeImages };
