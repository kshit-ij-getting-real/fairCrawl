import { LicenseType, PriceRuleScope, PricingRule } from '@prisma/client';

export type PriceResolution = { priceMicros: number; ruleId: number | null };

const scopeRank: Record<PriceRuleScope, number> = {
  BOT: 1,
  PAGE: 2,
  KEYWORD: 3,
  FRESHNESS: 4,
  DIRECTORY: 5,
  GLOBAL: 6,
};

const testPath = (rule: PricingRule, path: string, fullUrl: string) => {
  if (rule.scope === 'PAGE' && rule.exactUrl) return rule.exactUrl === fullUrl;
  if ((rule.scope === 'DIRECTORY' || rule.scope === 'GLOBAL' || rule.scope === 'PAGE') && rule.pathPattern) {
    if (rule.pathPattern.includes('*')) {
      return path.startsWith(rule.pathPattern.replace('*', ''));
    }
    try {
      return new RegExp(rule.pathPattern).test(path);
    } catch {
      return path === rule.pathPattern;
    }
  }
  return true;
};

const testUserAgent = (rule: PricingRule, userAgent: string) => {
  if (!rule.userAgentRegex) return true;
  try {
    return new RegExp(rule.userAgentRegex, 'i').test(userAgent);
  } catch {
    return false;
  }
};

export const resolvePrice = (params: {
  rules: PricingRule[];
  path: string;
  fullUrl: string;
  userAgent: string;
  licenseType: LicenseType;
}) : PriceResolution => {
  const candidates = params.rules
    .filter((rule) => rule.enabled)
    .filter((rule) => !rule.licenseType || rule.licenseType === params.licenseType)
    .filter((rule) => testPath(rule, params.path, params.fullUrl))
    .filter((rule) => testUserAgent(rule, params.userAgent))
    .sort((a, b) => {
      const precedence = scopeRank[a.scope] - scopeRank[b.scope];
      if (precedence !== 0) return precedence;
      if (a.scope === 'DIRECTORY' && b.scope === 'DIRECTORY') {
        return (b.pathPattern?.length || 0) - (a.pathPattern?.length || 0);
      }
      return a.priority - b.priority;
    });

  const winner = candidates[0];
  if (!winner) {
    return { priceMicros: -1, ruleId: null };
  }
  return { priceMicros: winner.priceMicros, ruleId: winner.id };
};
