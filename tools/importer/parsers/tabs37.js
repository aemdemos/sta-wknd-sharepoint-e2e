/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find tab navigation (tab labels)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header: single cell, must be exactly as specified
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // Extract sidebar content (all text from left column)
  const sidebarFragment = element.querySelector('.contentfragment.cmp-contentfragment--colorado-rock-climbing');
  let sidebarContent = [];
  if (sidebarFragment) {
    // Title
    const titleEl = sidebarFragment.querySelector('h3.cmp-contentfragment__title');
    if (titleEl) sidebarContent.push(titleEl.cloneNode(true));
    // Elements
    const elements = sidebarFragment.querySelectorAll('.cmp-contentfragment__element');
    elements.forEach(el => {
      const dt = el.querySelector('dt');
      const dd = el.querySelector('dd');
      if (dt && dd) {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${dt.textContent.trim()}</strong>: ${dd.textContent.trim()}`;
        sidebarContent.push(div);
      }
    });
    // Share this Adventure
    const shareTitle = element.querySelector('.title .cmp-title__text');
    if (shareTitle && /Share this Adventure/i.test(shareTitle.textContent)) {
      const shareDiv = document.createElement('div');
      shareDiv.textContent = shareTitle.textContent.trim();
      sidebarContent.push(shareDiv);
    }
  }
  if (sidebarContent.length) {
    rows.push(['Sidebar', sidebarContent]);
  }

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    if (!panel) return;
    // Find the main contentfragment/article in the panel
    const article = panel.querySelector('article');
    let tabContent;
    if (article) {
      // Use all children except h3 (title)
      tabContent = Array.from(article.children).filter(el => el.tagName !== 'H3');
      tabContent = tabContent.length === 1 ? tabContent[0] : tabContent;
    } else {
      tabContent = Array.from(panel.children);
      tabContent = tabContent.length === 1 ? tabContent[0] : tabContent;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
