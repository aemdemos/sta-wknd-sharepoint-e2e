/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  // Defensive: if not found, try to find a cmp-tabs inside element
  const cmpTabs = tabsRoot ? tabsRoot.querySelector('.cmp-tabs') : element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements inside [role="tablist"])
  const tabLabels = Array.from(cmpTabs.querySelectorAll('[role="tablist"] > li'));

  // Get tab panels (divs with [role="tabpanel"] inside cmp-tabs)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, collect label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    // Defensive: if panel is missing, skip
    if (!panel) return;

    // For resilience, grab all direct children of the panel
    // If the panel contains a contentfragment, use its children
    let tabContent = [];
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      // Use the contentfragment's children (title, elements, etc)
      tabContent = Array.from(cf.children);
    } else {
      // Otherwise, use all direct children of the panel
      tabContent = Array.from(panel.children);
    }
    // If tabContent is empty, fallback to panel itself
    if (tabContent.length === 0) tabContent = [panel];

    // Add row: [tab label, tab content]
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  cmpTabs.parentNode.replaceChild(block, cmpTabs);
}
