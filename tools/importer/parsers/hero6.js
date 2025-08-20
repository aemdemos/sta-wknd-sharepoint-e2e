/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.cmp-teaser');
  if (!heroTeaser) return;

  // Extract the hero image (as in the example, only the first <img> inside cmp-teaser__image)
  let heroImage = '';
  const teaserImage = heroTeaser.querySelector('.cmp-teaser__image img');
  if (teaserImage) {
    heroImage = teaserImage;
  }

  // Extract the heading/title (as in the example, it's a heading inside cmp-teaser__content)
  let heroHeading = '';
  const teaserContent = heroTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Find the first heading element in content
    const heading = teaserContent.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      heroHeading = heading;
    }
  }

  // Build the table as specified in the markdown example
  const cells = [
    ['Hero (hero6)'],
    [heroImage ? heroImage : ''],
    [heroHeading ? heroHeading : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  element.replaceWith(table);
}
