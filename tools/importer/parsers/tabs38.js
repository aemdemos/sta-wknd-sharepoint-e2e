/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs element for tab block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find all tab labels (titles)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabEls = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabEls.map(tab => tab.textContent.trim());

  // Get all tabpanels, in document order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Header row as per block name
  const headerRow = ['Tabs (tabs38)'];

  // Build the rows per tab (label, content)
  const rows = tabLabels.map((label, i) => {
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Prefer referencing the first element inside the tabpanel that holds the real content
      // Usually a .contentfragment > article, but fallback to whatever is in the panel
      let mainContent = panel.querySelector('article, .contentfragment, .cmp-contentfragment__elements, .cmp-contentfragment__element') || panel;
      // If mainContent is the panel itself and it has multiple children, wrap them in a fragment
      if (mainContent === panel && panel.children.length > 1) {
        const frag = document.createDocumentFragment();
        Array.from(panel.children).forEach(child => frag.appendChild(child));
        mainContent = frag;
      }
      contentCell = mainContent;
    }
    return [label, contentCell];
  });

  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
