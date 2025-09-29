/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageEl(item) {
    // Find the teaser image container
    const teaserImageDiv = item.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      // Find the actual image element inside
      const img = teaserImageDiv.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Helper to extract the text content (title, description, CTA) from a carousel item
  function getTextContentEl(item) {
    const contentDiv = document.createElement('div');
    // Title
    const title = item.querySelector('.cmp-teaser__title');
    if (title) {
      // Use an h2 for semantic heading
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      contentDiv.appendChild(h2);
    }
    // Description
    const desc = item.querySelector('.cmp-teaser__description');
    if (desc) {
      // If the description contains block elements (like <p>), append them; otherwise, wrap in <p>
      if (desc.children.length > 0) {
        Array.from(desc.childNodes).forEach((node) => {
          contentDiv.appendChild(node.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentDiv.appendChild(p);
      }
    }
    // CTA (button/link)
    const cta = item.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Place CTA at the bottom
      const ctaLink = document.createElement('a');
      ctaLink.href = cta.href;
      ctaLink.textContent = cta.textContent.trim();
      contentDiv.appendChild(ctaLink);
    }
    // Only return if there's content
    if (contentDiv.childNodes.length > 0) return contentDiv;
    return null;
  }

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items (slides)
  const slideEls = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel23)']);

  // Each slide: [image, text content]
  slideEls.forEach((slide) => {
    // The teaser is the main content inside each slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;
    const imgEl = getImageEl(teaser);
    const textEl = getTextContentEl(teaser);
    // Always put image in first cell, text in second (may be null)
    rows.push([
      imgEl || '',
      textEl || '',
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
