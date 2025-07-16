/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-teaser--hero
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!heroTeaser) return;

  // Get the background image (find the first <img> in the hero block)
  let bgImg = null;
  const teaserImageDiv = heroTeaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    bgImg = teaserImageDiv.querySelector('img');
  }

  // Prepare content block (title, subheading, cta)
  const contentElems = [];
  const teaserContent = heroTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Include all headings and paragraphs (covers title, subheading, cta possibilities)
    const contentChildren = Array.from(teaserContent.children).filter(child => {
      return ['H1','H2','H3','H4','H5','H6','P','A'].includes(child.tagName);
    });
    if (contentChildren.length) {
      contentElems.push(...contentChildren);
    }
  }

  // Table structure: 1 col, 3 rows: header, background image, content
  const cells = [
    ['Hero (hero25)'],
    [bgImg ? bgImg : ''],
    [contentElems.length ? contentElems : '']
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
