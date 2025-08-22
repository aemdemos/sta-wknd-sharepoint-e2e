/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract a card ([img, text]) from a contributor/guide section
  function extractCard(section) {
    const img = section.querySelector('img');
    const textContainer = document.createElement('div');
    const titles = section.querySelectorAll('.cmp-title__text');
    titles.forEach(title => textContainer.appendChild(title));
    const btns = section.querySelectorAll('.cmp-button');
    if (btns.length) {
      const btnWrap = document.createElement('div');
      btns.forEach(btn => btnWrap.appendChild(btn));
      textContainer.appendChild(btnWrap);
    }
    return [img, textContainer]; // Two columns for a card row only
  }

  // Table cells: header row is always single column
  const cells = [['Cards (cards3)']];

  // Find all contributor/guide card sections
  const allSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Our Contributors intro (single column)
  const h1 = element.querySelector('h1');
  const h2List = Array.from(element.querySelectorAll('h2'));
  const ourContribH2 = h2List.find(h2 => h2.textContent.toLowerCase().includes('contributor'));
  const contribDesc = Array.from(element.querySelectorAll('.cmp-text i, .cmp-text p, .cmp-text'))
    .find(el => el.textContent && el.textContent.toLowerCase().includes('stories across the globe'));
  if (h1 || ourContribH2 || contribDesc) {
    const introDiv = document.createElement('div');
    if (h1) introDiv.appendChild(h1);
    if (ourContribH2) introDiv.appendChild(ourContribH2);
    if (contribDesc) introDiv.appendChild(contribDesc);
    cells.push([introDiv]); // Single column row, correct structure
  }

  // First 4 cards: contributors (two columns)
  for (let i = 0; i < 4 && i < allSections.length; i++) {
    cells.push(extractCard(allSections[i])); // Only cards are two-column
  }

  // Guides intro (single column)
  const wkndGuideH2 = h2List.find(h2 => h2.textContent.toLowerCase().includes('guide'));
  const guideDesc = Array.from(element.querySelectorAll('.cmp-text i, .cmp-text p, .cmp-text'))
    .find(el => el.textContent && el.textContent.toLowerCase().includes('extraordinary travel guides'));
  if (wkndGuideH2 || guideDesc) {
    const guidesDiv = document.createElement('div');
    if (wkndGuideH2) guidesDiv.appendChild(wkndGuideH2);
    if (guideDesc) guidesDiv.appendChild(guideDesc);
    cells.push([guidesDiv]); // Single column row, correct structure
  }

  // Remaining cards: guides (two columns)
  for (let i = 4; i < allSections.length; i++) {
    cells.push(extractCard(allSections[i]));
  }

  // Output table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
