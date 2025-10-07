/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  // Defensive: fallback if not found
  const cmpTabs = tabsContainer?.querySelector('.cmp-tabs') || element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Extract sidebar details and sharing block as a single block of content
  let sidebarContent = [];
  const sidebar = element.querySelector('.cmp-contentfragment__elements');
  if (sidebar) {
    const sidebarDetails = Array.from(sidebar.querySelectorAll('.cmp-contentfragment__element')).map(item => {
      const dt = item.querySelector('.cmp-contentfragment__element-title');
      const dd = item.querySelector('.cmp-contentfragment__element-value');
      return dt && dd ? `${dt.textContent.trim()}: ${dd.textContent.trim()}` : '';
    }).filter(Boolean);
    if (sidebarDetails.length) {
      const ul = document.createElement('ul');
      sidebarDetails.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      });
      sidebarContent.push(ul);
    }
  }
  // Add 'Share this Adventure' label and sharing buttons if present
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle && shareTitle.textContent.trim().toLowerCase().includes('share')) {
    const shareDiv = document.createElement('div');
    shareDiv.textContent = shareTitle.textContent.trim();
    sidebarContent.push(shareDiv);
  }
  const sharingBlock = element.querySelector('.sharing');
  if (sharingBlock) {
    sidebarContent.push(sharingBlock.cloneNode(true));
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs34)']);

  // Insert sidebar content as its own row before the tabs
  if (sidebarContent.length) {
    rows.push(['Sidebar Content', sidebarContent.length === 1 ? sidebarContent[0] : sidebarContent]);
  }

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // For tab content, use the whole panel content
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    let tabContent = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
