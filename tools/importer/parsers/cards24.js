/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the text cell content for one card
  function extractTextCell(section) {
    const wrapper = document.createElement('div');
    // Find all .title blocks in order
    const titleBlocks = Array.from(section.querySelectorAll('.title'));
    let first = true;
    titleBlocks.forEach(titleBlock => {
      const txt = titleBlock.querySelector('.cmp-title__text');
      if (txt) {
        if (first) {
          // The main name/title: bold
          const strong = document.createElement('strong');
          strong.textContent = txt.textContent;
          wrapper.appendChild(strong);
          first = false;
        } else {
          wrapper.appendChild(document.createElement('br'));
          wrapper.appendChild(document.createTextNode(txt.textContent));
        }
      }
    });
    // Add social links/buttons (a.cmp-button)
    const ctas = section.querySelectorAll('a.cmp-button');
    if (ctas.length > 0) {
      wrapper.appendChild(document.createElement('br'));
      const ctaDiv = document.createElement('div');
      ctas.forEach(a => ctaDiv.appendChild(a));
      wrapper.appendChild(ctaDiv);
    }
    return wrapper;
  }

  // Build the table structure
  const cells = [
    ['Cards (cards24)'] // header row
  ];

  // Find all card-like contributor blocks
  const sections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  sections.forEach(section => {
    // Find the first image (avatar/photo) in the card
    const img = section.querySelector('img');
    // Extract all text content (name, subtitle, social)
    const textCell = extractTextCell(section);
    // Only add rows if we found an image and any text content
    if (img && textCell.textContent.trim()) {
      cells.push([img, textCell]);
    }
  });

  // Only replace if at least one card was found
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
