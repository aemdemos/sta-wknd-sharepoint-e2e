/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (inside <ol> <li>)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content containers)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row exactly as required
  const headerRow = ['Tabs (tabs34)'];

  // Build the rows: one per tab, label and content
  const rows = tabLabels.map((tabLabel) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Find tab panel by aria-controls
    let contentPanel = null;
    const ariaControls = tabLabel.getAttribute('aria-controls');
    if (ariaControls) {
      contentPanel = tabsBlock.querySelector(`#${ariaControls}`);
    }
    // Defensive: fallback to matching by index if not found
    if (!contentPanel) {
      const idx = tabLabels.indexOf(tabLabel);
      contentPanel = tabPanels[idx];
    }
    // Grab the main content element for the cell
    let contentEl = null;
    if (contentPanel) {
      // Use the first child with class 'contentfragment', or fallback to the whole panel
      contentEl = contentPanel.querySelector('.contentfragment') || contentPanel;
    } else {
      // If nothing found, leave cell empty
      contentEl = document.createElement('div');
    }
    return [label, contentEl];
  });

  // Compose the table data
  const table = [headerRow, ...rows];

  // Create the block table using the helper function
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
