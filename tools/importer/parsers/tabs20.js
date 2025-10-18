/* global WebImporter */
export default function parse(element, { document }) {
  // Only extract the Tabs block as per requirements
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements inside ol[role="tablist"])
  const tabLabels = Array.from(tabsContainer.querySelectorAll('ol[role="tablist"] > li'));
  // Get tab panels (div[role="tabpanel"] inside tabsContainer)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('div[role="tabpanel"]'));
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs20)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    const panel = tabPanels[i].cloneNode(true);
    rows.push([labelText, panel]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
