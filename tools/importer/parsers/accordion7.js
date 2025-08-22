/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the section
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = Array.from(accordion.querySelectorAll(':scope > .cmp-accordion__item'));

  // Compose the block header -- must exactly match example
  const rows = [['Accordion (accordion7)']];

  items.forEach(item => {
    // Title cell: get title text as it is rendered
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = '';
    if (titleSpan) {
      // Reference the span directly to retain formatting
      titleCell = titleSpan;
    } else {
      // Fallback: Use button text or item id
      const button = item.querySelector('.cmp-accordion__button');
      if (button) {
        titleCell = button.textContent.trim();
      } else {
        titleCell = item.id || 'Accordion Item';
      }
    }

    // Content cell: reference all content inside panel
    let panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // The panel typically contains a container -> cmp-container -> text
      // Get all direct children of the panel that are element nodes
      const panelChildren = Array.from(panel.children).filter(n => n.nodeType === 1);
      if (panelChildren.length === 1 && panelChildren[0].classList.contains('container')) {
        // Reference all children of the inner container
        const innerContainer = panelChildren[0];
        // The next level is usually cmp-container
        const cmpContainer = innerContainer.querySelector('.cmp-container');
        if (cmpContainer) {
          // Use all children (text blocks, etc) as content
          const contentElems = Array.from(cmpContainer.children).filter(n => n.nodeType === 1);
          if (contentElems.length === 1) {
            contentCell = contentElems[0];
          } else if (contentElems.length > 1) {
            contentCell = contentElems;
          } else {
            contentCell = cmpContainer;
          }
        } else {
          contentCell = innerContainer;
        }
      } else if (panelChildren.length > 0) {
        // Reference all children
        contentCell = panelChildren.length === 1 ? panelChildren[0] : panelChildren;
      } else {
        // fallback: use all childNodes (including text)
        contentCell = Array.from(panel.childNodes).filter(
          n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
        );
        if (contentCell.length === 1) contentCell = contentCell[0];
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
