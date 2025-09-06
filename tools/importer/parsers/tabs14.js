/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the main tabs block
  if (!element.classList.contains('cmp-tabs')) return;

  // Get tab labels
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let tabContent = '';
    if (panel) {
      // Use the entire tabpanel content (not just children)
      const frag = document.createElement('div');
      // Move all children except script/style
      Array.from(panel.childNodes).forEach((node) => {
        if (node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) return;
        frag.appendChild(node.cloneNode(true));
      });
      tabContent = frag;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the *parent* of the tabs block (the grid column) to ensure DOM is modified
  if (element.parentElement) {
    element.parentElement.replaceChild(block, element);
  } else {
    element.replaceWith(block);
  }
}
