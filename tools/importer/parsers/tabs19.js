/* global WebImporter */
export default function parse(element, { document }) {
  // Find the root tabs component
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Prepare block header row
  const cells = [['Tabs (tabs19)']];

  // Tab labels (from the tablist)
  const tabLabelNodes = tabsWrapper.querySelectorAll('.cmp-tabs__tablist > li');
  // Tab panels (panels might be in the order of tab labels, but ensure this)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // For each tab label, find its corresponding content panel
  for (let i = 0; i < tabLabelNodes.length; i++) {
    const tabLabel = tabLabelNodes[i].textContent.trim();
    // Defensive: skip if no matching tab panel
    if (!tabPanels[i]) continue;
    // Try to find the main content block in this panel
    // Use the closest meaningful container (e.g., an <article> or .contentfragment), fallback to the panel itself
    let contentElement = tabPanels[i].querySelector('article, .contentfragment, .cmp-contentfragment__elements');
    if (!contentElement) {
      contentElement = tabPanels[i];
    }
    cells.push([tabLabel, contentElement]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
