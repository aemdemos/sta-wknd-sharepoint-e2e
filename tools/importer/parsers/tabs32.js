/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (by class or role)
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, [role="tablist"], .cmp-tabs');
  if (!tabsContainer) return;

  // Find tab navigation (tab titles)
  let tabNav = tabsContainer.querySelector('[role="tablist"], .cmp-tabs__tablist, ol');
  if (!tabNav) return;
  // Get tab titles (li elements)
  const tabTitles = Array.from(tabNav.querySelectorAll('[role="tab"], .cmp-tabs__tab, li'));

  // Get tab panels (content for each tab)
  let tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));
  tabPanels = tabPanels.filter(panel => panel.parentElement === tabsContainer || panel.parentElement.parentElement === tabsContainer);

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs32)']);

  // For each tab, add a row: [Tab Title, Tab Content]
  for (let i = 0; i < tabTitles.length; i++) {
    const titleEl = tabTitles[i];
    const tabLabel = titleEl.textContent.trim();
    let panel;
    const ariaControls = titleEl.getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabsContainer.querySelector(`#${ariaControls}`);
    }
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }
    if (!panel) continue;
    let tabContent = [];
    // Get all meaningful children (skip empty grid wrappers)
    const children = Array.from(panel.children).filter(child => {
      if (child.classList.contains('aem-Grid') || child.classList.contains('aem-GridColumn')) return false;
      if (child.tagName === 'DIV' && child.children.length === 0 && child.textContent.trim() === '') return false;
      return true;
    });
    if (children.length) {
      tabContent = children;
    } else {
      tabContent = [panel];
    }
    rows.push([tabLabel, tabContent]);
  }

  // --- Extract sidebar info (left column) ---
  // Find the sidebar container (likely .cmp-contentfragment__elements or similar)
  let sidebar = null;
  // Try to find the sidebar by looking for the first .cmp-contentfragment__elements before the tabs
  const allSidebars = Array.from(element.querySelectorAll('.cmp-contentfragment__elements'));
  if (allSidebars.length) {
    // The sidebar is the first one before the tabsContainer
    sidebar = allSidebars.find(sb => sb.compareDocumentPosition(tabsContainer) & Node.DOCUMENT_POSITION_FOLLOWING);
    // Defensive: if not found, fallback to first
    if (!sidebar) sidebar = allSidebars[0];
  }

  // Also extract the block title (h1)
  const blockTitle = element.querySelector('h1');

  // Also extract the 'Share this Adventure' section (by heading or class)
  let shareSection = null;
  const shareTitle = Array.from(element.querySelectorAll('h5, .cmp-title__text')).find(h => h.textContent.trim().toLowerCase().includes('share this adventure'));
  if (shareTitle) {
    // Get its parent .title, then next .sharing sibling
    const titleDiv = shareTitle.closest('.title');
    if (titleDiv) {
      shareSection = titleDiv.nextElementSibling;
      if (shareSection && !shareSection.classList.contains('sharing')) shareSection = null;
    }
    // Defensive: fallback to any .sharing
    if (!shareSection) shareSection = element.querySelector('.sharing');
  }

  // Compose sidebar content
  const sidebarContent = [];
  if (blockTitle) sidebarContent.push(blockTitle.cloneNode(true));
  if (sidebar) sidebarContent.push(sidebar.cloneNode(true));
  if (shareTitle) sidebarContent.push(shareTitle.cloneNode(true));
  if (shareSection) sidebarContent.push(shareSection.cloneNode(true));

  // Add sidebar info as a separate table above the tabs block
  if (sidebarContent.length) {
    const sidebarTable = WebImporter.DOMUtils.createTable([
      ['Info'],
      [sidebarContent]
    ], document);
    element.parentElement.insertBefore(sidebarTable, element);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
