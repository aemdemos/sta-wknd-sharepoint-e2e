/* global WebImporter */
export default function parse(element, { document }) {
  // Get all .cmp-text blocks (intro descriptions) in order
  const introBlocks = Array.from(element.querySelectorAll('.cmp-text'));

  // Find all contributor/guide sections
  const allCardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));
  const contributorSections = allCardSections.slice(0, 4);
  const guideSections = allCardSections.slice(4, 7);

  function extractCards(sections) {
    return sections.map(section => {
      const img = section.querySelector('img');
      const textCell = [];
      section.querySelectorAll('.cmp-title__text').forEach(e => textCell.push(e));
      const buttonBlock = section.querySelector('.buildingblock');
      if (buttonBlock) textCell.push(buttonBlock);
      return [img, textCell];
    });
  }

  // Compose all block content: header, intro text, contributor cards, guides intro, guide cards (all as individual rows)
  const cells = [['Cards (cards24)']];
  // First intro text (contributors)
  if (introBlocks[0]) cells.push([introBlocks[0]]);
  extractCards(contributorSections).forEach(row => cells.push(row));
  // Second intro text (guides)
  if (introBlocks[1]) cells.push([introBlocks[1]]);
  extractCards(guideSections).forEach(row => cells.push(row));

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
