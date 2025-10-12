/* global WebImporter */
export default function parse(element, { document }) {
  // Extract sidebar info (Activity, Adventure Type, etc.)
  const sidebarFragment = element.querySelector('.cmp-contentfragment__elements');
  let sidebarContent = document.createElement('div');
  if (sidebarFragment) {
    Array.from(sidebarFragment.querySelectorAll('.cmp-contentfragment__element')).forEach(item => {
      const dt = item.querySelector('.cmp-contentfragment__element-title');
      const dd = item.querySelector('.cmp-contentfragment__element-value');
      if (dt && dd) {
        const row = document.createElement('div');
        row.innerHTML = `<strong>${dt.textContent.trim()}:</strong> ${dd.textContent.trim()}`;
        sidebarContent.appendChild(row);
      }
    });
  }
  // Add "Share this Adventure" if present
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle && /Share this Adventure/i.test(shareTitle.textContent)) {
    const shareDiv = document.createElement('div');
    shareDiv.innerHTML = `<strong>${shareTitle.textContent.trim()}</strong>`;
    sidebarContent.appendChild(shareDiv);
  }

  // Find the tabs container
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels and panels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build table rows
  const rows = [
    ['Tabs (tabs30)'],
    ['Sidebar', sidebarContent]
  ];
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    const tabContent = document.createElement('div');
    // Only copy actual tab content, not wrappers
    const contentFragment = panel.querySelector('.cmp-contentfragment__elements');
    if (contentFragment) {
      Array.from(contentFragment.children).forEach(child => {
        tabContent.appendChild(child.cloneNode(true));
      });
    } else {
      Array.from(panel.childNodes).forEach(node => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
