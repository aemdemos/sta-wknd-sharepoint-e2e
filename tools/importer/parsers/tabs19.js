/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root element
  // Accepts .tabs.panelcontainer or .cmp-tabs direct
  let tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsBlock) {
    cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  } else {
    // fallback: maybe element is already .cmp-tabs
    cmpTabs = element.classList.contains('cmp-tabs') ? element : element.querySelector('.cmp-tabs');
    tabsBlock = cmpTabs;
  }
  if (!cmpTabs) return;

  // Get the tab labels in order
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > .cmp-tabs__tab')
  );

  // Get tab panel elements (in DOM order):
  // Only direct children of .cmp-tabs, or .cmp-tabs__tabpanel under .cmp-tabs
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );
  // Defensive: check that we have matching numbers
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build header row as in requirement
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // For each tab, add a row: [tab label, content element(s)]
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: ensure we don't go out of bounds
    const tabLabel = tabLabels[i]?.textContent?.trim() || '';
    const tabPanel = tabPanels[i];
    if (!tabPanel || !tabLabel) continue;
    // Find the main content for the tab panel
    // Usually is a .contentfragment or .cmp-contentfragment or its immediate children
    // We'll gather all meaningful children except empty .aem-Grid or empty divs
    let contentCandidates = [];
    const fragment = tabPanel.querySelector('.contentfragment, .cmp-contentfragment');
    if (fragment) {
      // We want everything inside .cmp-contentfragment__elements if present
      const elements = fragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Only meaningful children: skip empty .aem-Grid and empty divs
        const meaningful = Array.from(elements.children).filter(child => {
          if (child.matches('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12')) return false;
          if (child.tagName === 'DIV' && child.innerHTML.trim() === '') return false;
          return true;
        });
        contentCandidates = meaningful.length ? meaningful : [elements];
      } else {
        // fallback: just use fragment content
        contentCandidates = [fragment];
      }
    } else {
      // fallback: use tabPanel content
      contentCandidates = [tabPanel];
    }
    // If only one candidate, pass as element; if multiple, as array
    const contentCell = contentCandidates.length === 1 ? contentCandidates[0] : contentCandidates;
    rows.push([tabLabel, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the whole tabs block (root tabs container) with the new table
  tabsBlock.replaceWith(table);
}
