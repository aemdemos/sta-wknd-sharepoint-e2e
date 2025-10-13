/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Defensive: Only keep tabs that have both label and panel
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Find the corresponding panel by aria-controls
    const panelId = label.getAttribute('aria-controls');
    const panel = tabsBlock.querySelector(`#${panelId}`);
    if (!panel) continue;

    // Tab label cell
    let tabLabelText = label.textContent.trim();
    // Tab content cell: get the contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }
    tabRows.push([tabLabelText, tabContent]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs34)'];
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
