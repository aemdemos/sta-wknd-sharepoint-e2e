/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image list container
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Build the header row
  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Defensive: find the article content
    const article = item.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the image element inside the link
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive: fallback if image not found
    if (!imageEl) {
      imageEl = document.createElement('span');
      imageEl.textContent = 'Image not found';
    }

    // Text cell: create a container for title + description
    const textContainer = document.createElement('div');
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent;
        textContainer.appendChild(heading);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Add a line break if there's a title
      if (textContainer.childNodes.length > 0) {
        textContainer.appendChild(document.createElement('br'));
      }
      textContainer.appendChild(document.createTextNode(descSpan.textContent));
    }
    // Optionally, add CTA (link) at the bottom if present and not already used for title
    // In this structure, the title is already a link, so skip additional CTA.

    // Add row: [image, text]
    rows.push([imageEl, textContainer]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
