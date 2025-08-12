/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get all tabpanel content elements in document order
  const tabpanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build the header row, exactly as required
  const tableRows = [['Tabs (tabs28)']];

  // Build tab rows: label and content
  tabLabels.forEach((label, idx) => {
    // Defensive: get tabpanel for this label
    const panel = tabpanels[idx];
    if (!panel) return;

    // The content is the main contentfragment/article inside the tabpanel
    // In some cases, panel may directly contain content, but prefer article if present
    const contentFragment = panel.querySelector('article');
    const tabContent = contentFragment ? contentFragment : panel;
    tableRows.push([label, tabContent]);
  });

  // Create the table using referenced elements
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the tabs element only, leaving the rest of the structure untouched
  tabs.parentNode.replaceChild(blockTable, tabs);
}
