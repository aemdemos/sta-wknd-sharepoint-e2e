/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Find tab labels (li[role="tab"])
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist li[role="tab"]')
  );

  // Find tab panels (div[role="tabpanel"] inside tabsContainer)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the header row: block name only, per spec
  const rows = [['Tabs (tabs29)']];

  // For each tab, get the label and corresponding panel content
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const label = labelEl.textContent.trim();

    // Match panel by aria-controls (preferred), else fallback to index
    let panel = null;
    const controlsId = labelEl.getAttribute('aria-controls');
    if (controlsId) {
      panel = tabsContainer.querySelector(`#${controlsId}`);
    }
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }

    let contentEl = null;
    if (panel) {
      // If the tabpanel contains a single child .contentfragment, use that for cleaner output
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        contentEl = contentFragment;
      } else {
        // fallback: use the panel itself
        contentEl = panel;
      }
    } else {
      // Defensive: if no panel found, supply empty
      contentEl = document.createTextNode('');
    }

    rows.push([label, contentEl]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
