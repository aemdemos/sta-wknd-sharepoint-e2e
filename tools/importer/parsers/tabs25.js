/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs, .tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (the main tab container)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabLabels = tabLabelEls.map(el => el.textContent.trim());

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!label || !panel) continue;

    // For tab content: grab all direct children of the tabpanel
    // If there's only one child, use it directly; otherwise, use a fragment
    let tabContent;
    // Remove aria-hidden panels (not active) from the DOM to avoid duplication
    panel.removeAttribute('aria-hidden');
    // Defensive: use a DocumentFragment to collect all content
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => {
      // Only append element nodes or text nodes with content
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        frag.appendChild(node.cloneNode(true));
      }
    });
    tabContent = frag.childNodes.length === 1 ? frag.firstChild : frag;

    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabsRoot with the table
  tabsRoot.replaceWith(table);
}
