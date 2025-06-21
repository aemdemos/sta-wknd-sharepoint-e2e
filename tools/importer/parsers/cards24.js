/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const cells = [['Cards (cards24)']];

  // Gather all card sections
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');

  // PREP: Find all intro (group-level) text nodes and map them to the relevant set of cards.
  // We'll take preceding .title (with h2) and next .text for each group.
  const allTitles = Array.from(element.querySelectorAll('div.cmp-title--underline'));
  const allTexts = Array.from(element.querySelectorAll('div.cmp-text'));
  // Get all groups as {titleNode, textNode, cards: []}
  let groups = [];
  for (let i = 0; i < allTitles.length; i++) {
    const titleDiv = allTitles[i];
    // Next .cmp-text after this title is the intro
    let intro = null;
    let next = titleDiv.nextElementSibling;
    while (next && !next.classList.contains('cmp-text')) next = next.nextElementSibling;
    if (next && next.classList.contains('cmp-text')) intro = next;
    // Find cards until the next title or the end
    const cards = [];
    let startSection = intro ? intro.nextElementSibling : titleDiv.nextElementSibling;
    while (startSection &&
      !(startSection.classList.contains('cmp-title--underline')) &&
      !allTitles.includes(startSection)) {
      if (startSection.matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
        cards.push(startSection);
      }
      startSection = startSection.nextElementSibling;
    }
    groups.push({titleDiv, intro, cards});
  }

  // For each group and card, build a row. Prepend intro text to the first card in each group.
  groups.forEach(({intro, cards}) => {
    cards.forEach((section, idx) => {
      // --- IMAGE CELL ---
      let img = section.querySelector('img') || '';
      // --- TEXT CELL ---
      const textParts = [];
      // Add intro text to first card in group
      if (idx === 0 && intro) {
        // Use the actual <p> or whatever is inside .cmp-text
        Array.from(intro.children).forEach(child => textParts.push(child));
      }
      // Card name/title/subtitle
      section.querySelectorAll('h3, h5').forEach(el => textParts.push(el));
      section.querySelectorAll('p').forEach(el => textParts.push(el));
      // Social buttons
      const buttons = section.querySelectorAll('a.cmp-button');
      if (buttons.length > 0) {
        const btnDiv = document.createElement('div');
        buttons.forEach(btn => btnDiv.appendChild(btn));
        textParts.push(btnDiv);
      }
      const textCell = textParts.length ? textParts : '';
      cells.push([img, textCell]);
    });
  });

  // Build table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
