/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  let tabsRoot = element;
  if (!tabsRoot.classList.contains('cmp-tabs')) {
    tabsRoot = element.querySelector('.cmp-tabs') || element;
  }

  // Get tab labels
  const tabHeaderEls = tabsRoot.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabHeaderEls).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanelEls = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // Always include all tab panels, even if aria-hidden
  const numTabs = Math.min(tabLabels.length, tabPanelEls.length);

  // Table header row
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    // Gather all meaningful children of the tab panel
    const contentNodes = [];
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (
          node.classList.contains('aem-Grid') ||
          node.classList.contains('aem-GridColumn') ||
          (node.tagName === 'DIV' && node.childNodes.length === 0)
        ) return;
      }
      contentNodes.push(node);
    });
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    rows.push([label, contentCell]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
