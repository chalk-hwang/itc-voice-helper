import profs from 'data/profs';

export const get = (name) => {
  const found = profs[name];
  if (!found) return null;
  return { name, ...found };
};
