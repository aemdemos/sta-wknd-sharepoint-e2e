/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs root panel
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab headers
  const tabLabelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels, in order
  const tabPanelEls = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));
  
  // Build header row: block name exactly as per instructions
  const headerRow = ['Tabs (tabs14)'];
  const rows = [];
  
  // Build a row for every tab
  for (let i = 0; i < tabLabelEls.length; i++) {
    const labelEl = tabLabelEls[i];
    const panelEl = tabPanelEls[i];
    // Defensive: if panelEl missing, leave content blank
    let content = '';
    if (panelEl) {
      // For each panel, keep all relevant content (element children and text nodes)
      // Exclude <script> and <style>
      const panelContent = Array.from(panelEl.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style') return false;
          // Also ignore empty grid divs (AEM layout artifacts)
          if (tag === 'div' && node.classList.contains('aem-Grid')) return false;
          if (tag === 'div' && node.classList.contains('aem-GridColumn')) return false;
          // Otherwise, keep
          return true;
        }
        // Keep non-empty text nodes
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      // If only one element, use it directly; otherwise array
      if (panelContent.length === 1) {
        content = panelContent[0];
      } else if (panelContent.length > 1) {
        content = panelContent;
      }
    }
    // Label as text only (preserve original tab label spacing)
    const label = labelEl.textContent.trim();
    rows.push([label, content]);
  }

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block root with our table
  const tabsContainer = element.querySelector('.tabs');
  if (tabsContainer) {
    tabsContainer.replaceWith(table);
  }
}
