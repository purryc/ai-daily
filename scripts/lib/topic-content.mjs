export function allIssueTopics(issue) {
  return [...(issue.topics ?? []), ...(issue.contextTopics ?? [])];
}
export function coverFigureFallback(issue, locale) {
  if (issue.topics?.length)
    return locale === "zh" ? "暂无可核实的封面图" : "No verified cover figure available";
  return locale === "zh" ? "没有可核实的新进展" : "No verified new advances";
}
export function allTopicMedia(topic) {
  return [
    ...(topic.media ?? []),
    ...(topic.detailPages ?? []).flatMap((page) => page.media ?? []),
  ];
}
export function allTopicVisuals(topic) {
  const visuals = [
    ...(topic.visuals ?? (topic.visual ? [topic.visual] : [])),
    ...(topic.detailPages ?? []).flatMap((page) => page.visuals ?? []),
    ...allTopicMedia(topic)
      .map((media) => media.poster)
      .filter(Boolean),
  ];
  return [...new Map(visuals.map((visual) => [visual.path, visual])).values()];
}
