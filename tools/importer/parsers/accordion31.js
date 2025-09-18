/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment article
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;

  // Helper to extract accordion sections
  function extractAccordionSections(cfArticle) {
    const sections = [];
    const elementsDiv = cfArticle.querySelector('.cmp-contentfragment__elements');
    if (!elementsDiv) return sections;

    // Get all children of the parent of elementsDiv
    const allChildren = Array.from(elementsDiv.parentNode.children);
    // Find all h2 titles and their positions
    let sectionIndexes = [];
    for (let i = 0; i < allChildren.length; i++) {
      const h2 = allChildren[i].querySelector && allChildren[i].querySelector('h2.cmp-title__text');
      if (h2) {
        sectionIndexes.push({ idx: i, title: h2 });
      }
    }

    // First section: intro (from after h3 to first h2)
    const introTitle = cfArticle.querySelector('h3.cmp-contentfragment__title');
    let introContent = [];
    const elementsDivIdx = allChildren.indexOf(elementsDiv);
    for (let i = elementsDivIdx + 1; i < (sectionIndexes[0]?.idx ?? allChildren.length); i++) {
      // Only push if not a grid wrapper and not empty
      if (allChildren[i] && allChildren[i].textContent.trim() && !allChildren[i].classList.contains('aem-Grid')) {
        introContent.push(allChildren[i]);
      }
    }
    if (introContent.length) {
      sections.push([
        introTitle,
        introContent.length === 1 ? introContent[0] : introContent
      ]);
    }

    // For each section, gather content until next section
    for (let s = 0; s < sectionIndexes.length; s++) {
      const title = sectionIndexes[s].title;
      const startIdx = sectionIndexes[s].idx;
      const endIdx = (sectionIndexes[s + 1]?.idx ?? allChildren.length);
      let content = [];
      for (let i = startIdx + 1; i < endIdx; i++) {
        if (allChildren[i] && allChildren[i].textContent.trim() && !allChildren[i].classList.contains('aem-Grid')) {
          content.push(allChildren[i]);
        }
      }
      if (content.length) {
        sections.push([
          title,
          content.length === 1 ? content[0] : content
        ]);
      }
    }
    return sections;
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion31)'];
  const accordionRows = extractAccordionSections(cfArticle);

  // Only replace if there are accordion rows
  if (accordionRows.length === 0) return;

  // Compose the table
  const cells = [headerRow, ...accordionRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the ENTIRE contentfragment article with the block table
  cfArticle.replaceWith(block);
}
