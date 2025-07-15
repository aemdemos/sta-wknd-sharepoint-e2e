/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area that contains the article body (8 column wide main)
  let main8 = element.closest('main.container.aem-GridColumn--default--8') || element.querySelector('main.container.aem-GridColumn--default--8');
  if (!main8) return;

  // Prepare the left column content: title, subtitle, and contentfragment article
  const leftColContent = [];

  // Title (h1)
  const title = main8.querySelector('.title .cmp-title__text');
  if (title) leftColContent.push(title);

  // Author (h4)
  const subtitle = main8.querySelectorAll('.title .cmp-title__text')[1];
  if (subtitle) leftColContent.push(subtitle);

  // Article contentfragment (article.contentfragment)
  const cfArticle = main8.querySelector('article.contentfragment');
  if (cfArticle) {
    leftColContent.push(cfArticle);
  }

  // Prepare the right column content: byline and social buttons
  // Look for experiencefragment, then byline inside it
  let rightColContent = [];
  const experienceFragment = element.querySelector('.experiencefragment') || document.querySelector('.experiencefragment');
  if (experienceFragment) {
    const byline = experienceFragment.querySelector('.cmp-byline');
    if (byline) rightColContent.push(byline);
    // Social buttons: look for .cmp-button inside xf-master-* grid
    const socialButtonsGrid = experienceFragment.querySelector('.xf-master-building-block');
    if (socialButtonsGrid) {
      const buttons = Array.from(socialButtonsGrid.querySelectorAll('.cmp-button'));
      if (buttons.length)
        rightColContent = rightColContent.concat(buttons);
    }
  }

  // If rightColContent is empty, don't include the cell
  const headerRow = ['Columns (columns8)'];
  const hasRightCol = rightColContent.length > 0;
  const cells = hasRightCol
    ? [headerRow, [leftColContent, rightColContent]]
    : [headerRow, [leftColContent]];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
