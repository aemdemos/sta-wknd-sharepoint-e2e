/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block root
  // There could be multiple accordions on the page, but in this layout, it's the .accordion.panelcontainer
  const accordionPanelContainer = element.querySelector('div.accordion.panelcontainer');
  let accordion;
  if (accordionPanelContainer) {
    accordion = accordionPanelContainer.querySelector('.cmp-accordion');
  } else {
    // fallback: try just .cmp-accordion
    accordion = element.querySelector('.cmp-accordion');
  }
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  const rows = [
    ['Accordion (accordion13)']
  ];

  items.forEach(item => {
    // Title cell: span.cmp-accordion__title inside button
    const button = item.querySelector('.cmp-accordion__button');
    let titleContent = null;
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      titleContent = titleSpan || button;
    } else {
      titleContent = '';
    }
    // Content cell: the direct content inside .cmp-accordion__panel
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentNodes = [];
    if (panel) {
      // Find all children of the panel (preserving any containers, text, or structure)
      // In most AEM exports, content is under container.responsivegrid, get all its children
      // If none, just pass the panel itself
      let containers = Array.from(panel.querySelectorAll(':scope > .container.responsivegrid, :scope > .cmp-container, :scope > .text, :scope > *'));
      // Remove empty containers (if any)
      containers = containers.filter((n) => n && (n.textContent || n.querySelectorAll('*').length > 0));
      if (containers.length > 0) {
        contentNodes = containers;
      } else if (panel.childNodes.length > 0) {
        contentNodes = Array.from(panel.childNodes);
      } else {
        contentNodes = [''];
      }
    } else {
      contentNodes = [''];
    }
    rows.push([
      titleContent,
      contentNodes.length === 1 ? contentNodes[0] : contentNodes
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
