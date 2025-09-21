/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildrenBySelector(parent, selector) {
    return Array.from(parent.children).filter((child) => child.matches(selector));
  }

  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Get all tabpanel elements (one per tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // Try to recover by matching by order
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Build table rows
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For tab content, grab the entire tabpanel's content
    // Remove aria attributes and tabpanel wrappers for cleaner output
    // We'll use the first child of tabpanel if it's a contentfragment, else the panel itself
    let tabContentElem = null;
    if (panel.children.length === 1 && panel.firstElementChild.classList.contains('contentfragment')) {
      tabContentElem = panel.firstElementChild;
    } else {
      tabContentElem = panel;
    }

    // Place label and content in row
    rows.push([label, tabContentElem]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block root with the block table
  tabsRoot.replaceWith(block);
}
