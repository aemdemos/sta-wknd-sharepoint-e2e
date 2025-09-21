/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the 8-column main, not sidebar)
  const main = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!main) return;

  // Find the contentfragment/article (main story)
  const contentFragment = main.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Find the contentfragment elements container
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all children, including divs, ps, images, etc.
  const children = Array.from(cfElements.children).filter(
    (el) => !(el.tagName === 'DIV' && el.querySelector('.aem-Grid'))
  );

  // Partition into sections by h2s (accordion titles)
  let rows = [];
  const headerRow = ['Accordion (accordion29)'];
  rows.push(headerRow);

  let sectionTitle = null;
  let sectionContent = [];

  // Use the main article title for the first section if present
  const mainTitleEl = main.querySelector('.cmp-title__text');
  let usedMainTitle = false;

  children.forEach((el) => {
    // Section title: h2 inside .cmp-title
    if (
      el.classList.contains('title') &&
      el.querySelector('.cmp-title__text') &&
      el.querySelector('.cmp-title__text').tagName === 'H2'
    ) {
      // Push previous section
      if (sectionTitle && sectionContent.length) {
        rows.push([
          sectionTitle,
          sectionContent.length === 1 ? sectionContent[0] : sectionContent.slice(),
        ]);
      }
      sectionTitle = el.querySelector('.cmp-title__text').cloneNode(true);
      sectionContent = [];
    } else {
      // If first section and no h2 seen yet, use main title
      if (!sectionTitle && !usedMainTitle && mainTitleEl) {
        sectionTitle = mainTitleEl.cloneNode(true);
        usedMainTitle = true;
      }
      sectionContent.push(el.cloneNode(true));
    }
  });
  // Push last section
  if (sectionTitle && sectionContent.length) {
    rows.push([
      sectionTitle,
      sectionContent.length === 1 ? sectionContent[0] : sectionContent.slice(),
    ]);
  }

  // Only output if there is at least one accordion item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
