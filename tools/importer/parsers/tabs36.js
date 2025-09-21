/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element that contains the tablist and tabpanels
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Prepare the table rows
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  tabLabels.forEach((tabLabel, i) => {
    // Get the label text
    const labelText = tabLabel.textContent.trim();
    // Get the tab panel content
    const panel = tabPanels[i];
    // Defensive: If the panel is missing, skip
    if (!panel) return;

    // For tab content, grab the contentfragment inside the panel
    let tabContent;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      // Use the contentfragment element directly as tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
