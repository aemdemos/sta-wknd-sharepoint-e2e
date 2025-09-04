/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a card
  function getImageEl(item) {
    // Find the image inside the nested structure
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (!imgLink) return null;
    const img = imgLink.querySelector('img');
    return img || null;
  }

  // Helper to extract the text content (title, description, cta) from a card
  function getTextContentEl(item) {
    const frag = document.createDocumentFragment();
    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for heading style (as in markdown example)
      const strong = document.createElement('strong');
      strong.textContent = titleLink.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      frag.appendChild(p);
    }
    // CTA (if any, not present in this HTML, but future-proof)
    // If the title link is different from the image link, add as CTA
    // (In this HTML, both links are present, but only title is used as heading)
    return frag;
  }

  // Find the list of cards
  const list = element.querySelector('.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  // Table header
  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  items.forEach((item) => {
    const imageEl = getImageEl(item);
    const textEl = getTextContentEl(item);
    rows.push([
      imageEl,
      textEl
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
