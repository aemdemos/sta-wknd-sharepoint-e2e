/* global WebImporter */
export default function parse(element, { document }) {
  // --- Extract sidebar content (Activity, Adventure Type, etc. and Share this Adventure) ---
  // Find the sidebar contentfragment (the first .cmp-contentfragment__elements)
  const sidebarFragment = element.querySelector('.cmp-contentfragment__elements');
  let sidebarInfo = [];
  if (sidebarFragment) {
    const infoDivs = sidebarFragment.querySelectorAll('.cmp-contentfragment__element');
    infoDivs.forEach(div => {
      const label = div.querySelector('.cmp-contentfragment__element-title');
      const value = div.querySelector('.cmp-contentfragment__element-value');
      if (label && value) {
        sidebarInfo.push(`${label.textContent.trim()}: ${value.textContent.trim()}`);
      }
    });
  }
  // Add Share this Adventure if present
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle && /share/i.test(shareTitle.textContent)) {
    sidebarInfo.push(shareTitle.textContent.trim());
    // Also add sharing buttons/links if present
    const sharingDiv = element.querySelector('.sharing');
    if (sharingDiv) {
      // Facebook share button
      const fb = sharingDiv.querySelector('.fb-share-button');
      if (fb && fb.getAttribute('data-href')) {
        sidebarInfo.push(`Facebook: ${fb.getAttribute('data-href')}`);
      }
      // Pinterest share button
      const pin = sharingDiv.querySelector('a[data-pin-do]');
      if (pin && pin.href) {
        sidebarInfo.push(`Pinterest: ${pin.href}`);
      }
    }
  }
  // Create a sidebar section as a <div> for inclusion
  let sidebarContent = null;
  if (sidebarInfo.length) {
    sidebarContent = document.createElement('div');
    sidebarInfo.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      sidebarContent.appendChild(p);
    });
  }

  // --- Extract Tabs ---
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('div[role="tabpanel"]')
  );
  if (!tabHeaders.length || !tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, idx) => {
    const tabLabel = tabHeader.textContent.trim();
    let tabPanel = tabPanels[idx];
    if (!tabPanel && tabHeader.hasAttribute('aria-controls')) {
      tabPanel = tabsContainer.querySelector(`#${tabHeader.getAttribute('aria-controls')}`);
    }
    if (!tabPanel) return;
    let tabContent = tabPanel.querySelector('article') || tabPanel;
    // If sidebarContent exists, prepend it to the first tab only (Overview)
    let cellContent;
    if (idx === 0 && sidebarContent) {
      // Create a wrapper div
      const wrapper = document.createElement('div');
      wrapper.appendChild(sidebarContent.cloneNode(true));
      // Add a separator for clarity
      wrapper.appendChild(document.createElement('hr'));
      // Append the tab content
      wrapper.appendChild(tabContent.cloneNode(true));
      cellContent = wrapper;
    } else {
      cellContent = tabContent;
    }
    rows.push([tabLabel, cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
