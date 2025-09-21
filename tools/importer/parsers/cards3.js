/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.cmp-image__image');
    // Find name/title (h3)
    const nameTitle = section.querySelector('h3');
    // Find subtitle (h5)
    const subtitle = section.querySelector('h5');
    // Find social buttons (all .cmp-button inside section)
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));

    // Compose text cell
    const textCell = document.createElement('div');
    if (nameTitle) textCell.appendChild(nameTitle.cloneNode(true));
    if (subtitle) textCell.appendChild(subtitle.cloneNode(true));
    // Add all .cmp-button__text as CTA links (not the full button)
    if (buttons.length) {
      const btnDiv = document.createElement('div');
      btnDiv.style.display = 'flex';
      btnDiv.style.gap = '8px';
      buttons.forEach(btn => {
        // Only append the text part as a link
        const btnText = btn.querySelector('.cmp-button__text');
        if (btnText) {
          const a = document.createElement('a');
          a.href = btn.href || '#';
          a.textContent = btnText.textContent;
          btnDiv.appendChild(a);
        }
      });
      textCell.appendChild(btnDiv);
    }
    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all card sections
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  cardSections.forEach(section => {
    const card = extractCard(section);
    rows.push(card);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
