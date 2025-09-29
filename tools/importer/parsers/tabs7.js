/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Table header row (block name)
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = '';

    // Find the main contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Collect all children except the title
      const fragmentChildren = Array.from(contentFragment.children).filter(
        child => !child.classList.contains('cmp-contentfragment__title')
      );
      // If only one child, use it directly; else, use array
      tabContent = fragmentChildren.length === 1 ? fragmentChildren[0] : fragmentChildren;
    } else {
      // Fallback: Use all children of the panel
      tabContent = Array.from(panel.children);
    }

    // Defensive: If tabContent is empty, fallback to text
    if (!tabContent || (Array.isArray(tabContent) && tabContent.length === 0)) {
      tabContent = panel.textContent.trim();
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
