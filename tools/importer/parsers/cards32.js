/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Build the header row
  const headerRow = ['Cards (cards32)'];

  // Find the elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Get all children of elementsContainer (including text nodes)
  const children = Array.from(elementsContainer.childNodes);

  // Find all h2 elements (card titles) and their indexes
  const h2Indexes = children
    .map((el, idx) => el.nodeType === 1 && el.tagName === 'H2' ? idx : -1)
    .filter(idx => idx !== -1);

  if (!h2Indexes.length) return;

  const cardRows = [];
  for (let i = 0; i < h2Indexes.length; i++) {
    const startIdx = h2Indexes[i];
    const endIdx = h2Indexes[i + 1] || children.length;
    // Slice the section for this card
    const section = children.slice(startIdx, endIdx);
    // Find image: look for .cmp-image in section
    let imageEl = null;
    for (const el of section) {
      if (el.nodeType === 1 && el.querySelector) {
        const img = el.querySelector('.cmp-image');
        if (img) {
          imageEl = img;
          break;
        }
      }
    }
    if (!imageEl) continue; // image is mandatory
    // Compose the text cell: title (as heading), then all p's in section
    const textCell = document.createElement('div');
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = children[startIdx].textContent;
    textCell.appendChild(cardTitle);
    // Add all <p> in section (in order)
    section.forEach(el => {
      if (el.nodeType === 1 && el.tagName === 'P') {
        textCell.appendChild(el.cloneNode(true));
      }
    });
    cardRows.push([imageEl, textCell]);
  }

  if (!cardRows.length) return;

  // Compose the table data
  const tableData = [headerRow, ...cardRows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the contentfragment with the new table
  contentFragment.replaceWith(table);
}
