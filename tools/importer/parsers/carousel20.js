/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide info from carousel item
  function extractSlide(item) {
    // Find teaser block inside the slide
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];

    // Image: always first cell
    let image = null;
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      // Find actual <img>
      image = imageContainer.querySelector('img');
    }

    // Text content: title, description, CTA
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    const textCellContent = [];
    if (contentContainer) {
      // Title
      const title = contentContainer.querySelector('.cmp-teaser__title');
      if (title) textCellContent.push(title);
      // Description
      const desc = contentContainer.querySelector('.cmp-teaser__description');
      if (desc) textCellContent.push(desc);
      // CTA
      const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const ctaLink = ctaContainer.querySelector('a');
        if (ctaLink) textCellContent.push(ctaLink);
      }
    }
    return [image, textCellContent];
  }

  // Find the carousel content area
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slide items
  const items = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');

  // Build table rows
  const headerRow = ['Carousel (carousel20)'];
  const rows = [headerRow];

  items.forEach((item) => {
    const [image, textCellContent] = extractSlide(item);
    // Defensive: if no image, skip this slide
    if (!image) return;
    // Always two columns: image, text
    rows.push([
      image,
      textCellContent.length ? textCellContent : '',
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
