/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Extract tab labels in order
  const tabListItems = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );
  const tabLabels = tabListItems.map(tab => tab.textContent.trim());

  // Extract tab panels in order
  const tabPanels = tabListItems.map(tab => {
    const panelId = tab.getAttribute('aria-controls');
    return cmpTabs.querySelector(`#${panelId}`);
  });

  // Extract sidebar content (summary and share section)
  // Find the sidebar container
  const sidebar = element.querySelector('.cmp-contentfragment, .cmp-title--underline');
  // Compose sidebar content: title, summary, share section
  let sidebarContent = document.createElement('div');
  // Title
  const mainTitle = element.querySelector('.cmp-title--underline h1, .cmp-title__text');
  if (mainTitle) sidebarContent.appendChild(mainTitle.cloneNode(true));
  // Summary details
  const summaryFragment = element.querySelector('.cmp-contentfragment__elements');
  if (summaryFragment) sidebarContent.appendChild(summaryFragment.cloneNode(true));
  // Share section
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle && shareTitle.textContent.includes('Share')) sidebarContent.appendChild(shareTitle.cloneNode(true));
  const sharing = element.querySelector('.sharing');
  if (sharing) sidebarContent.appendChild(sharing.cloneNode(true));

  // Build table rows
  const rows = [];
  // Header row: block name exactly as required
  rows.push(['Tabs (tabs37)']);

  // Each tab: [label, content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Defensive: Find the main content inside the tab panel
    // Usually a .contentfragment or article
    let content = null;
    content = panel.querySelector('article, .contentfragment');
    // If not found, use panel itself
    if (!content) content = panel;
    // For the first tab (Overview), prepend sidebar content
    if (idx === 0 && sidebarContent.childNodes.length) {
      const wrapper = document.createElement('div');
      wrapper.appendChild(sidebarContent.cloneNode(true));
      wrapper.appendChild(content.cloneNode(true));
      rows.push([label, wrapper]);
    } else {
      rows.push([
        label,
        content
      ]);
    }
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
