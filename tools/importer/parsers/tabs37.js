/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sidebar contentfragment (left column summary)
  const sidebarFragment = element.querySelector('.contentfragment.cmp-contentfragment--elements article.cmp-contentfragment');
  let sidebarContent = [];
  if (sidebarFragment) {
    // Add main heading if present
    const mainHeading = element.querySelector('.cmp-title__text, h1.cmp-title__text');
    if (mainHeading) {
      sidebarContent.push(document.createElement('h2'));
      sidebarContent[sidebarContent.length-1].textContent = mainHeading.textContent.trim();
    }
    // Add all sidebar key-value pairs with model field comments
    const sidebarFields = sidebarFragment.querySelectorAll('.cmp-contentfragment__element');
    sidebarFields.forEach(field => {
      const key = field.querySelector('.cmp-contentfragment__element-title');
      const value = field.querySelector('.cmp-contentfragment__element-value');
      if (key && value) {
        sidebarContent.push(document.createComment(` ${key.textContent.trim()} `));
        const div = document.createElement('div');
        div.innerHTML = `<strong>${key.textContent.trim()}:</strong> ${value.textContent.trim()}`;
        sidebarContent.push(div);
      }
    });
    // Add Share this Adventure section
    const shareTitle = element.querySelector('.title .cmp-title__text');
    if (shareTitle && /share/i.test(shareTitle.textContent)) {
      sidebarContent.push(document.createComment(' Share this Adventure '));
      const div = document.createElement('div');
      div.innerHTML = `<strong>${shareTitle.textContent.trim()}</strong>`;
      sidebarContent.push(div);
      // Add share buttons if present
      const sharing = element.querySelector('.sharing');
      if (sharing) {
        sidebarContent.push(sharing.cloneNode(true));
      }
    }
  }

  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // Add sidebar content as a single cell above the tabs (not as a tab)
  if (sidebarContent.length) {
    rows.push([sidebarContent]);
  }

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    const labelText = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;
    // Try to find the contentfragment/article
    let contentElem = panel.querySelector('article.cmp-contentfragment') || panel;
    let cellContent = [];
    // Add model field comment if available
    const dataLayer = contentElem.getAttribute && contentElem.getAttribute('data-cmp-data-layer');
    if (dataLayer) {
      try {
        const json = JSON.parse(dataLayer.replace(/&quot;/g, '"'));
        const elements = json[Object.keys(json)[0]].elements || [];
        elements.forEach(el => {
          if (el.xdm && el.xdm.title) {
            cellContent.push(document.createComment(` ${el.xdm.title} `));
          }
        });
      } catch(e) {}
    }
    cellContent.push(contentElem);
    rows.push([
      labelText,
      cellContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
