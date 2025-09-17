/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs36)'];

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (tab content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build rows for each tab
  const rows = tabLabels.map((li, idx) => {
    // Tab label text
    const label = li.textContent.trim();

    // Tab panel content
    const panel = tabPanels[idx];

    // Defensive: Find the main content fragment inside the panel
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      // Use the entire contentfragment element for resilience
      tabContent = cf;
    } else {
      // Fallback: use all children of panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tabContent.appendChild(node.cloneNode(true)));
    }

    return [label, tabContent];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
