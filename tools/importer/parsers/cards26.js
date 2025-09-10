/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we have the expected structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Find image (first cell)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Defensive: find the actual image element inside the link
      imageEl = imageLink.querySelector('img');
      // If imageEl exists, use the image element directly
      // For cards, we want just the image, not the link
      if (!imageEl) {
        // Fallback: use the whole imageLink if no img found
        imageEl = imageLink;
      }
    }

    // Text content (second cell)
    const textContent = [];
    // Title (as heading, with link if present)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element, wrap in link if present
        let heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        if (titleLink.href) {
          const link = document.createElement('a');
          link.href = titleLink.href;
          link.appendChild(heading);
          textContent.push(link);
        } else {
          textContent.push(heading);
        }
      }
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textContent.push(p);
    }

    // Compose row: [image, textContent]
    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
