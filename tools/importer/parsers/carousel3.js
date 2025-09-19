/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract teaser content from a carousel item
  function extractTeaserContent(item) {
    // Find the teaser content
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];

    // Image: look for the first <img> inside .cmp-teaser__image
    let img = null;
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // Text content: build a fragment with title, description, CTA
    const frag = document.createElement('div');
    // Title (as heading)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      frag.appendChild(h2);
    }
    // Description (may be plain text or HTML)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // If desc contains block elements, preserve them
      if (desc.children.length > 0) {
        Array.from(desc.childNodes).forEach((node) => {
          frag.appendChild(node.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        frag.appendChild(p);
      }
    }
    // CTA (first .cmp-teaser__action-link)
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Add a line break if there's already content
      if (frag.childNodes.length > 0) {
        frag.appendChild(document.createElement('br'));
      }
      const ctaLink = document.createElement('a');
      ctaLink.href = cta.href;
      ctaLink.textContent = cta.textContent.trim();
      frag.appendChild(ctaLink);
    }
    // If frag is empty, return null
    const textContent = frag.childNodes.length > 0 ? frag : null;
    return [img, textContent];
  }

  // Find the carousel content area
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel3)']);

  // For each slide, extract image and text content
  items.forEach((item) => {
    const [img, textContent] = extractTeaserContent(item);
    // Defensive: image is required, text is optional
    if (img) {
      rows.push([img, textContent || '']);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
