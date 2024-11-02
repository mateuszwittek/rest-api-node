import dns from 'dns';
import { promisify } from 'util';

const dnsConfig = {
  resolveMx: promisify(dns.resolveMx),
  timeoutMs: 5000,
} as const;

export default dnsConfig;
