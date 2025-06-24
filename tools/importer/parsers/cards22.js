/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards22)'];
  const cells = [headerRow];

  // Get immediate children to follow source structure order
  const allChildren = Array.from(element.children);
  let i = 0;
  while (i < allChildren.length) {
    // Find intro text (any .cmp-text--font-small .cmp-text) just before a block of cards
    let introTextEl = null;
    // Look ahead for intro text before a set of card sections
    let j = i;
    while (j < allChildren.length && !allChildren[j].matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
      if (allChildren[j].matches('.text.cmp-text--font-small')) {
        const candidate = allChildren[j].querySelector('.cmp-text');
        if (candidate) introTextEl = candidate;
      }
      j++;
    }
    // If we are now at card(s), insert intro paragraph if found
    if (introTextEl && j < allChildren.length && allChildren[j].matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
      cells.push([introTextEl]);
    }
    // Now process all contiguous card sections
    let sawAnyCard = false;
    while (i < allChildren.length && allChildren[i].matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
      sawAnyCard = true;
      const section = allChildren[i];
      const img = section.querySelector('img');
      const textEls = [];
      const allTitles = section.querySelectorAll('.cmp-title__text');
      allTitles.forEach(el => textEls.push(el));
      const buttonLinks = section.querySelectorAll('.cmp-button');
      if (buttonLinks.length > 0) {
        const socialDiv = document.createElement('div');
        buttonLinks.forEach(btn => {
          socialDiv.appendChild(btn);
        });
        textEls.push(socialDiv);
      }
      if (textEls.length === 0) {
        section.querySelectorAll('h3, h5, p').forEach(el => textEls.push(el));
      }
      cells.push([
        img || '',
        textEls.length ? textEls : ''
      ]);
      i++;
    }
    if (!sawAnyCard) i++;
  }

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
