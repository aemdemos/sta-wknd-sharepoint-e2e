/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row: must match block name exactly
  const headerRow = ['Tabs (tabs27)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: If panel missing, skip
    if (!panel) continue;

    // Use the actual tabpanel element for content (retains all HTML, images, lists, etc)
    rows.push([label, panel]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  element.replaceWith(block);
}
