/* global WebImporter */
export default function parse(element, { document }) {
  // Use the block name as the header row exactly as specified
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Locate the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Find the image in the slide
    const img = item.querySelector('img');
    if (!img) return; // Defensive: skip if no image
    // Extract caption meta if present
    let caption = '';
    const metaCaption = img.closest('div[data-cmp-is="image"]')?.querySelector('meta[itemprop="caption"]');
    if (metaCaption && metaCaption.content && metaCaption.content.trim()) {
      caption = metaCaption.content.trim();
    }
    // If there is a caption, use two columns; otherwise, only one column
    if (caption) {
      const captionSpan = document.createElement('span');
      captionSpan.textContent = caption;
      rows.push([img, [captionSpan]]);
    } else {
      rows.push([img]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
