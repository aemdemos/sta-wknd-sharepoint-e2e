/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: look for .cmp-tabs inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements inside [role="tablist"])
  const tabLabels = Array.from(tabsBlock.querySelectorAll('[role="tablist"] > li'));

  // Get tab panels (divs with [role="tabpanel"] inside .cmp-tabs)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: tabLabels and tabPanels should match in order
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];

    // Defensive: skip if panel is missing
    if (!panel) return;

    // Find the main content fragment inside the panel
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire content fragment as the tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes);
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
