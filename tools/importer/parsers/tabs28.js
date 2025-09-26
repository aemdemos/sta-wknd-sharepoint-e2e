/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsRoot = tabsBlock;
  if (tabsBlock && tabsBlock.querySelector('.cmp-tabs')) {
    tabsRoot = tabsBlock.querySelector('.cmp-tabs');
  }
  if (!tabsRoot) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (each tabpanel div)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only continue if we have labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row as per spec
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    // Use the entire tabpanel content, referencing the article if present
    let tabContent = panel.querySelector('article') || panel;
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
