/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the teaser content for a slide
  function extractTeaserContent(teaser) {
    const content = document.createElement('div');
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      // Use h2 as is, but remove class
      const heading = document.createElement('h2');
      heading.textContent = title.textContent.trim();
      content.appendChild(heading);
    }
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description contains block elements (like <p>), preserve them
      Array.from(desc.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          content.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          content.appendChild(p);
        }
      });
    }
    // CTA
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Place CTA at the bottom
      const ctaLink = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      ctaLink.appendChild(a);
      content.appendChild(ctaLink);
    }
    return content.childNodes.length ? content : '';
  }

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slide items
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel22)']);

  items.forEach((item) => {
    // Each item contains a .teaser
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Image: find the first <img> inside .cmp-teaser__image
    let img = null;
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    // Defensive: if no image, skip this slide
    if (!img) return;

    // Text content
    const textContent = extractTeaserContent(teaser);

    // Row: [image, textContent]
    rows.push([img, textContent]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
