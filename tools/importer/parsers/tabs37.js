/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab label elements (li)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Guard: Only continue if we have valid tabs and panels
  if (!tabLabels.length || !tabPanels.length) return;
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build the table: header and rows for each tab
  const cells = [];
  // Header row with block name exactly as in the spec
  cells.push(['Tabs (tabs37)']);

  for (let i = 0; i < numTabs; i++) {
    // Tab label
    const label = tabLabels[i].textContent.trim();

    // Tab content: reference the whole content area of the tab panel
    // Prefer to grab the entire <article> if present, as it includes all context/content (image, headings, body, etc)
    let contentElement = tabPanels[i].querySelector('article');
    if (!contentElement) {
      // If not, fallback to find a significant non-empty direct child
      for (const child of tabPanels[i].children) {
        if (child.textContent.trim() || child.querySelector('*')) {
          contentElement = child;
          break;
        }
      }
    }
    if (!contentElement) {
      // If nothing else, fallback to the panel itself
      contentElement = tabPanels[i];
    }
    cells.push([label, contentElement]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs section (the .tabs container) with the table
  // Reference the highest .tabs element up from tabsBlock
  let tabsContainer = tabsBlock.closest('.tabs');
  if (!tabsContainer) {
    // fallback to just replace the tabsBlock
    tabsBlock.replaceWith(table);
  } else {
    tabsContainer.replaceWith(table);
  }
}
