/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content grid
  const mainGrid = element.querySelector(':scope > .cmp-container > .aem-Grid');
  if (!mainGrid) return;
  
  // Prepare the block rows for the cards block table
  const rows = [['Cards (cards23)']];

  // Walk the children in order: intro texts and cards will be handled in-order
  Array.from(mainGrid.children).forEach(child => {
    // 1. If this is an intro text block, include as a single-cell row
    if (
      child.classList.contains('cmp-text--font-small') &&
      child.querySelector('.cmp-text')
    ) {
      // Reference the cmp-text node (contains <p><i>...</i></p>)
      const intro = child.querySelector('.cmp-text');
      rows.push([intro]);
      return;
    }
    
    // 2. If this is a card section, extract card info and build the row
    if (child.matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
      // Get image
      const img = child.querySelector('img.cmp-image__image');
      // Compose the text cell using references from the HTML
      const textFrag = document.createElement('div');
      // Name (h3)
      const name = child.querySelector('h3.cmp-title__text');
      if (name) {
        const strong = document.createElement('strong');
        strong.textContent = name.textContent;
        textFrag.appendChild(strong);
        textFrag.appendChild(document.createElement('br'));
      }
      // Subtitle (h5)
      const subtitle = child.querySelector('h5.cmp-title__text');
      if (subtitle) {
        const subtitleSpan = document.createElement('span');
        subtitleSpan.textContent = subtitle.textContent;
        textFrag.appendChild(subtitleSpan);
        textFrag.appendChild(document.createElement('br'));
      }
      // Socials (all .cmp-button a)
      const btns = Array.from(child.querySelectorAll('a.cmp-button'));
      if (btns.length) {
        const btnDiv = document.createElement('div');
        btns.forEach((btn, idx) => {
          btnDiv.appendChild(btn);
          if (idx !== btns.length - 1) btnDiv.appendChild(document.createTextNode(' '));
        });
        textFrag.appendChild(btnDiv);
      }
      if (img && textFrag.textContent.replace(/\s+/g, '').length > 0) {
        rows.push([img, textFrag]);
      }
    }
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
