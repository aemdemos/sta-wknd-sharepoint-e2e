/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract text content for a given card section
  function extractCard(section) {
    // Find the card's internal content container
    const container = section.querySelector('.xf-content-height .cmp-container .cmp-container') || section.querySelector('.xf-content-height .cmp-container');
    if (!container) return null;
    const inner = container.querySelector('.cmp-container') || container;

    // Image
    const imageEl = inner.querySelector('.image img');

    // Titles
    const allTitles = inner.querySelectorAll('.cmp-title__text');
    let nameTitle = null;
    let roleTitle = null;
    if (allTitles.length > 0) nameTitle = allTitles[0];
    if (allTitles.length > 1) roleTitle = allTitles[1];

    // Per-card description: .cmp-text, or any <p> or <i> direct children of inner
    let descriptionEls = [];
    // All cmp-text children (usually has <p> or <i> inside)
    inner.querySelectorAll('.cmp-text').forEach(tb => {
      Array.from(tb.children).forEach(child => descriptionEls.push(child));
    });
    // Any loose <p> or <i> directly underneath
    inner.querySelectorAll(':scope > p, :scope > i').forEach(child => {
      descriptionEls.push(child);
    });

    // Social buttons
    const buttonEls = Array.from(inner.querySelectorAll('.cmp-button'));

    // Compose text cell: Name, Role, Description, Buttons
    const textCell = [];
    if (nameTitle) textCell.push(nameTitle);
    if (roleTitle) {
      if (nameTitle) textCell.push(document.createElement('br'));
      textCell.push(roleTitle);
    }
    if (descriptionEls.length) {
      if (nameTitle || roleTitle) textCell.push(document.createElement('br'));
      descriptionEls.forEach(desc => textCell.push(desc));
    }
    if (buttonEls.length) {
      if (textCell.length) textCell.push(document.createElement('br'));
      const btnDiv = document.createElement('div');
      buttonEls.forEach(b => btnDiv.appendChild(b));
      textCell.push(btnDiv);
    }
    if (imageEl && textCell.length) {
      return [imageEl, textCell];
    }
    return null;
  }

  // Find all card sections
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');

  // Find all intro/title/desc nodes before each card group and group cards by section
  // Step 1: Find .cmp-title and .cmp-text blocks and all experiencefragment sections in display order
  const children = Array.from(element.children);
  let cells = [['Cards (cards24)']];
  let pendingIntro = [];
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (
      el.classList &&
      (el.classList.contains('cmp-title') || el.classList.contains('cmp-text'))
    ) {
      // Push any child block of cmp-title or cmp-text (usually a heading or <p>/<i>)
      Array.from(el.children).forEach(child => pendingIntro.push(child));
    } else if (
      el.tagName.toLowerCase() === 'section' &&
      el.classList.contains('experiencefragment') &&
      el.classList.contains('cmp-experience-fragment--contributor')
    ) {
      // If there's a pending intro, add it as a row
      if (pendingIntro.length) {
        cells.push([pendingIntro]);
        pendingIntro = [];
      }
      // Add the card row
      const cardRow = extractCard(el);
      if (cardRow) cells.push(cardRow);
    }
  }

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
