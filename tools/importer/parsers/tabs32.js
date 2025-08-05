/* global WebImporter */
export default function parse(element, { document }) {
  // The function expects to be called with the .cmp-tabs element
  const tabs = element;
  if (!tabs || !tabs.classList.contains('cmp-tabs')) return;

  // Get tab labels
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  
  // Header row: Block name exactly as provided
  const headerRow = ['Tabs (tabs32)'];

  // Tab labels row: Use <strong> for each tab label, as elements
  const labelsRow = tabLabels.map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // For each tab, find corresponding panel content
  // Each content row: [tab label, tab content]
  const contentRows = tabLabels.map((tab, idx) => {
    const label = tab.textContent.trim();
    const panel = tabPanels[idx];
    if (!panel) return [label, '']; // Defensive: if missing panel
    // Find the main content root for the tab panel
    let contentRoot;
    // Prefer .contentfragment > article > .cmp-contentfragment__elements if present
    const cfArticle = panel.querySelector('.contentfragment > article');
    if (cfArticle) {
      contentRoot = cfArticle.querySelector('.cmp-contentfragment__elements') || cfArticle;
    } else {
      // Otherwise, use the panel's children
      contentRoot = panel;
    }
    // Compose content cell: an array of all non-empty child nodes
    const contentNodes = Array.from(contentRoot.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return true;
    });
    // If nothing, fallback to empty string
    return [label, contentNodes.length === 1 ? contentNodes[0] : contentNodes.length ? contentNodes : ''];
  });

  // Compose table data in block-table format:
  // header, then tab labels row, then one row per tab [label, content]
  const tableData = [headerRow, labelsRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original .cmp-tabs element with the table
  element.replaceWith(block);
}
