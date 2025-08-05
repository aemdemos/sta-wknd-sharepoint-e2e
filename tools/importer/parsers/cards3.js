/* global WebImporter */
export default function parse(element, { document }) {
  // Find all .cmp-text--font-small description elements in order before each cards group
  const allChildren = Array.from(element.children);
  // Find all card sections (contributors/guides)
  const cards = allChildren.filter(el =>
    el.matches && el.matches('section.experiencefragment.cmp-experience-fragment--contributor')
  );
  if (!cards.length) return;

  const cells = [['Cards (cards3)']];

  // Collect all intro/description text blocks that are .cmp-text--font-small and .cmp-text
  // Only include those before first card
  let idx = 0;
  while (idx < allChildren.length) {
    const child = allChildren[idx];
    if (child.matches && child.matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
      break;
    }
    if (child.classList && child.classList.contains('cmp-text--font-small')) {
      const textEl = child.querySelector('.cmp-text') || child;
      if (textEl && textEl.textContent.trim().length > 0) {
        cells.push([textEl]);
      }
    }
    idx++;
  }

  // Add each card
  cards.forEach(card => {
    // --- IMAGE ---
    const img = card.querySelector('img.cmp-image__image');
    // --- TEXT CONTENT ---
    const textContent = [];
    // All .title blocks (typically for name, subtitle)
    const titleBlocks = card.querySelectorAll('.title');
    titleBlocks.forEach(tb => {
      const heading = tb.querySelector('.cmp-title__text');
      if (heading) textContent.push(heading);
    });
    // Social links/buttons
    const btnContainer = card.querySelector('.buildingblock');
    if (btnContainer) {
      const btns = Array.from(btnContainer.querySelectorAll('a.cmp-button'));
      if (btns.length) {
        textContent.push(document.createElement('br'));
        btns.forEach(btn => textContent.push(btn));
      }
    }
    cells.push([
      img,
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
