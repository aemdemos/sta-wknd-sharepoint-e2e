/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the section
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (as per the order in the tab list)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get all tab panels (contents)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare the table rows
  const rows = [];
  // Header row: match the spec exactly
  rows.push(['Tabs (tabs37)']);

  // For each tab, extract label and corresponding content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const tabPanel = tabPanels[i];
    if (!tabPanel) continue;

    // The content is usually a contentfragment/article in the panel, but in general take all children of the tabPanel
    // Create a wrapper div and move all child nodes into it to preserve HTML structure, referencing originals
    const contentWrapper = document.createElement('div');
    while (tabPanel.firstChild) {
      contentWrapper.appendChild(tabPanel.firstChild);
    }
    // Re-attach the wrapper to tabPanel so DOM is not altered for future use
    tabPanel.appendChild(contentWrapper);

    // Add the [Tab Label, Tab Content] to the table
    rows.push([label, contentWrapper]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
