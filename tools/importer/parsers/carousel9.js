/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel9) block parsing
  // Table: 2 columns, first row is header, each subsequent row is a slide

  // Header row as required
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items (slides)
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // Find the image element inside the slide
    const imageContainer = item.querySelector('.cmp-image');
    let imgEl = null;
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }

    // More flexible text extraction: get all text content from the slide except the image
    // Clone the item to avoid mutating the DOM
    const itemClone = item.cloneNode(true);
    // Remove image containers from the clone
    itemClone.querySelectorAll('.cmp-image, .image').forEach(el => el.remove());
    // Gather all remaining elements (headings, paragraphs, links, etc.)
    const textFragments = [];
    Array.from(itemClone.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        textFragments.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textFragments.push(span);
      }
    });

    // Always create two columns: image and text (empty if no text)
    rows.push([imgEl, textFragments.length > 0 ? textFragments : '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
