/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((tab, i) => {
    // Tab label text
    const label = tab.textContent.trim();
    // Find the corresponding tabpanel by aria-controls/id
    const panelId = tab.getAttribute('aria-controls');
    const panel = tabs.querySelector(`#${panelId}`);
    // Defensive: fallback to index if not found
    const tabPanel = panel || tabPanels[i];
    // For tab content, use the entire tabPanel's content
    // Defensive: If tabPanel is null, use empty div
    let content;
    if (tabPanel) {
      // Find the main content fragment inside the tabPanel
      const cf = tabPanel.querySelector('.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // If not found, use tabPanel itself
        content = tabPanel;
      }
    } else {
      content = document.createElement('div');
    }
    return [label, content];
  });

  // Table header
  const headerRow = ['Tabs (tabs23)'];

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs element with the block table
  tabs.parentNode.replaceChild(block, tabs);
}
