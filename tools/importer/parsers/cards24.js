/* global WebImporter */
export default function parse(element, { document }) {
  // The table header row must match the example exactly
  const headerRow = ['Cards (cards24)'];
  const cells = [headerRow];

  // Helper to create a card row (image, right content)
  function createCardRow(img, rightContent) {
    return [img, rightContent];
  }

  // --- Find section titles and subtitles (descriptions) ---
  // Find all title blocks with h2 (section titles)
  const sectionTitles = Array.from(element.querySelectorAll('.cmp-title h2.cmp-title__text'));
  // Find all nearby subtitle paragraphs (usually immediately following section title)
  const descBlocks = Array.from(element.querySelectorAll('.cmp-text')).filter(desc => desc.querySelector('i'));

  // Find all contributor blocks
  const contributorSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // There are two sections: contributors (first 4 cards), guides (last 3 cards)
  // 1. Add Our Contributors section title & description as row (empty image cell)
  if (sectionTitles[0] || descBlocks[0]) {
    const rightContent = [];
    if (sectionTitles[0]) rightContent.push(sectionTitles[0]);
    if (descBlocks[0]) rightContent.push(descBlocks[0]);
    cells.push(createCardRow('', rightContent));
  }
  // 2. Add contributors cards (first 4)
  contributorSections.slice(0, 4).forEach(section => {
    // image
    const img = section.querySelector('img');
    // right cell: name, subtitle, buttons
    const rightContent = [];
    // name (h3)
    const headings = Array.from(section.querySelectorAll('.cmp-title__text')).filter(el => el.tagName.startsWith('H'));
    headings.forEach(h => rightContent.push(h));
    // social buttons block (buildingblock)
    const buttonBlock = section.querySelector('.buildingblock');
    if (buttonBlock) rightContent.push(buttonBlock);
    cells.push(createCardRow(img, rightContent));
  });
  // 3. Add WKND Guides section title & description as row (empty image cell)
  if (sectionTitles[1] || descBlocks[1]) {
    const rightContent = [];
    if (sectionTitles[1]) rightContent.push(sectionTitles[1]);
    if (descBlocks[1]) rightContent.push(descBlocks[1]);
    cells.push(createCardRow('', rightContent));
  }
  // 4. Add guides cards (last 3)
  contributorSections.slice(4).forEach(section => {
    // image
    const img = section.querySelector('img');
    // right cell: name, subtitle, buttons
    const rightContent = [];
    const headings = Array.from(section.querySelectorAll('.cmp-title__text')).filter(el => el.tagName.startsWith('H'));
    headings.forEach(h => rightContent.push(h));
    const buttonBlock = section.querySelector('.buildingblock');
    if (buttonBlock) rightContent.push(buttonBlock);
    cells.push(createCardRow(img, rightContent));
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
