/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Cards (cards24)
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Extract all contributor and guide cards
  const allCardSections = Array.from(element.querySelectorAll('section.experiencefragment'));
  allCardSections.forEach(cardSection => {
    const img = cardSection.querySelector('.cmp-image__image');
    const name = cardSection.querySelector('h3.cmp-title__text');
    const role = cardSection.querySelector('h5.cmp-title__text');
    const socialButtons = Array.from(cardSection.querySelectorAll('.cmp-button'));
    const textCell = document.createElement('div');
    if (name) textCell.appendChild(name.cloneNode(true));
    if (role) textCell.appendChild(role.cloneNode(true));
    if (socialButtons.length) {
      const socialDiv = document.createElement('div');
      socialButtons.forEach(btn => socialDiv.appendChild(btn.cloneNode(true)));
      textCell.appendChild(socialDiv);
    }
    rows.push([
      img ? img.cloneNode(true) : '',
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
