/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor/guide card sections
  const sectionNodes = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));
  if (!sectionNodes.length) return;

  const headerRow = ['Cards (cards24)'];
  const cardRows = sectionNodes.map(section => {
    // Get image (first .image img)
    const img = section.querySelector('.image img');

    // Text content: name, subtitle, plus any additional .cmp-text or social buttons
    const textCellEls = [];
    // All .title elements (to retain heading semantics)
    const titleBlocks = Array.from(section.querySelectorAll('.title'));
    titleBlocks.forEach(block => {
      // Only append immediate children (heading), not nested .title
      const heading = block.querySelector('.cmp-title__text');
      if (heading) textCellEls.push(heading);
    });
    // All .cmp-text elements (sometimes used for description)
    Array.from(section.querySelectorAll('.cmp-text')).forEach(textEl => {
      Array.from(textEl.childNodes).forEach(node => textCellEls.push(node));
    });
    // Social links (if any)
    const btns = section.querySelectorAll('.buildingblock a.cmp-button');
    if (btns.length) {
      const btnWrap = document.createElement('div');
      btns.forEach(btn => btnWrap.appendChild(btn));
      textCellEls.push(btnWrap);
    }
    return [img, textCellEls];
  });

  const table = WebImporter.DOMUtils.createTable([headerRow, ...cardRows], document);
  element.replaceWith(table);
}
