
const createValidCountdownDate = (): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 15);
  return date;
};
