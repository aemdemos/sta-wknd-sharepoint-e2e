/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the visible tabs (should match panels)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Extract corresponding tab panels (the actual content for each tab, order must match labels)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Table header row as per block name/variant
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow];

  // Edge handling: ensure tabLabels.length matches tabPanels.length
  const minCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < minCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // The panel may have one large div or multiple children; we want visible, meaningful content only
    // Exclude empty grid/wrapper divs
    let tabContentNodes = [];
    Array.from(panel.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Exclude empty AEM grid wrappers
        if (
          !(
            node.classList.contains('aem-Grid') &&
            !node.textContent.trim()
          ) &&
          !(node.tagName === 'DIV' && node.classList.length === 0 && !node.textContent.trim())
        ) {
          tabContentNodes.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          tabContentNodes.push(document.createTextNode(node.textContent));
        }
      }
    });
    // If no non-empty content found, use the panel itself
    if (tabContentNodes.length === 0) {
      tabContentNodes = Array.from(panel.childNodes);
    }
    cells.push([label, tabContentNodes]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace ONLY the cmp-tabs block with the block table
  tabsBlock.replaceWith(table);
}
