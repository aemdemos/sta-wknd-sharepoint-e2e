/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure tab count matches
  if (tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: reference the tabPanel's content
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;

    // Only include meaningful children (not empty grids)
    const tabContentElements = [];
    Array.from(tabPanel.children).forEach(child => {
      if (
        child.classList.contains('aem-Grid') ||
        (child.tagName === 'DIV' && child.children.length === 0 && child.textContent.trim() === '')
      ) {
        return;
      }
      tabContentElements.push(child);
    });
    // If nothing found, fallback to tabPanel itself
    const tabContent = tabContentElements.length ? tabContentElements : [tabPanel];

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
