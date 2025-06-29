/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels in order
  const tabs = Array.from(tabsRoot.querySelectorAll('[role="tab"]'));
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: if there is a mismatch in number, only process up to min
  const count = Math.min(tabs.length, tabPanels.length);

  // Header row per requirements
  const rows = [['Tabs (tabs15)']];

  for (let i = 0; i < count; i++) {
    const tabLabel = tabs[i].textContent.trim();
    // Try to find article within tabpanel for main content
    let tabContent = null;
    const panel = tabPanels[i];
    let article = panel ? panel.querySelector('article') : null;
    if (article) {
      tabContent = article;
    } else if (panel) {
      // If no article, grab whatever is inside the tabpanel
      tabContent = document.createElement('div');
      // Only append element children (skip whitespace/text)
      Array.from(panel.children).forEach(child => {
        tabContent.appendChild(child);
      });
    } else {
      tabContent = '';
    }
    rows.push([tabLabel, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
