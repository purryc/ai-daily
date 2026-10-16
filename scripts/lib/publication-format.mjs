// Preserve the explicit web-only contract used by the published October 15 issue.
export const isWebOnly = issue => issue.publicationFormat === 'web-only' ||
  (issue.pdfDelivery === false && Array.isArray(issue.formats) &&
    issue.formats.length === 1 && issue.formats[0] === 'web');
