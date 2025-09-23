/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (the element to replace)
  const tabsBlock = element;
  if (!tabsBlock) return;

  // Find the cmp-tabs container inside the block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row as required
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const label = labelEl.textContent.trim();

    // Tab content: get the corresponding tabpanel
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Defensive: find the main content fragment/article inside the panel
      // Use the first child article if present, else the whole panel
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback: use all children of the panel
        const div = document.createElement('div');
        Array.from(panel.childNodes).forEach((node) => div.appendChild(node.cloneNode(true)));
        content = div;
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
