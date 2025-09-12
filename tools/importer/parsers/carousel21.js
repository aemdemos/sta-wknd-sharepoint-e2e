/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageEl(item) {
    // Find the teaser image container
    const imgContainer = item.querySelector('.cmp-teaser__image');
    if (!imgContainer) return null;
    // Find the actual <img> inside
    const img = imgContainer.querySelector('img');
    return img;
  }

  // Helper to extract the text content (title, description, CTA) from a carousel item
  function getTextContentEl(item) {
    const contentContainer = item.querySelector('.cmp-teaser__content');
    if (!contentContainer) return null;
    // We'll build a fragment with title, description, and CTA (if present)
    const frag = document.createElement('div');
    // Title
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      frag.appendChild(h2);
    }
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description is a <div> with <p>, preserve the <p>; else, wrap in <p>
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
    // CTA
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Add a line break if there is already content
      if (frag.childNodes.length > 0) {
        frag.appendChild(document.createElement('br'));
      }
      frag.appendChild(cta);
    }
    // If nothing was added, return null
    if (!frag.childNodes.length) return null;
    return frag;
  }

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all carousel items (slides)
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel21)']);

  // Each slide: [image, text content]
  items.forEach((item) => {
    const img = getImageEl(item);
    const text = getTextContentEl(item);
    // Defensive: only add row if image exists
    if (img) {
      rows.push([img, text || '']);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
