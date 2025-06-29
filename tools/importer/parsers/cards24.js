/* global WebImporter */
export default function parse(element, { document }) {
  // Find all cards (contributors and guides)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  if (!cardSections.length) return;

  const rows = [['Cards (cards24)']];

  cardSections.forEach(card => {
    // First cell: the image (reference, do not clone)
    const img = card.querySelector('img');

    // Second cell: flexible text content
    const cellContent = [];
    // Name (h3)
    const h3 = card.querySelector('h3');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent;
      cellContent.push(strong);
    }
    // Subtitle (h5)
    const h5 = card.querySelector('h5');
    if (h5) {
      if (cellContent.length) cellContent.push(document.createElement('br'));
      const subtitle = document.createElement('span');
      subtitle.textContent = h5.textContent;
      cellContent.push(subtitle);
    }
    // Any description in a <p> or .cmp-text/.text block in the card
    // (Usually not present for these, but allows for flexibility)
    const descs = Array.from(card.querySelectorAll('p'));
    descs.forEach(desc => {
      if (desc.textContent.trim()) {
        if (cellContent.length) cellContent.push(document.createElement('br'));
        cellContent.push(desc);
      }
    });
    // Social links (all .cmp-button anchors)
    const buttons = Array.from(card.querySelectorAll('a.cmp-button'));
    if (buttons.length) {
      cellContent.push(document.createElement('br'));
      const socialDiv = document.createElement('div');
      buttons.forEach(btn => socialDiv.appendChild(btn));
      cellContent.push(socialDiv);
    }
    // Remove any trailing/leading <br>
    while (cellContent.length && cellContent[0].nodeName === 'BR') cellContent.shift();
    while (cellContent.length && cellContent[cellContent.length-1].nodeName === 'BR') cellContent.pop();
    // Add the row, reference existing nodes
    rows.push([
      img,
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
