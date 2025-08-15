/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the tabs block (with .cmp-tabs class)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 2. Find the tab labels (li[role=tab])
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));

  // 3. Find the tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Guard: if number of panels and labels doesn't match, abort (sanity check)
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // 4. Build the table structure
  // Header row - block name, as specified
  const headerRow = ['Tabs (tabs23)'];

  // Tab labels row - use existing text, in <strong> for visual/semantic highlight
  const tabNamesRow = tabLabels.map(tab => {
    // Use a <strong> element for the tab label, as visually in the example
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Tab content row - reference the content for each tab
  const tabContentRow = tabPanels.map(panel => {
    // Use the most semantically meaningful content inside the tabpanel.
    // Prefer the .contentfragment > article, else all children
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      const article = contentFragment.querySelector('article');
      if (article) return article;
      return contentFragment;
    }
    // If neither found, return all childNodes as an array (to preserve structure)
    return Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
  });

  // 5. Compose table rows: first is header, second is tab names, third is tab content
  const cells = [
    headerRow,
    tabNamesRow,
    tabContentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the entire tabs block with the table
  tabs.replaceWith(block);
}
