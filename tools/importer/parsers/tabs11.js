/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panel nodes (in order)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: header + one row per tab, with correct structure
  const rows = [];
  // Block header (single column)
  rows.push(['Tabs (tabs11)']);

  // Each tab: [Tab Label, Tab Content] (two columns, per example)
  for (let i = 0; i < tabPanels.length; i++) {
    const label = tabLabels[i] || `Tab ${i+1}`;
    const panel = tabPanels[i];
    // Prefer the contentfragment/article if present, else all contents of the panel
    let content = null;
    const mainContent = panel.querySelector('article, .contentfragment, .cmp-contentfragment, .cmp-contentfragment__elements');
    if (mainContent) {
      content = mainContent;
    } else {
      // Fallback: everything inside the tab panel
      const fragment = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(node => fragment.appendChild(node));
      content = fragment;
    }
    rows.push([label, content]);
  }

  // Build block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
