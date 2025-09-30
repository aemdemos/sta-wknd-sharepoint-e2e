/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Get the tabs header row
  const headerRow = ['Tabs (tabs7)'];

  // Find tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Find tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: only process if we have labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: each row = [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Find the corresponding panel by aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = tabsBlock.querySelector(`#${panelId}`);
    if (!panel) return [labelText, ''];

    // Tab content: get the main contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the whole article as the tab content (reference, do not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel's inner content
      tabContent = panel;
    }
    return [labelText, tabContent];
  });

  // Compose the table
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
