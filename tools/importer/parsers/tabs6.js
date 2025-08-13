/* global WebImporter */
export default function parse(element, { document }) {
  // Find the CMP tabs block inside 'element'
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels from tablist
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Find all panels (must match label order)
  const tabPanels = tabLabels.map(label => {
    // Find the panel controlled by this tab
    // Each tab has aria-controls="..." that matches panel id
    const tabEl = tabLabelEls.find(li => li.textContent.trim() === label);
    if (!tabEl) return null;
    const panelId = tabEl.getAttribute('aria-controls');
    if (!panelId) return null;
    return tabsBlock.querySelector(`#${panelId}`);
  });

  // Table header as per instructions
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  // For each tab, prepare [label, content] row
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // For content, collect all children of panel:
    // Usually <div class="contentfragment">, etc.
    // Reference the contentfragment/article block directly.
    // Find article if present
    const mainContent = panel.querySelector('article') || panel.firstElementChild;
    rows.push([label, mainContent || panel]);
  });

  // Build the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(block, element);
}
