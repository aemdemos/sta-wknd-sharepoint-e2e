/* global WebImporter */
export default function parse(element, { document }) {
  // Build the block table header row
  const cells = [['Carousel (carousel22)']];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all slides
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    // First column: image
    let imageEl = null;
    const teaserImage = item.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imageEl = teaserImage;
    }

    // Second column: text content
    const textContent = [];
    const contentRoot = item.querySelector('.cmp-teaser__content');
    if (contentRoot) {
      // Title (Heading)
      const title = contentRoot.querySelector('.cmp-teaser__title');
      if (title && title.textContent.trim()) {
        // Use heading element (preserve h2 for semantic structure)
        textContent.push(title);
      }
      // Description
      const desc = contentRoot.querySelector('.cmp-teaser__description');
      if (desc) {
        // If the description contains block elements (like <p>), preserve them; otherwise, wrap in <p>
        if (desc.children.length > 0) {
          Array.from(desc.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) textContent.push(node);
            else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              // Wrap text node in paragraph
              const p = document.createElement('p');
              p.textContent = node.textContent.trim();
              textContent.push(p);
            }
          });
        } else if (desc.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textContent.push(p);
        }
      }
      // CTA (Call to Action) link
      const cta = contentRoot.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textContent.push(cta);
      }
    }

    // Compose the table row (2 columns only)
    cells.push([
      imageEl || '',
      textContent.length ? textContent : '',
    ]);
  });

  // Create the block using WebImporter helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
