/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container - robustly locate the .cmp-tabs inside the outer .tabs
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;
  const tabsBlock = tabsSection.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get all tab panels (content) in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure lengths match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row as per block definition
  const headerRow = ['Tabs (tabs24)'];

  // Each subsequent row: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // First cell: tab label (keep as plain text for semantics)
    const label = tabLabel.textContent.trim();
    // Second cell: content
    const tabPanel = tabPanels[idx];
    // Try to find the content fragment/article in the panel
    let contentElem = tabPanel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (!contentElem) {
      // fallback: use the panel itself (shouldn't occur for this block, but defensive)
      contentElem = tabPanel;
    }
    // We want to preserve the DOM structure from the content fragment/article, but omit the h3 title if present
    // So construct a fragment containing everything except the first h3
    const fragment = document.createDocumentFragment();
    let skipTitleH3 = true;
    Array.from(contentElem.childNodes).forEach((node) => {
      if (skipTitleH3 && node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H3') {
        skipTitleH3 = false;
        return;
      }
      if (!skipTitleH3) {
        fragment.appendChild(node);
      }
      if (skipTitleH3 && (node.nodeType !== Node.ELEMENT_NODE || node.tagName !== 'H3')) {
        // If the first node is not H3, just append
        fragment.appendChild(node);
      }
    });
    // If nothing was appended (i.e., there was no H3), fall back to contentElem
    const contentCell = fragment.childNodes.length ? fragment : contentElem;
    return [label, contentCell];
  });

  // Compose the table
  const tableRows = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
