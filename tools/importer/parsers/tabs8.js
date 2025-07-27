/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.querySelectorAll('[role="tab"]') : []);

  // Get tab panels
  const panels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Compose table rows: header, then one row for each tab
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  tabLabels.forEach((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    // Panel id is in aria-controls attribute of the tab label
    let panel = null;
    if (labelEl.hasAttribute('aria-controls')) {
      const panelId = labelEl.getAttribute('aria-controls');
      panel = tabs.querySelector(`#${panelId}`);
    } else {
      // Fallback: use order
      panel = panels[idx];
    }
    // For content, grab the first main content block from the panel
    let content = null;
    if (panel) {
      // Try to extract the main content (include all direct children except tab metadata and empty grids)
      // This ensures images, paragraphs, lists, and other content are included as in the example
      const article = panel.querySelector('article.cmp-contentfragment');
      if (article) {
        content = article;
      } else {
        // Get all children except for empty .aem-Grid containers
        const validChildren = Array.from(panel.childNodes).filter(node => {
          // If element, skip empty aem-Grid
          if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid') && node.innerHTML.trim() === '') {
            return false;
          }
          // skip whitespace only text nodes
          if (node.nodeType === 3 && !node.textContent.trim()) {
            return false;
          }
          return true;
        });
        if (validChildren.length === 1) {
          content = validChildren[0];
        } else if (validChildren.length > 1) {
          content = validChildren;
        } else {
          content = panel;
        }
      }
    }
    rows.push([label, content]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
