/* global WebImporter */
export default function parse(element, { document }) {
  // Clear element first to avoid duplicates
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  // 1. Extract main heading (FAQs)
  const mainTitle = element.querySelector('.cmp-title__text');
  if (mainTitle) {
    const h1 = document.createElement('h1');
    h1.textContent = mainTitle.textContent.trim();
    element.appendChild(h1);
  }

  // 2. Extract hero image (first .cmp-image)
  const heroImg = element.querySelector('.cmp-image');
  if (heroImg) {
    element.appendChild(heroImg.cloneNode(true));
  }

  // 3. Extract intro paragraph (first .cmp-text under main content)
  const introText = element.querySelector('.aem-Grid > .text .cmp-text');
  if (introText) {
    element.appendChild(introText.cloneNode(true));
  }

  // 4. Extract accordion block and build table
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (accordion) {
    const headerRow = ['Accordion (accordion14)'];
    const rows = [headerRow];
    const items = accordion.querySelectorAll('.cmp-accordion__item');
    items.forEach((item) => {
      // Title cell
      let titleText = '';
      const button = item.querySelector('.cmp-accordion__button');
      if (button) {
        const titleSpan = button.querySelector('.cmp-accordion__title');
        if (titleSpan) {
          titleText = titleSpan.textContent.trim();
        } else {
          titleText = button.textContent.trim();
        }
      }
      // Content cell: all children of .cmp-container inside panel
      const panel = item.querySelector('.cmp-accordion__panel');
      let contentCell = '';
      if (panel) {
        const container = panel.querySelector('.cmp-container');
        if (container) {
          const frag = document.createDocumentFragment();
          Array.from(container.children).forEach(child => {
            frag.appendChild(child.cloneNode(true));
          });
          contentCell = frag;
        } else {
          const frag = document.createDocumentFragment();
          Array.from(panel.children).forEach(child => {
            frag.appendChild(child.cloneNode(true));
          });
          contentCell = frag;
        }
      }
      rows.push([titleText, contentCell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.appendChild(table);
  }

  // 5. Extract sidebar (right column) content: title and text
  const sidebar = element.querySelector('.container.responsivegrid.aem-GridColumn--default--none');
  if (sidebar) {
    const sidebarBlocks = sidebar.querySelectorAll('.cmp-title, .cmp-text');
    sidebarBlocks.forEach((block) => {
      element.appendChild(block.cloneNode(true));
    });
  }
}
