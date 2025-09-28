/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only process as many panels as there are labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabCount; i++) {
    const labelText = tabLabels[i].textContent.trim();

    // Tab content: use the entire tabPanel element
    // Defensive: If the panel has a single contentfragment, use that
    let tabContent = tabPanels[i];

    // If the tabPanel contains a .contentfragment > article, use the article
    const contentFragment = tabPanels[i].querySelector('.contentfragment > article');
    if (contentFragment) {
      tabContent = contentFragment;
    }

    rows.push([labelText, tabContent]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
