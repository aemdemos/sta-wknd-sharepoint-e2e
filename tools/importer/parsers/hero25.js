/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block container (the first .cmp-teaser--hero)
  const hero = element.querySelector('.cmp-teaser--hero');
  if (!hero) return;

  // Find image inside hero
  let imageElem = null;
  const imageContainer = hero.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) imageElem = img;
  }

  // Find the content (title, subheading, cta)
  // For this example, only a title exists and is an h2
  const contentElems = [];
  const teaserContent = hero.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Collect all children (to allow for subheading, cta, etc. in future variations)
    Array.from(teaserContent.children).forEach(child => {
      contentElems.push(child);
    });
  }

  // Construct table rows as per block structure: header, [image], [content]
  const rows = [
    ['Hero (hero25)'],
    [imageElem ? imageElem : ''],
    [contentElems.length ? contentElems : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
