/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block only: header row and FAQ items as two-column rows
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];

  const accordionRoot = element.querySelector('.accordion .cmp-accordion');
  if (accordionRoot) {
    const items = accordionRoot.querySelectorAll('.cmp-accordion__item');
    items.forEach((item) => {
      // Title cell
      let title = '';
      const button = item.querySelector('.cmp-accordion__button');
      if (button) {
        const titleSpan = button.querySelector('.cmp-accordion__title');
        if (titleSpan) {
          title = titleSpan.textContent.trim();
        } else {
          title = button.textContent.trim();
        }
      }
      const titleElem = document.createElement('p');
      titleElem.textContent = title;
      titleElem.style.fontWeight = 'bold';

      // Content cell
      const panel = item.querySelector('.cmp-accordion__panel');
      let contentElem = null;
      if (panel) {
        const textBlock = panel.querySelector('.cmp-text');
        if (textBlock) {
          contentElem = textBlock.cloneNode(true);
        } else {
          // Fallback: use all children of panel
          const frag = document.createDocumentFragment();
          Array.from(panel.children).forEach(child => frag.appendChild(child.cloneNode(true)));
          contentElem = frag;
        }
      }
      rows.push([titleElem, contentElem]);
    });
  }

  // Replace element with the accordion block table only
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
