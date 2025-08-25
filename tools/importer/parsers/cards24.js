/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards24)'];

  // Find all experiencefragment sections (contributor/guide cards)
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  const rows = [];

  // Extract all the intro/bio texts for contributors and guides
  // These are typically in div.text.cmp-text--font-small elements just before the sections
  // We'll collect them in order for later assignment
  const introTexts = [];
  // Find all intro paragraphs in the grid, in order
  const gridRoot = element.querySelector('.aem-Grid');
  if (gridRoot) {
    const textDivs = gridRoot.querySelectorAll('.text.cmp-text--font-small .cmp-text p, .text.cmp-text--font-small p');
    textDivs.forEach(p => {
      introTexts.push(p);
    });
  }

  // Use introTexts as group-level descriptions; each is for a group of cards
  // For this HTML: first for Contributors group (4 cards), next for Guides group (3 cards)
  // We'll distribute accordingly
  let cardIndex = 0;
  cardSections.forEach((section, i) => {
    // --- LEFT CELL: Image ---
    const img = section.querySelector('.cmp-image img');

    // --- RIGHT CELL: Name, subtitle, bio, social links ---
    const cellContent = [];
    // Title
    const nameTitle = section.querySelector('h3.cmp-title__text');
    if (nameTitle) cellContent.push(nameTitle);
    // Subtitle
    const subtitle = section.querySelector('h5.cmp-title__text');
    if (subtitle) cellContent.push(subtitle);

    // Add group description at top of first card in each group
    // Contributors: first 4 cards, Guides: next 3 cards
    if (i === 0 && introTexts[0]) {
      cellContent.push(introTexts[0]);
    } else if (i === 4 && introTexts[1]) {
      cellContent.push(introTexts[1]);
    }

    // Social links
    const btnList = section.querySelector('.cmp-buildingblock--btn-list');
    if (btnList) {
      const links = Array.from(btnList.querySelectorAll('a.cmp-button'));
      if (links.length) {
        const container = document.createElement('div');
        container.className = 'card-social-links';
        links.forEach(a => container.appendChild(a));
        cellContent.push(container);
      }
    }
    rows.push([img, cellContent]);
    cardIndex++;
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
