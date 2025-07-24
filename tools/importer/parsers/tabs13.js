/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabelElements = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  );
  if (!tabLabelElements.length) return;
  const tabLabels = tabLabelElements.map(tab => tab.textContent.trim());
  const numTabs = tabLabels.length;

  // Get tab panels (contents in the same order as tab labels)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the block table matching the requested structure
  // First row: header
  const cells = [["Tabs (tabs13)"]];
  // Second row: tab labels as headers
  cells.push(tabLabels);
  // Each subsequent row: content for one tab only, others blank
  for (let i = 0; i < numTabs; i++) {
    // Fill row with empty string for each tab
    const row = Array(numTabs).fill('');
    // For content, grab all (non-empty) direct element children of tabPanels[i]
    if (tabPanels[i]) {
      const elements = [];
      Array.from(tabPanels[i].children).forEach(child => {
        if (child.textContent.trim() || child.querySelector('*')) {
          elements.push(child);
        }
      });
      if (elements.length === 1) {
        row[i] = elements[0];
      } else if (elements.length > 1) {
        row[i] = elements;
      } else {
        // fallback: use the tabPanel itself
        row[i] = tabPanels[i];
      }
    }
    cells.push(row);
  }

  // Create the table and replace tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
