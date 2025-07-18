/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-tabs block within the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab list (labels)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (!tabLabelEls.length) return;

  // Get tab labels in order
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get all tabpanel elements in their DOM order (which matches tab order)
  // Only direct children of .cmp-tabs with data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;

  // Build the header row: block name only, as per instructions
  const cells = [["Tabs (tabs38)"]];

  // For each tab, create a row [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // For tab content, reference the first relevant content block in the panel
    // Usually this is a .contentfragment or article, else the panel itself
    let content;
    content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    // If content is the panel, use its children instead of the panel itself to avoid accidental wrapping
    let contentCell;
    if (content !== panel) {
      contentCell = content;
    } else {
      // If no contentfragment/article, use all panel children as content
      // Filter out empty text nodes and whitespace
      const usefulChildren = Array.from(panel.childNodes).filter(
        n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim().length
      );
      contentCell = usefulChildren;
    }
    cells.push([label, contentCell]);
  }

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
