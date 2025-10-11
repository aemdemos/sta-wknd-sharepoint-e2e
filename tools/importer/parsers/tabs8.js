/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block by class
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the actual tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab headers
  const tabHeaderEls = cmpTabs.querySelectorAll('.cmp-tabs__tablist > li');
  // Get tab panels
  const tabPanelEls = cmpTabs.querySelectorAll('[role="tabpanel"]');

  // Defensive: ensure tab headers and panels match
  if (tabHeaderEls.length !== tabPanelEls.length || tabHeaderEls.length === 0) return;

  // Build the header row
  const rows = [
    ['Tabs (tabs8)']
  ];

  // For each tab, extract the label and content
  tabHeaderEls.forEach((tabHeaderEl, idx) => {
    const label = tabHeaderEl.textContent.trim();
    const panel = tabPanelEls[idx];
    // Defensive: skip if missing
    if (!label || !panel) return;

    // Get the main tab content area
    // Usually a .contentfragment inside the tab panel
    let tabContent = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      // Remove the title (e.g., <h3 class="cmp-contentfragment__title">) if present
      const cfClone = cf.cloneNode(true);
      const titleEl = cfClone.querySelector('.cmp-contentfragment__title');
      if (titleEl) titleEl.remove();
      tabContent = cfClone;
    } else {
      // fallback: use the entire panel
      tabContent = panel.cloneNode(true);
    }

    rows.push([
      label,
      tabContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
