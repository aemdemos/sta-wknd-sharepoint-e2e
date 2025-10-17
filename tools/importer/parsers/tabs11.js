/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: first row is header
  const rows = [['Tabs (tabs11)']];

  // For each tab, extract label and content
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    const cf = panel.querySelector('.contentfragment');
    let tabContent;
    if (cf) {
      tabContent = cf;
    } else {
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // --- Extract sidebar content and sharing section ---
  // Sidebar: activity, adventure type, trip length, group size, difficulty, price
  const sidebarFragment = element.querySelector('.cmp-container .cmp-contentfragment--climbing-new-zealand');
  if (sidebarFragment && block.parentNode) {
    block.parentNode.insertBefore(sidebarFragment.cloneNode(true), block);
  }
  // Share section
  const shareTitle = element.querySelector('.title .cmp-title__text');
  const shareDiv = element.querySelector('.sharing');
  if ((shareTitle || shareDiv) && block.parentNode) {
    const shareBlock = document.createElement('div');
    if (shareTitle) shareBlock.appendChild(shareTitle.cloneNode(true));
    if (shareDiv) shareBlock.appendChild(shareDiv.cloneNode(true));
    block.parentNode.insertBefore(shareBlock, block.nextSibling);
  }

  // Replace the original element
  element.replaceWith(block);
}
