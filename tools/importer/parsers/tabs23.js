/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find tab navigation (tab labels)
  const tabList = tabsRoot.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Find all tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel) => {
    const label = tabLabel.textContent.trim();
    let panel;
    if (tabLabel.hasAttribute('aria-controls')) {
      const panelId = tabLabel.getAttribute('aria-controls');
      panel = tabPanels.find(p => p.id === panelId);
    }
    if (!panel) {
      panel = tabPanels[tabLabels.indexOf(tabLabel)];
    }
    if (!panel) return;
    let content;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      content = panel;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
