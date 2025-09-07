/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a <li>
  function extractCard(li) {
    // Defensive: find the article
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return [null, null];

    // Image cell: find the image inside the image link
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the first <img> inside the image link
      imageEl = imageLink.querySelector('img');
    }

    // Text cell: title, description, cta
    // Title: find the title link and span
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      // Use the link with its span inside
      titleEl = titleLink;
    }
    // Description
    const descEl = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textContent = [];
    if (titleEl) textContent.push(titleEl);
    if (descEl) textContent.push(document.createElement('br'), descEl);
    // No explicit CTA in this markup

    return [imageEl, textContent];
  }

  // Find all cards
  const cards = [];
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
      const [img, text] = extractCard(li);
      if (img && text) {
        cards.push([img, text]);
      }
    });
  }

  // Build table rows
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow, ...cards];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
