/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab labels in the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Find all tab panels, in DOM order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have matching number of labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Assemble header row: block name
  const headerRow = ['Tabs (tabs34)'];

  // For each tab, extract label and content as is from the DOM
  const rows = [headerRow];

  for (let i = 0; i < numTabs; i++) {
    // Tab label (always text)
    const label = tabLabels[i].textContent.trim();
    // Tab content: reference all DOM nodes inside the tabpanel (excluding empty text nodes and empty aem-Grid divs)
    const panel = tabPanels[i];
    const contentNodes = Array.from(panel.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Exclude empty layout divs
        if (
          node.classList &&
          node.classList.contains('aem-Grid') &&
          node.childNodes.length === 0
        ) {
          return false;
        }
        return true;
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      // fallback: empty string
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  // Build the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the new table block
  tabs.replaceWith(block);
}
