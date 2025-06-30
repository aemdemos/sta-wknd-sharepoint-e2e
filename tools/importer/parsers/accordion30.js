/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the given element
  // The block has class 'accordion' and contains the actual cmp-accordion element
  const accordionContainer = element.querySelector('.accordion .cmp-accordion');
  if (!accordionContainer) return;

  // Compose the header row exactly as specified
  const cells = [['Accordion']];

  // Select all accordion items, each one becomes a row
  const items = accordionContainer.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the strong semantic title from .cmp-accordion__title span
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleContent = '';
    if (titleSpan) {
      titleContent = titleSpan.textContent.trim();
    }
    // Use <strong> for the title as a semantic marker (matches example visual)
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = titleContent;

    // Content cell: find the main content of the accordion panel
    // The content is typically inside .cmp-accordion__panel, often deeply nested
    const panel = item.querySelector('.cmp-accordion__panel');
    let panelContent = [];
    if (panel) {
      // Try to find the deepest .cmp-container and grab its element children
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // Grab all children (preserves structure and semantic blocks)
        panelContent = Array.from(cmpContainer.children);
      } else {
        // Fallback: use all children of the panel
        panelContent = Array.from(panel.children);
      }
      // If still empty, fallback to text content
      if (panelContent.length === 0 && panel.textContent.trim()) {
        panelContent = [document.createTextNode(panel.textContent.trim())];
      }
    } else {
      // Defensive: if panel missing, yield empty string
      panelContent = [''];
    }
    cells.push([
      strongTitle,
      panelContent.length === 1 ? panelContent[0] : panelContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace only the accordion block, not the whole section
  accordionContainer.replaceWith(table);
}
