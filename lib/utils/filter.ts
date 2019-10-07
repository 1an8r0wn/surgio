import _ from 'lodash';

import { NodeNameFilterType, SimpleNodeConfig } from '../types';

export const mergeFilters = (filters: ReadonlyArray<NodeNameFilterType>, isStrict?: boolean): NodeNameFilterType => {
  return (item: SimpleNodeConfig) => {
    return filters[isStrict ? 'every' : 'some'](filter => filter(item));
  };
};

export const useKeywords = (keywords: ReadonlyArray<string>, isStrict?: boolean): NodeNameFilterType => {
  // istanbul ignore next
  if (!Array.isArray(keywords)) {
    throw new Error('keywords 请使用数组。');
  }

  return item => keywords[isStrict ? 'every' : 'some'](keyword => item.nodeName.includes(keyword));
};

export const useRegexp = (regexp: RegExp): NodeNameFilterType => {
  // istanbul ignore next
  if (!_.isRegExp(regexp)) {
    throw new Error('入参不是一个合法的正则表达式。');
  }

  return item => regexp.test(item.nodeName);
};

export const netflixFilter: NodeNameFilterType = item => {
  return [
    'netflix',
    'hkbn',
    'hkt',
    'hgc',
  ].some(key => item.nodeName.toLowerCase().includes(key));
};

export const usFilter: NodeNameFilterType = item => {
  return ['🇺🇸', '美', 'us'].some(key => item.nodeName.toLowerCase().includes(key));
};

export const hkFilter: NodeNameFilterType = item => {
  return ['🇭🇰', '港', 'hk'].some(key => item.nodeName.toLowerCase().includes(key));
};

export const japanFilter: NodeNameFilterType = item => {
  return ['🇯🇵', '日', 'jp', 'japan'].some(key => item.nodeName.toLowerCase().includes(key));
};

export const koreaFilter: NodeNameFilterType = item => {
  return ['🇰🇷', '韩', 'korea'].some(key => item.nodeName.toLowerCase().includes(key));
};

export const singaporeFilter: NodeNameFilterType = item => {
  return ['🇸🇬', '新加坡', 'sin', 'singapore'].some(key => item.nodeName.toLowerCase().includes(key));
};

export const taiwanFilter: NodeNameFilterType = item => {
  return ['🇹🇼', '台湾', '台灣', '臺灣', 'tw', 'taiwan'].some(key => item.nodeName.toLowerCase().includes(key));
};

export const youtubePremiumFilter: NodeNameFilterType = mergeFilters([usFilter, japanFilter, koreaFilter]);
