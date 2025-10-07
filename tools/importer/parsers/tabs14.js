/* global WebImporter */
export default function parse(element, { document }) {
  // --- Extract sidebar content (trip attributes + share section) ---
  let sidebarContent = [];
  // Trip attributes (definition list in sidebar)
  const sidebarFragment = element.querySelector('.cmp-contentfragment__elements dl');
  if (sidebarFragment) {
    sidebarContent.push(sidebarFragment.cloneNode(true));
  }
  // Share this Adventure title
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle) {
    sidebarContent.push(shareTitle.cloneNode(true));
  }
  // Share buttons
  const shareSection = element.querySelector('.sharing');
  if (shareSection) {
    sidebarContent.push(shareSection.cloneNode(true));
  }
  // Compose sidebar cell
  let sidebarCell = sidebarContent.length === 1 ? sidebarContent[0] : sidebarContent;

  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: match tab labels to tab panels by order
  const rows = [];
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Defensive: find the main content fragment/article inside the panel
      const cf = panel.querySelector('article.cmp-contentfragment') || panel;
      // Usually the content is inside .cmp-contentfragment__elements
      const elements = cf.querySelector('.cmp-contentfragment__elements') || cf;
      // Defensive: If elements has only one child, use that, else use all children
      if (elements.children.length === 1) {
        tabContent = elements.children[0];
      } else {
        tabContent = Array.from(elements.children);
      }
    }
    rows.push([label, tabContent]);
  });

  // Table header
  const headerRow = ['Tabs (tabs14)'];
  // Compose table: first row is header, second row is sidebar, then tab rows
  const tableCells = [headerRow, ['Sidebar', sidebarCell], ...rows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace original element
  element.replaceWith(block);
}
