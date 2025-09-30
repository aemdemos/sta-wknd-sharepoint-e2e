/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // Build each tab row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const labelText = tabLabels[i].textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: find the main content fragment/article inside the panel
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      // Remove the contentfragment title (h3) if present
      const cfTitle = cf.querySelector('.cmp-contentfragment__title');
      if (cfTitle) cfTitle.remove();
      // Use the .cmp-contentfragment__elements as the main content
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        tabContent = cfElements;
      } else {
        tabContent = cf;
      }
    } else {
      // Fallback: use all children of panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => tabContent.appendChild(node.cloneNode(true)));
    }
    rows.push([labelText, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
