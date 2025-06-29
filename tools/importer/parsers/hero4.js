/* global WebImporter */
export default function parse(element, { document }) {
  // Find the featured hero/teaser block
  const cmpContainer = element.querySelector('.cmp-container');
  if (!cmpContainer) return;

  const grid = cmpContainer.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the hero teaser block
  const teaserDiv = Array.from(grid.children).find(
    (div) => div.classList && div.classList.contains('teaser') && div.classList.contains('cmp-teaser--featured')
  );
  if (!teaserDiv) return;

  const heroTeaser = teaserDiv.querySelector('.cmp-teaser');
  if (!heroTeaser) return;

  // Get the hero image (first <img> in .cmp-teaser__image)
  let heroImage = null;
  const heroImageDiv = heroTeaser.querySelector('.cmp-teaser__image');
  if (heroImageDiv) {
    heroImage = heroImageDiv.querySelector('img');
  }

  // Gather hero text content
  const heroContent = heroTeaser.querySelector('.cmp-teaser__content');
  const textFragments = [];

  if (heroContent) {
    const heroPretitle = heroContent.querySelector('.cmp-teaser__pretitle');
    const heroTitle = heroContent.querySelector('.cmp-teaser__title');
    const heroDescription = heroContent.querySelector('.cmp-teaser__description');
    const heroCTA = heroContent.querySelector('.cmp-teaser__action-link');

    if (heroPretitle) textFragments.push(heroPretitle);
    if (heroTitle) textFragments.push(heroTitle);
    if (heroDescription) textFragments.push(heroDescription);
    if (heroCTA) textFragments.push(heroCTA);
  }

  // Table structure: [header][image][content]
  const headerRow = ['Hero (hero4)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [textFragments.length ? textFragments : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the .teaser.cmp-teaser--featured element with the table
  teaserDiv.replaceWith(table);
}
