/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs && tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer;
  }
  if (!cmpTabs) return;

  // Extract sidebar content (trip details and share label)
  let sidebarContent = document.createElement('div');

  // Trip title (sidebar heading)
  const tripTitle = element.querySelector('.title .cmp-title__text');
  if (tripTitle && !/share/i.test(tripTitle.textContent)) {
    const titleDiv = document.createElement('div');
    titleDiv.textContent = tripTitle.textContent.trim();
    sidebarContent.appendChild(titleDiv);
  }

  // Trip details
  const sidebarFragment = element.querySelector('.cmp-contentfragment__elements');
  if (sidebarFragment) {
    const pairs = Array.from(sidebarFragment.querySelectorAll('.cmp-contentfragment__element'));
    pairs.forEach(pair => {
      const key = pair.querySelector('.cmp-contentfragment__element-title');
      const value = pair.querySelector('.cmp-contentfragment__element-value');
      if (key && value) {
        const row = document.createElement('div');
        row.innerHTML = `<strong>${key.textContent.trim()}:</strong> ${value.textContent.trim()}`;
        sidebarContent.appendChild(row);
      }
    });
  }

  // Share this Adventure label
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle && /share/i.test(shareTitle.textContent)) {
    const shareDiv = document.createElement('div');
    shareDiv.textContent = shareTitle.textContent.trim();
    sidebarContent.appendChild(shareDiv);
  }
  // Sharing buttons (Facebook, Pinterest)
  const sharing = element.querySelector('.sharing');
  if (sharing) {
    sidebarContent.appendChild(sharing.cloneNode(true));
  }

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    let content = panel.querySelector('article') || panel;
    rows.push([label, content]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs23)'];
  // Add sidebar content as first row, labeled 'Sidebar'
  const cells = [headerRow, ['Sidebar', sidebarContent], ...rows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
