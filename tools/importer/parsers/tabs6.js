/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate tab panel children
  function getTabPanels(tabsRoot) {
    return Array.from(tabsRoot.querySelectorAll(':scope > div'))
      .filter(div => div.classList.contains('cmp-tabs__tabpanel'));
  }

  // Find the tabs block in the source element
  const tabsBlock = element.querySelector('.tabs.panelcontainer .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = getTabPanels(tabsBlock);

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // Try to recover by truncating to shortest
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    // Tab label cell
    const labelCell = label;
    // Tab content cell: use the contentfragment/article inside the tabpanel
    const tabPanel = tabPanels[idx];
    let contentCell;
    // Find the contentfragment/article (usually only one)
    const cf = tabPanel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Defensive: try to get only the meaningful content inside the article
      // Remove the title (h3) if present
      const cfClone = cf.cloneNode(true);
      const h3 = cfClone.querySelector('h3.cmp-contentfragment__title');
      if (h3) h3.remove();
      contentCell = cfClone;
    } else {
      // Fallback: use the tabPanel itself
      contentCell = tabPanel.cloneNode(true);
    }
    return [labelCell, contentCell];
  });

  // Compose the table rows
  const headerRow = ['Tabs (tabs6)'];
  const tableRows = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
