/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (tabsContainer && tabsContainer.querySelector('.cmp-tabs')) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // --- Extract sidebar content (trip attributes + share heading) ---
  let sidebarWrapper = null;
  {
    // Find the main sidebar contentfragment (attributes)
    const sidebarFragment = element.querySelector('.cmp-contentfragment');
    // Find the share title ("Share this Adventure")
    const shareTitle = element.querySelector('.title .cmp-title__text');
    // Find sharing buttons (e.g., Facebook, Pinterest)
    const sharingDiv = element.querySelector('.sharing');
    if (sidebarFragment || shareTitle || sharingDiv) {
      sidebarWrapper = document.createElement('div');
      if (sidebarFragment) sidebarWrapper.appendChild(sidebarFragment.cloneNode(true));
      if (shareTitle && /share/i.test(shareTitle.textContent)) {
        const shareDiv = document.createElement('div');
        shareDiv.textContent = shareTitle.textContent;
        sidebarWrapper.appendChild(shareDiv);
      }
      if (sharingDiv) sidebarWrapper.appendChild(sharingDiv.cloneNode(true));
    }
  }

  // --- Extract tabs ---
  const tabHeaders = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  );
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  tabHeaders.forEach((tabHeader, i) => {
    const label = tabHeader.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment.cloneNode(true);
    } else {
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => tabContent.appendChild(node.cloneNode(true)));
    }
    rows.push([label, tabContent]);
  });

  // Insert sidebar as a separate block before the tabs table
  if (sidebarWrapper) {
    element.parentNode.insertBefore(sidebarWrapper, element);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
