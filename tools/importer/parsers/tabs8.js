/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root container (with class 'cmp-tabs')
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist (li's inside the ol with class 'cmp-tabs__tablist')
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li');
  // Get all tab panel containers (divs with class 'cmp-tabs__tabpanel')
  const tabPanelEls = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Edge case: make sure number of panels and tabs match, otherwise bail
  if (tabLabelEls.length !== tabPanelEls.length) return;
  if (tabLabelEls.length === 0 || tabPanelEls.length === 0) return;

  // Table: header row
  const rows = [['Tabs (tabs8)']];

  // Second row: all the tab labels in order, each as a <strong> inside the cell
  const tabLabelsRow = Array.from(tabLabelEls).map(tabEl => {
    // Use a <strong> to match the sample styling
    const strong = document.createElement('strong');
    strong.textContent = tabEl.textContent.trim();
    return strong;
  });
  rows.push(tabLabelsRow);

  // Third row: all the panel contents in order, each as a cell
  const tabContentsRow = Array.from(tabPanelEls).map(panel => {
    // For each panel, find its main content (prefer .contentfragment, fallback to panel itself)
    const cf = panel.querySelector('.contentfragment') || panel.querySelector('article') || panel;
    return cf;
  });
  rows.push(tabContentsRow);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the new table
  tabs.replaceWith(table);
}
