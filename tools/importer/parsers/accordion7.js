/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main Accordion container within the given element
  // Accepts root element that contains many blocks; only processes Accordion
  let accordionContainer = element.querySelector('.accordion.panelcontainer, .cmp-accordion');
  if (!accordionContainer) {
    // Try to find a .cmp-accordion anywhere in this block
    accordionContainer = element.querySelector('.cmp-accordion');
  }
  if (!accordionContainer) {
    return;
  }
  // Might be wrapped, prefer to use .cmp-accordion for uniformity
  const accordion = accordionContainer.querySelector('.cmp-accordion') || accordionContainer;
  // Collect accordion items
  const items = Array.from(accordion.querySelectorAll(':scope > .cmp-accordion__item'));
  if (items.length === 0) {
    // No items, do not replace
    return;
  }
  // Prepare the table rows; first row is header
  const rows = [['Accordion']];
  items.forEach(item => {
    // Title cell: get the title from button > .cmp-accordion__title
    let titleCell = '';
    const btn = item.querySelector('.cmp-accordion__button');
    if (btn) {
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use a heading if present, else plain text
        // Use the closest heading under .cmp-accordion__header if present
        let header = item.querySelector('.cmp-accordion__header');
        let headingEl = null;
        if (header) {
          headingEl = header.querySelector('h1, h2, h3, h4, h5, h6');
        }
        if (headingEl) {
          // Use the existing heading but replace its content with the title text to avoid duplication
          headingEl.textContent = titleSpan.textContent.trim();
          titleCell = headingEl;
        } else {
          // Create a <p> to hold the title text
          const p = document.createElement('p');
          p.textContent = titleSpan.textContent.trim();
          titleCell = p;
        }
      } else {
        titleCell = btn.textContent.trim();
      }
    }
    // Content cell: get the accordion panel content
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Gather content blocks inside the panel
      let fragments = [];
      // Go through children of panel
      Array.from(panel.children).forEach(child => {
        // If child is a container, grab its children
        if (child.classList.contains('container') || child.classList.contains('cmp-container')) {
          Array.from(child.children).forEach(grandChild => {
            fragments.push(grandChild);
          });
        } else {
          fragments.push(child);
        }
      });
      // Clean out empty text nodes
      fragments = fragments.filter(el => {
        if (el.nodeType === Node.ELEMENT_NODE) return true;
        if (el.nodeType === Node.TEXT_NODE && el.textContent.trim().length > 0) return true;
        return false;
      });
      if (fragments.length === 1) {
        contentCell = fragments[0];
      } else if (fragments.length > 1) {
        contentCell = fragments;
      } else {
        // fallback: panel innerHTML as string, in a <div>
        const div = document.createElement('div');
        div.innerHTML = panel.innerHTML;
        contentCell = div;
      }
    }
    rows.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace accordion container with the table
  accordionContainer.replaceWith(table);
}
