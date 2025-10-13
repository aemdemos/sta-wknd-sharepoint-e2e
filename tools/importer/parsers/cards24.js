/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor/guide section
  function extractCardsFromSection(sectionEls) {
    const cards = [];
    sectionEls.forEach((section) => {
      // Find the innermost container with the card content
      const container = section.querySelector('.cmp-container .cmp-container .cmp-container') || section.querySelector('.cmp-container .cmp-container') || section.querySelector('.cmp-container');
      if (!container) return;
      // Get image
      const imgDiv = container.querySelector('.image .cmp-image__image');
      let img = null;
      if (imgDiv) {
        img = imgDiv;
      }
      // Get name (h3)
      const nameDiv = container.querySelector('h3.cmp-title__text');
      // Get subtitle (h5)
      const subtitleDiv = container.querySelector('h5.cmp-title__text');
      // Get button group
      const btnContainer = container.querySelector('.buildingblock, .cmp-buildingblock--btn-list, .aem-Grid');
      let buttons = [];
      if (btnContainer) {
        buttons = Array.from(btnContainer.querySelectorAll('a.cmp-button'));
      }
      // Compose text cell
      const textCell = [];
      if (nameDiv) {
        textCell.push(nameDiv.cloneNode(true));
      }
      if (subtitleDiv) {
        textCell.push(subtitleDiv.cloneNode(true));
      }
      if (buttons.length > 0) {
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '8px';
        buttons.forEach((btn) => {
          btnRow.appendChild(btn.cloneNode(true));
        });
        textCell.push(btnRow);
      }
      cards.push([img, textCell]);
    });
    return cards;
  }

  // Compose header row
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find all sections for contributors and guides
  const allSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Contributors section: first 4
  const contributorSections = allSections.slice(0, 4);
  // Guides section: next 3
  const guideSections = allSections.slice(4);

  // Extract section headings and descriptions
  const contributorsHeading = element.querySelector('.title.cmp-title--underline h2.cmp-title__text');
  const contributorsDesc = element.querySelector('.text.cmp-text--font-small .cmp-text i') || element.querySelector('.text.cmp-text--font-small .cmp-text p');
  const guidesHeading = Array.from(element.querySelectorAll('.title.cmp-title--underline h2.cmp-title__text')).find(h => h.textContent.includes('WKND Guides'));
  const guidesDesc = Array.from(element.querySelectorAll('.text.cmp-text--font-small .cmp-text i, .text.cmp-text--font-small .cmp-text p')).find(p => p.textContent.includes('travel guides'));

  // Add contributors heading/desc as a card row (image cell empty)
  if (contributorsHeading || contributorsDesc) {
    const cell = [];
    if (contributorsHeading) cell.push(contributorsHeading.cloneNode(true));
    if (contributorsDesc) cell.push(contributorsDesc.cloneNode(true));
    rows.push(['', cell]);
  }
  // Add contributor cards
  rows.push(...extractCardsFromSection(contributorSections));

  // Add guides heading/desc as a card row (image cell empty)
  if (guidesHeading || guidesDesc) {
    const cell = [];
    if (guidesHeading) cell.push(guidesHeading.cloneNode(true));
    if (guidesDesc) cell.push(guidesDesc.cloneNode(true));
    rows.push(['', cell]);
  }
  // Add guides cards
  rows.push(...extractCardsFromSection(guideSections));

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
