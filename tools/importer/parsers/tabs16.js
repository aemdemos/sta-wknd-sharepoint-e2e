/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels in order
  const tabLabelNodes = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  if (tabLabelNodes.length === 0) return;
  const tabLabels = tabLabelNodes.map(li => li.textContent.trim());

  // Get the tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: only keep as many panels as labels
  const panels = tabPanels.slice(0, tabLabels.length);

  // For each panel, prefer .contentfragment inside, else panel itself
  function extractTabContent(panel) {
    const cf = panel.querySelector('.contentfragment');
    return cf ? cf : panel;
  }

  // Build the table: header row, followed by one row per tab (label, content)
  const cells = [
    ['Tabs (tabs16)'],
    ...tabLabels.map((label, idx) => [label, extractTabContent(panels[idx])])
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
