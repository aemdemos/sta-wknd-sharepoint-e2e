/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (must be present)
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels in order (li elements with role="tab")
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare the first row: header as specified
  const headerRow = ['Tabs (tabs36)'];

  // Prepare the subsequent rows: [tab label, tab content]
  const rows = tabLabels.map((tabLabel) => {
    const tabName = tabLabel.textContent.trim();
    // Use aria-controls to find the corresponding tabpanel
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = tabsBlock.querySelector(`#${panelId}`);
    let contentCell = null;
    if (panel) {
      // Try to extract the main contentfragment/article inside the tabpanel
      // If not found, just use the panel itself
      let possibleContent = panel.querySelector('.contentfragment') || panel.querySelector('article') || panel;
      // If the possibleContent is just a wrapper with empty children, fallback to the panel
      // (But since .contentfragment/article is usually the right thing, we reference directly)
      contentCell = possibleContent;
    }
    return [tabName, contentCell];
  });

  // Compose the full table array
  const cells = [headerRow, ...rows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table, preserving all content
  tabsBlock.replaceWith(block);
}
