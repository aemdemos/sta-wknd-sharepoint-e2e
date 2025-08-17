/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards24)'];

  // Find the main container grid to preserve sibling order
  const mainGrid = element.querySelector('div.cmp-container > div.aem-Grid');
  if (!mainGrid) return;
  const orderedChildren = Array.from(mainGrid.children);

  // Find all card sections (each card group)
  const cardSections = orderedChildren.filter(child => child.tagName === 'SECTION' && child.classList.contains('experiencefragment'));

  // Helper: find the nearest previous .cmp-text sibling (intro text) for a card section
  function getIntroText(section) {
    const idx = orderedChildren.indexOf(section);
    if (idx < 0) return null;
    for (let i = idx - 1; i >= 0; i--) {
      const cmpText = orderedChildren[i].querySelector && orderedChildren[i].querySelector('.cmp-text');
      if (cmpText && cmpText.textContent.trim()) return cmpText;
    }
    return null;
  }

  // Compose all card rows
  const rows = cardSections.map(section => {
    // Image (first <img> in .image)
    const img = section.querySelector('.image img');
    // Intro text (nearest previous .cmp-text, if any)
    const introText = getIntroText(section);
    // Card titles (all .cmp-title__text)
    const titleEls = Array.from(section.querySelectorAll('.cmp-title__text'));
    // Social buttons (all <a.cmp-button> in .buildingblock)
    const buttonBlock = section.querySelector('.buildingblock');
    let socials = null;
    if (buttonBlock) {
      const buttons = Array.from(buttonBlock.querySelectorAll('a.cmp-button'));
      if (buttons.length) {
        socials = document.createElement('div');
        buttons.forEach(btn => {
          socials.appendChild(btn);
        });
      }
    }
    // Compose text cell: intro, title(s), socials
    const cellContent = [];
    if (introText) cellContent.push(introText);
    if (titleEls.length) cellContent.push(...titleEls);
    if (socials) cellContent.push(socials);
    // Only single element if just one
    const textCell = cellContent.length === 1 ? cellContent[0] : cellContent;
    return [img, textCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
