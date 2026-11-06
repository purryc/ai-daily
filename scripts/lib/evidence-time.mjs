import {localDate} from './cloud-state.mjs';
export function dateValue(value,label='date') {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||
    new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value)throw new Error('Invalid '+label+' date');
  return value;
}
export function timestamp(value,label='timestamp') {
  const match=typeof value==='string'&&value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/);
  const time=Date.parse(value);
  if(!match||!Number.isFinite(time))throw new Error('Invalid '+label+' timestamp; ISO offset required');
  dateValue(match[1],label);
  if(+match[2]>23||+match[3]>59||+match[4]>59||
    match[5]!=='Z'&&(+match[5].slice(1,3)>14||+match[5].slice(4)>59||+match[5].slice(1,3)===14&&+match[5].slice(4)!==0))
    throw new Error('Invalid '+label+' timestamp');
  return time;
}
function beforeCutoff(value,cutoff,label,source) {
  if(value.length===10) {
    dateValue(value,label);
    const endDate=localDate(new Date(cutoff));
    if(value>endDate)throw new Error(label+' is after cutoff');
    if(value===endDate&&!source.dateBoundaryUncertain)throw new Error(label+' date-only cutoff boundary needs uncertainty disclosure');
  }else if(timestamp(value,label)>=cutoff)throw new Error(label+' is at/after cutoff');
}
export function validateEvidenceTime(observation,source,cutoffValue) {
  const cutoff=timestamp(cutoffValue,'weekly cutoff');
  const observed=timestamp(observation.observed_at,'observed_at'),firstSeen=timestamp(observation.first_seen_at,'first_seen_at'),research=timestamp(observation.research_cutoff,'research_cutoff');
  if(firstSeen>observed||research>observed)throw new Error('Observation timestamps are inconsistent');
  beforeCutoff(observation.event_at,cutoff,'Event date',source);
  if(observation.published_at!==null)beforeCutoff(observation.published_at,cutoff,'Source published date',source);
  else if(source.temporalStatus!=='publication-date-unknown')throw new Error('Unknown publication date needs explicit temporal status');
  const late=observed>cutoff||firstSeen>cutoff||research>cutoff;
  if(late) {
    if(source.snapshotStatus!=='current-page-not-historical'||!source.temporalNote?.zh?.trim()||!source.temporalNote?.en?.trim()||
      timestamp(source.asOfCutoff,'asOfCutoff')!==cutoff)throw new Error('Post-cutoff reading needs explicit public disclosure and target cutoff');
    // A later live reading cannot establish an undated page's previous existence.
    if(observation.published_at===null)throw new Error('Undated post-cutoff source lacks dated evidence of prior publication');
    if(observation.metric!=null&&(!observation.measurement_at||timestamp(observation.measurement_at,'measurement_at')>cutoff))
      throw new Error('Post-cutoff measurement cannot be backdated from an older page publication');
  }
  if(source.dateBoundaryUncertain&&(!source.temporalNote?.zh?.trim()||!source.temporalNote?.en?.trim()))throw new Error('Date-boundary uncertainty needs public bilingual disclosure');
}
