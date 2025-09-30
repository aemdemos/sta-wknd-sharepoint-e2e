/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block in the element
  const accordionWrapper = element.querySelector('.accordion .cmp-accordion');
  if (!accordionWrapper) return;

  // Get all accordion items
  const items = accordionWrapper.querySelectorAll(':scope > .cmp-accordion__item');
  if (!items.length) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Accordion (accordion28)']);

  items.forEach((item) => {
    // Title cell: get the button .cmp-accordion__button > .cmp-accordion__title
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      titleText = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content cell: get the panel
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Defensive: get all direct children of panel except for script/style
      // Usually there's a .container.responsivegrid inside
      const contentContainer = panel.querySelector('.container.responsivegrid');
      if (contentContainer) {
        // Use all children of contentContainer
        const contentChildren = Array.from(contentContainer.children).map(child => child);
        contentCell = contentChildren.length === 1 ? contentChildren[0] : contentChildren;
      } else {
        // fallback: use all children of panel
        const panelChildren = Array.from(panel.children).map(child => child);
        contentCell = panelChildren.length === 1 ? panelChildren[0] : panelChildren;
      }
    }
    rows.push([titleText, contentCell]);
  });

  // Create the table and replace the accordion block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordionWrapper.replaceWith(table);
}
