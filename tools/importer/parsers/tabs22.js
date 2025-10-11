/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // --- Extract sidebar content ---
  // Find the sidebar container (left column)
  // Look for the first .cmp-contentfragment__elements (the vertical list of details)
  let sidebar = null;
  // Try to find the sidebar by looking for the first .cmp-contentfragment__elements that's NOT inside a tab panel
  const allSidebars = Array.from(element.querySelectorAll('.cmp-contentfragment__elements'));
  for (const el of allSidebars) {
    if (!el.closest('.cmp-tabs__tabpanel')) {
      sidebar = el;
      break;
    }
  }
  // Also include the main page heading and 'Share this Adventure' title and sharing buttons if present
  const mainHeading = element.querySelector('.cmp-title__text, h1, h2');
  let mainHeadingNode = null;
  if (mainHeading && mainHeading.textContent.trim() === 'Climbing New Zealand') {
    mainHeadingNode = mainHeading.cloneNode(true);
  }
  const shareTitle = Array.from(element.querySelectorAll('.cmp-title__text, h5, h6')).find(
    el => el.textContent.trim().toLowerCase().includes('share')
  );
  const sharing = element.querySelector('.sharing');

  // Compose sidebar content into a wrapper div
  const sidebarWrapper = document.createElement('div');
  if (mainHeadingNode) sidebarWrapper.appendChild(mainHeadingNode);
  if (sidebar) sidebarWrapper.appendChild(sidebar.cloneNode(true));
  if (shareTitle) sidebarWrapper.appendChild(shareTitle.cloneNode(true));
  if (sharing) sidebarWrapper.appendChild(sharing.cloneNode(true));

  // --- Extract tab labels and panels ---
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab
  const rows = [];
  rows.push(['Tabs (tabs22)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Extract the main content fragment/article for this tab
    let content = panel.querySelector('article') || panel.querySelector('.cmp-contentfragment__elements') || panel;
    // Compose a wrapper div for sidebar + tab content
    const rowContent = document.createElement('div');
    // Only include sidebar for the first tab (Overview)
    if (i === 0 && sidebarWrapper.childNodes.length > 0) {
      rowContent.appendChild(sidebarWrapper.cloneNode(true));
    }
    rowContent.appendChild(content.cloneNode(true));
    rows.push([
      label,
      rowContent
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
