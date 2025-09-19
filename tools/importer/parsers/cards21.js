/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getChildrenByClass(parent, className) {
    return Array.from(parent.children).filter((el) => el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // 2. Find all card groups ("Our Contributors" and "WKND Guides")
  // Get all direct children of the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const children = Array.from(grid.children);

  // Helper: parse a card section (contributors/guides)
  function parseCardSection(startIdx, endIdx) {
    for (let i = startIdx; i < endIdx; i++) {
      const section = children[i];
      if (!section || !section.classList.contains('experiencefragment')) continue;
      // Find image
      const img = section.querySelector('img');
      // Find name (h3)
      const name = section.querySelector('h3');
      // Find subtitle (h5)
      const subtitle = section.querySelector('h5');
      // Find social buttons
      const buttons = Array.from(section.querySelectorAll('.cmp-button'));
      // Find description (italic text in intro)
      let description = '';
      // Try to get the intro text for the section
      let introText = '';
      let parent = section.parentElement;
      while (parent && parent !== grid) {
        const textEl = parent.querySelector('.cmp-text i');
        if (textEl) {
          introText = textEl.textContent;
          break;
        }
        parent = parent.parentElement;
      }
      // Compose text cell
      const textCell = [];
      if (name) {
        const h = document.createElement('strong');
        h.textContent = name.textContent;
        textCell.push(h, document.createElement('br'));
      }
      if (subtitle) {
        textCell.push(subtitle.cloneNode(true), document.createElement('br'));
      }
      // Add description if present
      if (introText) {
        const desc = document.createElement('span');
        desc.textContent = introText;
        textCell.push(desc, document.createElement('br'));
      }
      // Add social buttons
      if (buttons.length) {
        const btnDiv = document.createElement('div');
        buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
        textCell.push(btnDiv);
      }
      // Add row
      rows.push([
        img ? img.cloneNode(true) : '',
        textCell
      ]);
    }
  }

  // Find indexes for contributors and guides
  let contribStart = -1, contribEnd = -1, guidesStart = -1, guidesEnd = -1;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.querySelector('h2') && /Our Contributors/i.test(child.textContent)) contribStart = i + 2; // skip title + intro
    if (child.querySelector('h2') && /WKND Guides/i.test(child.textContent)) guidesStart = i + 2; // skip title + intro
    // Find end indexes by next h2 or end of children
    if (contribStart !== -1 && guidesStart === -1 && child.querySelector('h2') && /WKND Guides/i.test(child.textContent)) contribEnd = i;
    if (guidesStart !== -1 && i === children.length - 1) guidesEnd = children.length;
  }
  if (contribStart !== -1 && contribEnd === -1) contribEnd = guidesStart !== -1 ? guidesStart - 2 : children.length;
  if (guidesStart !== -1 && guidesEnd === -1) guidesEnd = children.length;

  // Parse contributors
  if (contribStart !== -1 && contribEnd !== -1) {
    parseCardSection(contribStart, contribEnd);
  }
  // Parse guides
  if (guidesStart !== -1 && guidesEnd !== -1) {
    parseCardSection(guidesStart, guidesEnd);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
