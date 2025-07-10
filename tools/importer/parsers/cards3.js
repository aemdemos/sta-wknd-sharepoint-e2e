/* global WebImporter */
export default function parse(element, { document }) {
  // Build table rows, always starting with the header row
  const rows = [['Cards (cards3)']];

  // Gather children for easy processing
  const children = Array.from(element.children);

  // Helper: collect all sections, their headers, and intros
  // We'll push header/intro blocks as rows, then the associated cards
  let i = 0;
  while (i < children.length) {
    const el = children[i];
    // Look for a section header (has a .title.cmp-title--underline > h2)
    if (
      el.matches &&
      el.matches('.title.cmp-title--underline') &&
      el.querySelector('h2.cmp-title__text')
    ) {
      // Collect the header and the following .text intro (if any) for this group
      const sectionGroup = [el];
      if (
        i + 1 < children.length &&
        children[i + 1].matches &&
        children[i + 1].matches('.text')
      ) {
        sectionGroup.push(children[i + 1]);
        i++;
      }
      // Add this as a single cell row
      rows.push([sectionGroup]);
    }
    // If element is a card section, handle it
    if (
      el.matches &&
      el.matches('section.experiencefragment.cmp-experience-fragment--contributor')
    ) {
      // Card image
      const img = el.querySelector('img');
      // Card content: h3, h5, social links
      const rightCell = [];
      const h3 = el.querySelector('h3.cmp-title__text');
      if (h3) rightCell.push(h3);
      const h5 = el.querySelector('h5.cmp-title__text');
      if (h5) {
        if (rightCell.length) rightCell.push(document.createElement('br'));
        rightCell.push(h5);
      }
      const buildingBlock = el.querySelector('.buildingblock');
      let socialLinks = [];
      if (buildingBlock) {
        socialLinks = Array.from(buildingBlock.querySelectorAll('a.cmp-button'));
      } else {
        socialLinks = Array.from(el.querySelectorAll('a.cmp-button'));
      }
      if (socialLinks.length) {
        rightCell.push(document.createElement('br'));
        const socialsDiv = document.createElement('div');
        socialLinks.forEach(a => socialsDiv.appendChild(a));
        rightCell.push(socialsDiv);
      }
      rows.push([img, rightCell]);
    }
    i++;
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
