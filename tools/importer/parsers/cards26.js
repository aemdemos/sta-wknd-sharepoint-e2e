/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (img) from a card item
  function extractImage(card) {
    // Find the image inside the nested structure
    const img = card.querySelector('img');
    return img || '';
  }

  // Helper to extract the text content (title, description, link)
  function extractTextContent(card) {
    const fragment = document.createDocumentFragment();

    // Title (as heading, wrapped in <strong> if possible)
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleLink.textContent.trim();
      fragment.appendChild(strong);
      fragment.appendChild(document.createElement('br'));
    }

    // Description
    const desc = card.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      fragment.appendChild(p);
    }

    // CTA (use the title link if present)
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      fragment.appendChild(cta);
    }

    return fragment;
  }

  // Get all card items
  const cards = Array.from(element.querySelectorAll('li.cmp-image-list__item'));

  // Build table rows
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    // Image cell
    const img = extractImage(card);
    // Text cell
    const textContent = extractTextContent(card);
    rows.push([
      img,
      textContent
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
