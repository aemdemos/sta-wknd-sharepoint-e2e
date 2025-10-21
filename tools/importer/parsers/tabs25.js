/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main header
  const mainHeader = element.querySelector('.cmp-title__text');
  let headerDiv = null;
  if (mainHeader) {
    headerDiv = document.createElement('div');
    headerDiv.appendChild(mainHeader.cloneNode(true));
  }

  // Find the sidebar contentfragment (activity details)
  const sidebarFragment = element.querySelector('.cmp-contentfragment__elements');
  let sidebarDiv = null;
  if (sidebarFragment) {
    sidebarDiv = document.createElement('div');
    Array.from(sidebarFragment.querySelectorAll('.cmp-contentfragment__element')).forEach(pair => {
      const title = pair.querySelector('.cmp-contentfragment__element-title');
      const value = pair.querySelector('.cmp-contentfragment__element-value');
      if (title && value) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${title.textContent.trim()}:</strong> ${value.textContent.trim()}`;
        sidebarDiv.appendChild(p);
      }
    });
  }

  // Find the 'Share this Adventure' title
  const shareTitle = Array.from(element.querySelectorAll('.title .cmp-title__text')).find(
    t => t.textContent.trim().toLowerCase().includes('share')
  );
  let shareDiv = null;
  if (shareTitle) {
    shareDiv = document.createElement('div');
    shareDiv.appendChild(shareTitle.cloneNode(true));
  }

  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if tabLabels and tabPanels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs25)']);

  // For each tab, create a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Only extract the actual tab content, not the whole panel structure
    const panelContent = document.createElement('div');
    Array.from(panel.children).forEach(child => {
      // Only append meaningful content (skip empty grids/divs)
      if (
        child.tagName === 'DIV' &&
        child.classList.contains('contentfragment')
      ) {
        // Extract actual content from contentfragment
        const contentDiv = document.createElement('div');
        Array.from(child.querySelectorAll('.cmp-contentfragment__elements > div')).forEach(el => {
          Array.from(el.children).forEach(grandchild => {
            // Only append paragraphs, headings, lists, images
            if (
              grandchild.tagName === 'P' ||
              grandchild.tagName === 'H2' ||
              grandchild.tagName === 'UL' ||
              grandchild.tagName === 'IMG' ||
              grandchild.tagName === 'DIV'
            ) {
              contentDiv.appendChild(grandchild.cloneNode(true));
            }
          });
        });
        panelContent.appendChild(contentDiv);
      } else {
        panelContent.appendChild(child.cloneNode(true));
      }
    });
    rows.push([label, panelContent]);
  }

  // Create a wrapper div for all sidebar content
  const wrapper = document.createElement('div');
  if (headerDiv) wrapper.appendChild(headerDiv);
  if (sidebarDiv) wrapper.appendChild(sidebarDiv);
  if (shareDiv) wrapper.appendChild(shareDiv);
  wrapper.appendChild(WebImporter.DOMUtils.createTable(rows, document));

  // Replace the original element
  element.replaceWith(wrapper);
}
