/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare table header (exactly as required)
  const cells = [['Tabs (tabs30)']];

  // For each tab, create a row [tab label, tab content]
  tabLabels.forEach((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    let tabContent = '';
    // Prefer the article inside the tabpanel (as in the source), else the panel itself
    if (panel) {
      const article = panel.querySelector('article');
      tabContent = article ? article : panel;
    }
    cells.push([labelText, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabs.parentNode.replaceChild(block, tabs);
}
