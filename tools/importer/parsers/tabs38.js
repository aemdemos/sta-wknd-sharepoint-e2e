/* global WebImporter */
export default function parse(element, { document }) {
    // Find the tabs block (cmp-tabs)
    const tabsBlock = element.querySelector('.cmp-tabs');
    if (!tabsBlock) return;

    // Get tab labels from tabList (preserving full label text)
    const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
    if (!tabList) return;
    const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

    // Get tab panels in order
    const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

    // Prepare header row per table spec
    const headerRow = ['Tabs (tabs38)'];
    const rows = [headerRow];

    // For each tab, extract label and content
    for (let i = 0; i < tabLabels.length; i++) {
        // Tab label text
        const label = tabLabels[i].textContent.trim();
        // Tab content element
        const tabPanel = tabPanels[i];
        if (!tabPanel) continue;

        // Reference the direct article within this panel, if present
        let contentEl = tabPanel.querySelector('article');
        if (contentEl) {
            rows.push([label, contentEl]);
            continue;
        }
        // Otherwise, reference the panel itself, removing any empty .aem-Grid sub-divs
        const panel = tabPanel;
        // Remove only empty .aem-Grid elements from the panel for clarity
        const gridsToRemove = Array.from(panel.querySelectorAll('.aem-Grid'));
        gridsToRemove.forEach(grid => {
            // Remove only if empty (no children with text)
            if (!grid.textContent.trim()) grid.remove();
        });
        rows.push([label, panel]);
    }

    // Create the table
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the original tabs block with the new table
    tabsBlock.replaceWith(table);
}
