export const buildFullName = (first: string, last: string): string => {
  if (!first && !last) {
    return "";
  }

  if (!first) {
    return last;
  }

  if (!last) {
    return first;
  }

  return `${first} ${last}`;
};
