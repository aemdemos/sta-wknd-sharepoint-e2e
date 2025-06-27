/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row from the spec
  const headerRow = ['Cards (cards22)'];

  // Helper: returns all immediate child sections of a container that are contributor cards
  function getContributorSections(container) {
    return Array.from(container.querySelectorAll(':scope > section.cmp-experience-fragment--contributor'));
  }

  // Helper: extract one card's [image, text] cell array from a section
  function extractCard(section) {
    // Get the image element (img, not its wrapper)
    let img = section.querySelector('.image img');

    // Find text content: the main title (h3), subtitle (h5), and button block
    const titleEl = section.querySelector('.cmp-title h3');
    const subtitleEl = section.querySelector('.cmp-title h5');
    const buttonsBlock = section.querySelector('.cmp-buildingblock--btn-list .aem-Grid');
    
    // Compose content for the text cell
    const textContent = [];
    if (titleEl) {
      // Use <strong> for the card title
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      textContent.push(strong);
    }
    if (subtitleEl) {
      textContent.push(document.createElement('br'));
      textContent.push(document.createTextNode(subtitleEl.textContent));
    }
    if (buttonsBlock) {
      textContent.push(document.createElement('br'));
      textContent.push(buttonsBlock);
    }

    return [img, textContent];
  }

  // The main container for grid content
  const mainGrid = element.querySelector('div.cmp-container');
  if (!mainGrid) return;
  const children = Array.from(mainGrid.children);

  // Find indexes of section headers so we group the right blocks
  let contributorIdx = -1, guidesIdx = -1;
  children.forEach((child, idx) => {
    const h2 = child.querySelector('h2');
    if (h2) {
      if (/Our Contributors/i.test(h2.textContent)) contributorIdx = idx;
      if (/WKND Guides/i.test(h2.textContent)) guidesIdx = idx;
    }
  });

  // Helper to get all contributor card sections after a header up to next header or end
  function getSectionsBetween(startIdx, endIdx) {
    const out = [];
    for (let i = startIdx + 1; i < (endIdx > -1 ? endIdx : children.length); i++) {
      const el = children[i];
      if (el.tagName === 'SECTION' && el.classList.contains('cmp-experience-fragment--contributor')) {
        out.push(el);
      }
    }
    return out;
  }

  // Collect all cards: contributors first, then guides
  const cards = [
    ...getSectionsBetween(contributorIdx, guidesIdx),
    ...getSectionsBetween(guidesIdx, -1)
  ];

  // Compose rows for table: each row is [image, [title, subtitle, buttons]]
  const tableRows = cards.map(extractCard);

  // Only build the table if there is at least one card
  if (tableRows.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...tableRows
    ], document);
    element.replaceWith(table);
  }
}
