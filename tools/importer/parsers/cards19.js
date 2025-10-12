/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards19) block parsing for LA Skateparks article
  // 1. Table header
  const headerRow = ['Cards (cards19)'];

  // Defensive: find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment, article.contentfragment, .cmp-contentfragment');
  if (!contentFragment) return;

  // Find all card sections (each skatepark)
  // Each card: title (h2), description (p), image (img), address (p i b)
  const cardTitles = Array.from(contentFragment.querySelectorAll('.cmp-title--underline .cmp-title__text'));
  if (!cardTitles.length) return;

  // Compose card rows
  const cardRows = cardTitles.map((titleEl, idx) => {
    // Find the containing .cmp-title--underline
    const titleBlock = titleEl.closest('.cmp-title--underline');
    // Find the next card's titleBlock or null
    const nextTitleBlock = cardTitles[idx + 1] ? cardTitles[idx + 1].closest('.cmp-title--underline') : null;
    // Gather all siblings between this titleBlock and the next titleBlock
    let siblings = [];
    if (titleBlock) {
      let sib = titleBlock.nextElementSibling;
      while (sib && sib !== nextTitleBlock) {
        siblings.push(sib);
        sib = sib.nextElementSibling;
      }
    }
    // Find the image (first .image img)
    const imageContainer = siblings.find(sib => sib.classList && sib.classList.contains('image'));
    const imgEl = imageContainer ? imageContainer.querySelector('img') : null;
    // Find the first <p> as description
    const descEl = siblings.find(sib => sib.tagName === 'P');
    // Find the address <p> with <i><b>
    const addrEl = siblings.find(sib => sib.tagName === 'P' && sib.querySelector('i b'));
    // Defensive: If any required part is missing, skip this card
    if (!imgEl || !descEl || !addrEl || !titleEl) return null;
    const textCell = [titleEl.cloneNode(true), descEl.cloneNode(true), addrEl.cloneNode(true)];
    return [imgEl.cloneNode(true), textCell];
  }).filter(Boolean);

  // If no card rows, do nothing
  if (!cardRows.length) return;

  // Compose table
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the content fragment with the table
  contentFragment.replaceWith(table);
}
