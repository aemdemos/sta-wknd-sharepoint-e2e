/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    // Defensive: skip if panel missing
    if (!panel) return;

    // For the content cell, we want the visible content inside the tab panel
    // We'll grab the direct contentfragment/article inside each panel
    let contentCell = null;
    const contentFragment = panel.querySelector('.contentfragment article');
    if (contentFragment) {
      // Use the whole article as the content cell
      contentCell = contentFragment;
    } else {
      // Fallback: use the whole panel
      contentCell = panel;
    }

    rows.push([labelText, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
