/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row as required
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    const tabLabel = labelEl.textContent.trim();
    const panelEl = tabPanels[idx];
    if (!panelEl) return;

    // Find the main content inside the panel
    // Usually a contentfragment/article
    let tabContent = null;
    const article = panelEl.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // Fallback: use all children of panelEl
      tabContent = document.createElement('div');
      Array.from(panelEl.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
