/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Find all card items
  const cardItems = imageList.querySelectorAll('.cmp-image-list__item');

  cardItems.forEach((cardItem) => {
    // Card content container
    const content = cardItem.querySelector('.cmp-image-list__item-content');
    if (!content) return;

    // --- Image cell ---
    // Find the image link (contains image)
    const imageLink = content.querySelector('.cmp-image-list__item-image-link');
    let imageCell = null;
    if (imageLink) {
      // Find the actual image element inside the link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        imageCell = imageLink;
      }
    }

    // --- Text cell ---
    const textElements = [];
    // Title (as heading, preserve link if present)
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create a heading element for the title, and wrap in link if present
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        if (titleLink.href) {
          const a = document.createElement('a');
          a.href = titleLink.href;
          a.textContent = heading.textContent;
          heading.textContent = '';
          heading.appendChild(a);
        }
        textElements.push(heading);
      }
    }
    // Description
    const descSpan = content.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textElements.push(p);
    }
    // Compose row
    rows.push([imageCell, textElements]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
