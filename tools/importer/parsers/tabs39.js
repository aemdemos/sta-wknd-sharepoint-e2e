/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside this element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (the list items in .cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.children) : [];
  if (tabLabelEls.length === 0) return; // Bail if no tabs

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Map tab labels to corresponding tab panels by order
  // Defensive: Only pair up as many tabs as we have content for
  const tabCount = Math.min(tabLabelEls.length, tabPanels.length);

  // 1. Compose header row
  const headerRow = ['Tabs (tabs39)'];
  // 2. Compose tab label row: one cell per tab, content is textContent of each label
  const labelRow = [];
  for (let i = 0; i < tabCount; i++) {
    labelRow.push(tabLabelEls[i].textContent.trim());
  }

  // 3. Compose tab content row: one cell per tab, content is the corresponding tab panel's content (reference, not clone)
  const contentRow = [];
  for (let i = 0; i < tabCount; i++) {
    const panel = tabPanels[i];
    // Find just the content fragment/article inside the panel (usually 1), else fallback to panel
    let mainContent = panel.querySelector('article');
    if (!mainContent) {
      // Sometimes panel may have direct content, use first child or the panel itself
      mainContent = panel.firstElementChild || panel;
    }
    contentRow.push(mainContent);
  }

  // Build the cells array
  const cells = [
    headerRow,
    labelRow,
    contentRow,
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table, maintaining location
  tabsBlock.replaceWith(table);
}
