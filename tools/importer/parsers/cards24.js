/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a single card row from a section
  function extractCard(section) {
    const img = section.querySelector('img');
    const texts = Array.from(section.querySelectorAll('.cmp-title__text'));
    const btnBlock = section.querySelector('.buildingblock');
    const textParts = [];
    texts.forEach(t => textParts.push(t));
    if (btnBlock) textParts.push(btnBlock);
    if (img && textParts.length > 0) {
      return [img, textParts];
    }
    return null;
  }

  // Compose the rows
  const rows = [['Cards (cards24)']];
  const children = Array.from(element.children);

  let groupIntro = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // Group header (h2)
    const h2 = child.querySelector && child.querySelector('.cmp-title__text');
    if (h2 && h2.tagName.toLowerCase() === 'h2') {
      groupIntro = [h2];
      // look ahead for cmp-text (description)
      const next = children[i + 1];
      if (next && next.querySelector && next.querySelector('.cmp-text')) {
        const desc = next.querySelector('.cmp-text');
        groupIntro.push(desc);
        i++; // skip desc node
      }
      if (groupIntro.length > 0) rows.push([groupIntro]);
      continue;
    }
    // Card section
    if (child.tagName && child.tagName.toLowerCase() === 'section' && child.classList.contains('cmp-experience-fragment--contributor')) {
      const card = extractCard(child);
      if (card) rows.push(card);
    }
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
