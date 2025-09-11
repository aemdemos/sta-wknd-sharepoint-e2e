/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only parse the main magazine cards block
  // Find the featured teaser and the image-list block
  const teaser = element.querySelector('.teaser.cmp-teaser--featured');
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');

  // Header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Featured Article Card
  if (teaser) {
    // Image (first cell)
    const teaserImgWrap = teaser.querySelector('.cmp-teaser__image');
    let teaserImg = null;
    if (teaserImgWrap) {
      teaserImg = teaserImgWrap.querySelector('img');
    }
    // Text (second cell)
    const teaserContent = teaser.querySelector('.cmp-teaser__content');
    const teaserPretitle = teaserContent && teaserContent.querySelector('.cmp-teaser__pretitle');
    const teaserTitle = teaserContent && teaserContent.querySelector('.cmp-teaser__title');
    const teaserDesc = teaserContent && teaserContent.querySelector('.cmp-teaser__description');
    const teaserAction = teaserContent && teaserContent.querySelector('.cmp-teaser__action-link');

    // Compose text cell
    const textCell = [];
    if (teaserPretitle) textCell.push(teaserPretitle);
    if (teaserTitle) textCell.push(teaserTitle);
    if (teaserDesc) textCell.push(teaserDesc);
    if (teaserAction) textCell.push(teaserAction);

    rows.push([
      teaserImg ? teaserImg : '',
      textCell
    ]);
  }

  // Article Cards from image-list
  if (imageList) {
    const items = imageList.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      // Image (first cell)
      const imgWrap = li.querySelector('.cmp-image-list__item-image');
      let img = null;
      if (imgWrap) {
        img = imgWrap.querySelector('img');
      }
      // Text (second cell)
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      const title = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
      const desc = li.querySelector('.cmp-image-list__item-description');
      // Compose text cell
      const textCell = [];
      if (title) textCell.push(title);
      if (desc) textCell.push(desc);
      rows.push([
        img ? img : '',
        textCell
      ]);
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
