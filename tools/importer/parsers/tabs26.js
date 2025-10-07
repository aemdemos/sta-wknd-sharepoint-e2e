/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs navigation and all tab panels
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Tab titles (li elements)
  const tabTitles = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure same number of titles and panels
  if (tabTitles.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs26)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabTitles.forEach((tabTitle, i) => {
    // Tab label (text content)
    const label = tabTitle.textContent.trim();
    // Tab content (the corresponding panel)
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!label || !panel) return;

    // Extract the main content from the tab panel
    // We want the contentfragment article inside each panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire contentfragment article as the tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.children);
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block element with the new block
  tabsBlock.replaceWith(block);
}
