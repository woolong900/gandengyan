/** Durable Object stub by name. wrangler 4.0 没有 getByName，退回 idFromName。 */
export const named = (ns, name) => {
  const key = String(name);
  if (typeof ns.getByName === 'function') return ns.getByName(key);
  return ns.get(ns.idFromName(key));
};
