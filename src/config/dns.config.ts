import dns from 'dns';
import { promisify } from 'util';

const dnsConfig = Object.freeze({
  resolveMx: promisify(dns.resolveMx),
  timeoutMs: 5000,
});

export default dnsConfig;
