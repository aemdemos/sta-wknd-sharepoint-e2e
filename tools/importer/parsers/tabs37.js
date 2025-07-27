/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: look for a child with class 'tabs' and inside it a cmp-tabs
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;
  const cmpTabs = tabsSection.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find all tab labels (li elements inside the cmp-tabs__tablist)
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Find all tab panels (direct children with role=tabpanel)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: The number of labels and panels should match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Prepare the header row exactly as required
  const headerRow = ['Tabs (tabs37)'];

  // For each tab, get its label and corresponding content
  const rows = tabLabels.map((tab, idx) => {
    // Use the first cell for the tab label
    const label = tab.textContent.trim();
    // Use the referenced tab panel as the second cell (reference, don't clone)
    const panel = tabPanels[idx];
    return [label, panel];
  });

  // Compose cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs section (not just cmp-tabs) with the new block table
  tabsSection.replaceWith(table);
}
