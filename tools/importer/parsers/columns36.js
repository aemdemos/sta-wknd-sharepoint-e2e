/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Find the left column (sidebar) and right column (main content)
  let sidebarGrid, mainContentGrid;
  const gridDivs = Array.from(mainGrid.children).filter(e => e.tagName === 'MAIN' || e.tagName === 'DIV');
  // Find sidebar (contains cmp-contentfragment__elements)
  sidebarGrid = gridDivs.find(div => div.querySelector('.cmp-contentfragment__elements'));
  // Find main content (contains .tabs.panelcontainer)
  mainContentGrid = gridDivs.find(div => div.querySelector('.tabs.panelcontainer'));
  if (!sidebarGrid || !mainContentGrid) return;

  // --- LEFT COLUMN: Sidebar ---
  let sidebarContent = [];
  const cfArticle = sidebarGrid.querySelector('article.cmp-contentfragment');
  if (cfArticle) {
    // Title
    const cfTitle = cfArticle.querySelector('.cmp-contentfragment__title');
    if (cfTitle) sidebarContent.push(cfTitle.cloneNode(true));
    // Key-value pairs
    const cfElements = cfArticle.querySelectorAll('.cmp-contentfragment__element');
    cfElements.forEach(el => {
      const dt = el.querySelector('dt');
      const dd = el.querySelector('dd');
      if (dt && dd) {
        const wrapper = document.createElement('div');
        const label = document.createElement('span');
        label.style.fontWeight = 'bold';
        label.textContent = dt.textContent.trim() + ': ';
        wrapper.append(label, dd.cloneNode(true));
        sidebarContent.push(wrapper);
      }
    });
  }
  // Share this adventure title
  const shareTitle = sidebarGrid.querySelector('.cmp-title__text');
  if (shareTitle && shareTitle.textContent.match(/Share this Adventure/i)) {
    sidebarContent.push(shareTitle.cloneNode(true));
  }
  // Share buttons
  const sharingDiv = sidebarGrid.querySelector('.sharing');
  if (sharingDiv) {
    Array.from(sharingDiv.children).forEach(child => {
      sidebarContent.push(child.cloneNode(true));
    });
  }

  // --- RIGHT COLUMN: Main Content ---
  let mainContent = [];
  const tabsContainer = mainContentGrid.querySelector('.cmp-tabs');
  if (tabsContainer) {
    // Tab navigation
    const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
    if (tabList) mainContent.push(tabList.cloneNode(true));
    // Only include the active tabpanel's content
    const activePanel = tabsContainer.querySelector('.cmp-tabs__tabpanel--active');
    if (activePanel) {
      // Find the contentfragment inside the active tabpanel
      const panelCF = activePanel.querySelector('article.cmp-contentfragment');
      if (panelCF) {
        // Title (if present)
        const panelTitle = panelCF.querySelector('.cmp-contentfragment__title');
        if (panelTitle) mainContent.push(panelTitle.cloneNode(true));
        // Description paragraph
        const desc = panelCF.querySelector('p');
        if (desc) mainContent.push(desc.cloneNode(true));
        // Image (if present)
        const img = panelCF.querySelector('img');
        if (img) mainContent.push(img.cloneNode(true));
      }
    }
  }

  // --- TABLE ASSEMBLY ---
  const headerRow = ['Columns (columns36)'];
  const secondRow = [sidebarContent, mainContent];
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element (not just mainGrid)
  element.replaceWith(block);
}
