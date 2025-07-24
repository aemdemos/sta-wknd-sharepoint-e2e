/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // --- Add intro/descriptive text rows if present ---
  // Get all .title.cmp-title--underline, then next text block (for intro/description)
  const allTitles = Array.from(element.querySelectorAll('.title.cmp-title--underline'));
  allTitles.forEach(titleBlock => {
    // Find the next .text.cmp-text--font-small sibling after this title
    let sibling = titleBlock.nextElementSibling;
    while (sibling) {
      if (sibling.classList && sibling.classList.contains('text')) {
        // Insert the description as a single-cell row
        rows.push([sibling]);
        break;
      }
      sibling = sibling.nextElementSibling;
    }
  });

  // ---- Find all contributor/guide cards as direct sections ----
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  cardSections.forEach(section => {
    // --- Left cell: Image ---
    let imgEl = null;
    const imgDiv = section.querySelector('.image');
    if (imgDiv) {
      imgEl = imgDiv.querySelector('img');
    }

    // --- Right cell: name, subtitle, social links ---
    const rightCell = [];
    // All cmp-title__text in this section (should be name and subtitle)
    const titles = section.querySelectorAll('.cmp-title__text');
    if (titles.length > 0) {
      // First title (name), bold
      const name = document.createElement('strong');
      name.textContent = titles[0].textContent;
      rightCell.push(name);
      // Subtitle(s) (subsequent)
      for (let i = 1; i < titles.length; i++) {
        rightCell.push(document.createElement('br'));
        const subtitle = document.createElement('span');
        subtitle.textContent = titles[i].textContent;
        rightCell.push(subtitle);
      }
    }
    // Social links (all a.cmp-button in section)
    const socials = Array.from(section.querySelectorAll('a.cmp-button'));
    if (socials.length) {
      if (rightCell.length) rightCell.push(document.createElement('br'));
      const btnDiv = document.createElement('div');
      socials.forEach(a => btnDiv.appendChild(a));
      rightCell.push(btnDiv);
    }
    rows.push([
      imgEl,
      rightCell.length ? rightCell : ''
    ]);
  });

  // Only create the table if there is at least the header and one row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
