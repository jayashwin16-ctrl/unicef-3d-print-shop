# Product Images

Place your product photos here. The images should be named:

- `globe-keychain.jpg` - Globe keychain product photo
- `puzzle-set.jpg` - Mini puzzle set product photo
- `desk-organizer.jpg` - Desk organizer product photo
- `star-badge.jpg` - Star badge product photo
- `dragon.jpg` - 3D dragon product photo

## How to use your own images:

1. Take photos of your 3D-printed items
2. Name them as listed above (or update the `image` field in `src/data/products.ts`)
3. Place them in this folder (`public/images/`)
4. Update `src/data/products.ts` to use local paths like `/images/your-image.jpg`

## Current setup:

The site currently uses placeholder images from Unsplash. Replace the `image` URLs in `src/data/products.ts` with your local image paths once you add photos here.

## Image recommendations:

- **Format**: JPG or PNG
- **Size**: 800x600px or larger (will be automatically resized)
- **Aspect ratio**: 4:3 or 16:9 works well
- **File size**: Keep under 500KB for fast loading
