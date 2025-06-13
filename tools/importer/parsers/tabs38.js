/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs wrapper
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab label elements (li)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panel elements (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: block name as in the example
  const headerRow = ['Tabs (tabs38)'];

  // Build one row per tab: [Tab label, Tab panel content]
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Tab label text (preserve formatting as string, not element)
    const tabLabel = label.textContent.trim();
    // Tab panel content: grab all children except empty text nodes, preserve full HTML structure
    const panel = tabPanels[i];
    if (!panel) {
      rows.push([tabLabel, '']);
      continue;
    }
    // Extract all meaningful children (ignore empty whitespace text nodes)
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      return n.nodeType !== 3 || n.textContent.trim() !== '';
    });
    // If only one child and it's just a wrapping <div> or <article>, flatten it for resilience
    let content;
    if (contentNodes.length === 1 && contentNodes[0].nodeType === 1 && contentNodes[0].tagName.match(/^(DIV|ARTICLE)$/)) {
      // Use the inner children
      content = Array.from(contentNodes[0].childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
    } else {
      content = contentNodes;
    }
    rows.push([tabLabel, content]);
  }

  // Build the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the block table
  tabs.replaceWith(table);
}
