import subDept from 'data/subDepts';

export const get = (name) => {
  const found = subDept[name];
  if (!found) return null;
  return { name, ...found };
};
