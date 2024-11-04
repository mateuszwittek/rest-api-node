import dns from 'dns';
import { promisify } from 'util';
import { DNS_TIMEOUT_MS } from '../constants/checkDns.constants';

export const dnsConfig = {
  resolveMx: promisify<string, dns.MxRecord[]>(dns.resolveMx),
  timeoutMs: DNS_TIMEOUT_MS,
} as const;
