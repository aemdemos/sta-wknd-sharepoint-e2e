/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide info from a carousel item
  function extractSlideContent(carouselItem) {
    // Find teaser block inside carousel item
    const teaser = carouselItem.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];

    // Image extraction: find the first img inside teaser
    let image = teaser.querySelector('.cmp-teaser__image img');
    if (!image) {
      // Defensive: fallback to any img inside teaser
      image = teaser.querySelector('img');
    }

    // Text content extraction
    const contentArr = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      // Use heading element directly
      contentArr.push(title);
    }
    // Description (div or p)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // Defensive: if description contains a <p>, use its children
      if (desc.children.length === 1 && desc.children[0].tagName === 'P') {
        contentArr.push(desc.children[0]);
      } else {
        contentArr.push(desc);
      }
    }
    // CTA link
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentArr.push(cta);
    }

    // Defensive: if no text content, push null
    const textCell = contentArr.length ? contentArr : null;
    return [image, textCell];
  }

  // Find carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];
  items.forEach((item) => {
    const [image, textCell] = extractSlideContent(item);
    // Only add row if image exists
    if (image) {
      rows.push([image, textCell]);
    }
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
