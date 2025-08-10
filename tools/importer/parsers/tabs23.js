/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab block: .cmp-tabs
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from .cmp-tabs__tablist > li
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabelElements = Array.from(tablist.querySelectorAll('li'));

  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Set up block header
  const cells = [['Tabs (tabs23)']];

  // Map tabs labels to tabpanels by aria-labelledby
  tabLabelElements.forEach((tabLabelEl) => {
    const label = tabLabelEl.textContent.trim();
    const tabId = tabLabelEl.id;
    // Find the tabpanel with matching aria-labelledby
    let tabPanel = tabPanels.find(
      (panel) => panel.getAttribute('aria-labelledby') === tabId
    );
    // Fallback: use by index if not found
    if (!tabPanel) {
      const idx = tabLabelElements.indexOf(tabLabelEl);
      tabPanel = tabPanels[idx];
    }

    // Defensive: if no panel found, skip
    if (!tabPanel) return;
    // Collect all child nodes (including elements and text)
    const contentNodes = Array.from(tabPanel.childNodes).filter(
      (n) => {
        // Exclude empty text nodes and empty div wrappers
        if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) return false;
        if (
          n.nodeType === Node.ELEMENT_NODE &&
          n.tagName === 'DIV' &&
          n.childNodes.length === 0
        ) return false;
        return true;
      }
    );
    // If no content, fallback to empty string
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    cells.push([label, contentCell]);
  });

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
