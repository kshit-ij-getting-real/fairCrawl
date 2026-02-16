import assert from 'assert';
import { LicenseType, PriceRuleScope, PricingRule } from '@prisma/client';
import { resolvePrice } from './pricing';

const base = {
  domainId: 1,
  enabled: true,
  exactUrl: null,
  userAgentRegex: null,
  keywordExpression: null,
  freshnessWindowMins: null,
  licenseType: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const rules: PricingRule[] = [
  { ...base, id: 1, scope: PriceRuleScope.GLOBAL, pathPattern: '/', priceMicros: 1000, priority: 10 },
  { ...base, id: 2, scope: PriceRuleScope.DIRECTORY, pathPattern: '/news/*', priceMicros: 2000, priority: 10 },
  { ...base, id: 3, scope: PriceRuleScope.BOT, pathPattern: '/news/*', userAgentRegex: 'my-agent', priceMicros: 3000, priority: 10 },
] as PricingRule[];

const one = resolvePrice({ rules, path: '/news/today', fullUrl: 'https://x.com/news/today', userAgent: 'my-agent', licenseType: LicenseType.DISPLAY });
assert.equal(one.priceMicros, 3000);
assert.equal(one.ruleId, 3);

const two = resolvePrice({ rules, path: '/news/today', fullUrl: 'https://x.com/news/today', userAgent: 'other', licenseType: LicenseType.DISPLAY });
assert.equal(two.priceMicros, 2000);
assert.equal(two.ruleId, 2);

const three = resolvePrice({ rules: [], path: '/x', fullUrl: 'https://x.com/x', userAgent: 'ua', licenseType: LicenseType.SUMMARY });
assert.equal(three.priceMicros, -1);

console.log('pricing tests passed');
