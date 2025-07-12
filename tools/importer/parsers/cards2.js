/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified in the example
  const headerRow = ['Cards (cards2)'];
  const cards = [];

  // --- All Articles Cards ---
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
      const img = li.querySelector('img');
      // Compose text cell: strong title, then description (all as text, not as a node)
      const textCell = document.createElement('div');
      const titleSpan = li.querySelector('.cmp-image-list__item-title');
      const descSpan = li.querySelector('.cmp-image-list__item-description');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCell.appendChild(strong);
      }
      if (descSpan && descSpan.textContent.trim()) {
        if (textCell.childNodes.length > 0) {
          textCell.appendChild(document.createElement('br'));
        }
        textCell.append(descSpan.textContent.trim());
      }
      cards.push([img, textCell]);
    });
  }

  // --- Members Only Teaser Cards ---
  const memberTeasers = element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure');
  memberTeasers.forEach((teaser) => {
    const img = teaser.querySelector('img');
    const textCell = document.createElement('div');
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
    }
    // Description (could be a div or <p> inside div)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      if (textCell.childNodes.length > 0) {
        textCell.appendChild(document.createElement('br'));
      }
      textCell.append(desc.textContent.trim());
    }
    // CTA
    const cta = teaser.querySelector('.cmp-teaser__action-container');
    if (cta && cta.textContent.trim()) {
      textCell.appendChild(document.createElement('br'));
      textCell.append(cta.textContent.trim());
    }
    cards.push([img, textCell]);
  });

  if (cards.length > 0) {
    const rows = [headerRow, ...cards];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
