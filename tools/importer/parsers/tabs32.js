/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the main header (h1)
  const mainHeader = element.querySelector('h1');
  let headerBlock = null;
  if (mainHeader) {
    headerBlock = document.createElement('div');
    headerBlock.appendChild(mainHeader.cloneNode(true));
  }

  // Extract sidebar adventure details
  const sidebarFragment = element.querySelector('.cmp-contentfragment');
  let sidebarBlock = null;
  if (sidebarFragment) {
    const sidebarElements = sidebarFragment.querySelectorAll('.cmp-contentfragment__element');
    const sidebarList = document.createElement('dl');
    sidebarElements.forEach((el) => {
      const dt = el.querySelector('.cmp-contentfragment__element-title');
      const dd = el.querySelector('.cmp-contentfragment__element-value');
      if (dt && dd) {
        const dtElem = document.createElement('dt');
        dtElem.textContent = dt.textContent.trim();
        const ddElem = document.createElement('dd');
        ddElem.textContent = dd.textContent.trim();
        sidebarList.appendChild(dtElem);
        sidebarList.appendChild(ddElem);
      }
    });
    sidebarBlock = document.createElement('div');
    sidebarBlock.appendChild(sidebarList);
    // Add 'Share this Adventure' label if present
    const shareTitle = element.querySelector('.title .cmp-title__text');
    if (shareTitle && /share/i.test(shareTitle.textContent)) {
      const shareDiv = document.createElement('div');
      shareDiv.textContent = shareTitle.textContent.trim();
      sidebarBlock.appendChild(shareDiv);
    }
    // Add sharing buttons/links if present
    const sharing = element.querySelector('.sharing');
    if (sharing) {
      sidebarBlock.appendChild(sharing.cloneNode(true));
    }
  }

  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) {
    // If no tabs, just replace with sidebar and header
    const wrapper = document.createElement('div');
    if (headerBlock) wrapper.appendChild(headerBlock);
    if (sidebarBlock) wrapper.appendChild(sidebarBlock);
    element.replaceWith(wrapper);
    return;
  }

  // Get tab labels (tab headers)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []);

  // Get tab panels (tab content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have matching labels and panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Prepare rows for the block table
  const rows = [];
  // Header row (block name)
  rows.push(['Tabs (tabs32)']);

  // For each tab, extract label and content
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent = [];
    if (contentFragment) {
      // Try to get the main content area inside the fragment
      // Usually, the content is inside .cmp-contentfragment__elements
      const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsContainer) {
        // Collect all direct children (headings, paragraphs, images, lists, etc.)
        tabContent = Array.from(elementsContainer.children).filter((el) => {
          // Only include elements with actual content
          return el.textContent.trim() || el.querySelector('img');
        });
        // If nothing found, fallback to the whole elementsContainer
        if (tabContent.length === 0) tabContent = [elementsContainer];
      } else {
        // Fallback: use the whole contentFragment
        tabContent = [contentFragment];
      }
    } else {
      // Fallback: use the whole panel
      tabContent = [panel];
    }

    // Defensive: if tabContent is empty, use the panel itself
    if (!tabContent || tabContent.length === 0) tabContent = [panel];

    rows.push([
      label,
      tabContent.length === 1 ? tabContent[0] : tabContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with header, sidebar, and tabs block
  const wrapper = document.createElement('div');
  if (headerBlock) wrapper.appendChild(headerBlock);
  if (sidebarBlock) wrapper.appendChild(sidebarBlock);
  wrapper.appendChild(block);
  element.replaceWith(wrapper);
}
