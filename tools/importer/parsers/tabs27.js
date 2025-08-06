/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get tab labels (li in tablist)
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (tab content)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: Block name exactly as specified
  const headerRow = ['Tabs (tabs27)'];

  // Each subsequent row: [label, content]
  const contentRows = tabLabels.map((li, idx) => {
    // Extract tab label text
    const tabText = li.textContent.trim();

    // Find corresponding tab panel via aria-controls, fallback to order
    let panel = null;
    if (li.hasAttribute('aria-controls')) {
      const panelId = li.getAttribute('aria-controls');
      panel = tabsWrapper.querySelector(`#${panelId}`);
    }
    if (!panel) {
      panel = tabPanels[idx];
    }
    if (!panel) return null;

    // Reference the main content inside the tab panel
    // Try to find contentfragment, or fallback to all children of panel
    let contentElem = panel.querySelector('.contentfragment');
    if (!contentElem) {
      // fallback: grab all children
      const frag = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => frag.appendChild(node));
      contentElem = frag;
    }

    return [tabText, contentElem];
  }).filter(Boolean);

  // Compose the table cells
  const cells = [headerRow, ...contentRows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
