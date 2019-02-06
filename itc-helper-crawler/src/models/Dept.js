import depts from 'data/depts';

export const get = (name) => {
  const found = depts[name];

  if (!found) return null;

  return { name, ...found };
};

export const getAllNames = () => {
  return Object.keys(depts);
};
