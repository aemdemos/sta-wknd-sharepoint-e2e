/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Tab content panel
    const panelEl = tabPanels[i];

    // Defensive: Find the main content inside the tab panel
    // Usually a .contentfragment or direct children
    let tabContent = null;
    const contentFragment = panelEl.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panelEl.childNodes).forEach((node) => tabContent.appendChild(node.cloneNode(true)));
    }

    rows.push([tabLabel, tabContent]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
