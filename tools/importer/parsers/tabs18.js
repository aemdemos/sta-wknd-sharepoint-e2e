/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within this block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (in DOM order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row: single cell as per example
  const rows = [['Tabs (tabs18)']];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;
    // Gather all child elements and text nodes from the panel as content
    const contentNodes = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else {
      // Wrap in a div if more than one node
      const wrapper = document.createElement('div');
      contentNodes.forEach(node => wrapper.appendChild(node));
      content = wrapper;
    }
    rows.push([label, content]);
  }

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
