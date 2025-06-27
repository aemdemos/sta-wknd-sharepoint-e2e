/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  // Extract tab labels in order
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Extract tab panels (in same order as labels)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );
  const headerRow = ['Tabs (tabs30)'];
  const cells = [headerRow];
  // For each tab, assemble row: [label, tab-content]
  tabLabels.forEach((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[idx];
    let content;
    if (panel) {
      // Try to reference the main content in the panel
      // If the panel has an article (contentfragment), use it
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Otherwise, get all children of the panel
        const els = Array.from(panel.childNodes).filter(
          n => (n.nodeType !== 3 || n.textContent.trim())
        );
        content = els.length === 1 ? els[0] : els;
      }
    } else {
      // Defensive: if the panel is missing, leave content blank
      content = '';
    }
    cells.push([label, content]);
  });
  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
