/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ["Cards (cards24)"];
  const rows = [];

  // Find all intro texts (italic paragraphs) and their corresponding card sections
  // We'll pair each intro with the following set of card sections until the next intro or end
  const intros = Array.from(element.querySelectorAll('.cmp-title--underline + .text .cmp-text > p, .cmp-title--underline + .cmp-text .cmp-text > p'));
  // Find all sections (cards)
  const cardSections = Array.from(element.querySelectorAll('.experiencefragment.cmp-experience-fragment--contributor'));

  // Map: intro text node index -> [card section elements]
  let introIndex = -1;
  let introMap = [];
  let introNodes = [];
  // Build an array of all direct children in their DOM order
  const children = Array.from(element.children);
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (
      el.matches('.title.cmp-title--underline') &&
      (children[i+1] && children[i+1].matches('.text, .cmp-text'))
    ) {
      // Next sibling is the .text containing the intro
      const introP = children[i+1].querySelector('.cmp-text > p');
      if (introP) {
        introNodes.push(introP);
        introMap.push([]);
        introIndex++;
      }
    } else if (el.matches('.experiencefragment.cmp-experience-fragment--contributor')) {
      if (introIndex >= 0) {
        introMap[introIndex].push(el);
      }
    }
  }

  // Now, for each intro group, process its cards, attaching the intro to the first card's text cell
  introMap.forEach((sectionGroup, idx) => {
    let introElem = introNodes[idx];
    sectionGroup.forEach((section, sectionIdx) => {
      // --- Image cell ---
      let imgEl = section.querySelector('img.cmp-image__image');
      // --- Text cell ---
      const textCellContents = [];
      // Add intro only to the first card in this group
      if (sectionIdx === 0 && introElem) {
        textCellContents.push(introElem);
      }
      // Title (h3)
      const nameTitle = section.querySelector('h3.cmp-title__text');
      if (nameTitle) textCellContents.push(nameTitle);
      // Subtitle/description (h5)
      const descTitle = section.querySelector('h5.cmp-title__text');
      if (descTitle) textCellContents.push(descTitle);
      // Any paragraphs in card itself not already captured
      const paragraphs = Array.from(section.querySelectorAll('p'));
      paragraphs.forEach(p => {
        if (
          (!introElem || p !== introElem) &&
          (!nameTitle || p.textContent !== nameTitle.textContent) &&
          (!descTitle || p.textContent !== descTitle.textContent)
        ) {
          textCellContents.push(p);
        }
      });
      // Social buttons
      const btnWrap = section.querySelector('.buildingblock');
      if (btnWrap) {
        const btnLinks = Array.from(btnWrap.querySelectorAll('a.cmp-button'));
        btnLinks.forEach(a => textCellContents.push(a));
      }
      // Fallback: all visible text
      if (textCellContents.length === 0) {
        const allText = section.textContent.trim();
        if (allText) {
          const span = document.createElement('span');
          span.textContent = allText;
          textCellContents.push(span);
        }
      }
      rows.push([imgEl, textCellContents]);
    });
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
