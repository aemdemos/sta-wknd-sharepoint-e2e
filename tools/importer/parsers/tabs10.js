/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsElem = element.querySelector('.cmp-tabs');
  if (!tabsElem) return;

  // Collect all tab labels in order
  const tabHeaderEls = Array.from(tabsElem.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabLabels = tabHeaderEls.map(header => header.textContent.trim());

  // Collect all tab panels in order
  const tabPanels = Array.from(tabsElem.querySelectorAll(':scope > div[role="tabpanel"]'));

  // Prepare table rows
  const cells = [];
  // Header row (block name)
  cells.push(['Tabs (tabs10)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content fragment/article inside the tab panel
    // Use the article if present; else fallback to the panel itself
    let contentElem = panel.querySelector('article');
    if (!contentElem) contentElem = panel;
    cells.push([label, contentElem]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the table
  tabsElem.replaceWith(block);
}
