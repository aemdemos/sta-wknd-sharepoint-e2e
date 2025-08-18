/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children)
    .map(li => li.textContent.trim());

  // Extract tab panels (order must match labels)
  const panelSelector = '[data-cmp-hook-tabs="tabpanel"]';
  const tabPanels = Array.from(tabsBlock.querySelectorAll(panelSelector));

  // Defensive: skip if mismatch in labels/panels
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header row (block name, exactly as prescribed)
  const headerRow = ['Tabs (tabs7)'];

  // Tab labels row (each label as a single cell, preserving formatting)
  const labelsRow = tabLabels.map(label => {
    // Use <strong> for tab labels for clarity and match screenshot
    const strong = document.createElement('strong');
    strong.textContent = label;
    return strong;
  });

  // Tab content row: reference the whole tab panel content for each tab
  const contentRow = tabPanels.map(panel => {
    // Find the main content inside each panel
    // If there is a contentfragment article, use it, else use panel itself
    const fragment = panel.querySelector('article') || panel;
    return fragment;
  });

  // Compose cells array as required (header, labels, content)
  const cells = [
    headerRow,
    labelsRow,
    contentRow,
  ];
  
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsBlock with the block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
