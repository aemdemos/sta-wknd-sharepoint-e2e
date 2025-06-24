/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li inside ol.cmp-tabs__tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: skip if count mismatch or no tabs
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build header row
  const headerRow = ['Tabs (tabs19)'];

  // Build the tab rows: each row is [tabLabel, tabContent]
  const rows = tabLabels.map((tabLabel, i) => {
    // get the corresponding panel by position (assumes order matches, as is typical)
    const panel = tabPanels[i];

    // For the label, use the tab label's textContent
    const labelCell = tabLabel.textContent.trim();

    // For the content, reference the main article within the panel (prefer), otherwise use all panel children
    let contentCell;
    const article = panel && panel.querySelector('article');
    if (article) {
      contentCell = article;
    } else if (panel) {
      // Make a fragment of all children inside the panel
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(child => frag.appendChild(child));
      contentCell = frag;
    } else {
      contentCell = '';
    }
    return [labelCell, contentCell];
  });

  // Compose final cells
  const cells = [headerRow, ...rows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
