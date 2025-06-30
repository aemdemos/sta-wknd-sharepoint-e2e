/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (li elements inside the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get the tab panels (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row as a single cell
  const headerRow = ['Tabs (tabs3)'];

  // Now, create each tab row: [label, content]
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    // Label: use the li's text content, or the li element if it has children (formatting)
    let label;
    if (tabLabels[i].children.length > 0) {
      label = tabLabels[i];
    } else {
      label = tabLabels[i].textContent.trim();
    }
    // Content: prefer <article> if present, else the panel itself
    let content = null;
    if (tabPanels[i]) {
      const article = tabPanels[i].querySelector('article');
      content = article ? article : tabPanels[i];
    }
    tabRows.push([label, content]);
  }

  // Create the final cells array (header + tab rows)
  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
