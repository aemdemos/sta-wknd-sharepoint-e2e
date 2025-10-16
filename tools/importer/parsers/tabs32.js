/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main heading (h1)
  const mainHeading = element.querySelector('h1');

  // Get sidebar details (dt/dd pairs)
  const sidebar = element.querySelector('.cmp-contentfragment__elements');
  let sidebarContent = [];
  if (sidebar) {
    const pairs = Array.from(sidebar.querySelectorAll('.cmp-contentfragment__element'));
    pairs.forEach(pair => {
      const dt = pair.querySelector('dt');
      const dd = pair.querySelector('dd');
      if (dt && dd) {
        sidebarContent.push(`${dt.textContent.trim()}: ${dd.textContent.trim()}`);
      }
    });
  }

  // Get 'Share this Adventure' heading and sharing buttons/links
  let shareDiv = null;
  const shareTitle = element.querySelector('.title .cmp-title__text');
  const sharing = element.querySelector('.sharing');
  if (shareTitle && shareTitle.textContent.trim().toLowerCase() === 'share this adventure') {
    shareDiv = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = shareTitle.textContent.trim();
    shareDiv.appendChild(p);
    if (sharing) {
      Array.from(sharing.childNodes).forEach(child => {
        shareDiv.appendChild(child.cloneNode(true));
      });
    }
  }

  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Find tab headers (tab labels)
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Find tab panels (tab content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if counts match
  if (tabHeaders.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs32)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const label = tabHeaders[i].textContent.trim();
    const panel = tabPanels[i];
    const tabContentElements = Array.from(panel.childNodes);
    let cellContent = tabContentElements.length > 0 ? tabContentElements : '';
    // For the first tab, prepend main heading, sidebar, and share content
    if (i === 0) {
      const wrapper = document.createElement('div');
      if (mainHeading) wrapper.appendChild(mainHeading.cloneNode(true));
      if (sidebarContent.length > 0) {
        const sidebarDiv = document.createElement('div');
        sidebarContent.forEach(line => {
          const p = document.createElement('p');
          p.textContent = line;
          sidebarDiv.appendChild(p);
        });
        wrapper.appendChild(sidebarDiv);
      }
      if (shareDiv) wrapper.appendChild(shareDiv);
      if (cellContent) {
        cellContent = [wrapper, ...tabContentElements];
      } else {
        cellContent = [wrapper];
      }
    }
    rows.push([
      label,
      cellContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
