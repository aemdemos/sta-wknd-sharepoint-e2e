/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only keep panels with a corresponding label
  const tabs = tabLabels.map((labelEl, i) => {
    const label = labelEl.textContent.trim();
    const panelEl = tabPanels[i];
    if (!panelEl) return null;
    // Extract all content nodes inside the tab panel
    // We want to preserve all semantic HTML, images, lists, etc.
    // We'll collect all children of the contentfragment if present, otherwise all children of the panel
    let contentNodes = [];
    const cf = panelEl.querySelector('.cmp-contentfragment');
    if (cf) {
      // Only grab direct children (to avoid duplicating nested wrappers)
      contentNodes = Array.from(cf.children);
    } else {
      contentNodes = Array.from(panelEl.children);
    }
    // If contentNodes is empty, fallback to textContent
    let tabContent;
    if (contentNodes.length > 0) {
      // Wrap in a <div> to preserve structure and allow multiple elements
      const wrapper = document.createElement('div');
      contentNodes.forEach(node => wrapper.appendChild(node.cloneNode(true)));
      tabContent = wrapper;
    } else {
      tabContent = panelEl.textContent.trim();
    }
    return [label, tabContent];
  }).filter(Boolean);

  // Table header row: must match the target block name exactly
  const headerRow = ['Tabs (tabs32)'];
  // Table rows: each tab is a row with 2 columns (label, content)
  const tableRows = tabs.map(([label, content]) => [label, content]);

  // Compose the table data
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
