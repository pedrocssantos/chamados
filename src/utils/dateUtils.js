export const brazilNow = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brTime = new Date(utc - (3600000 * 3));
  const dd = String(brTime.getDate()).padStart(2, '0');
  const mm = String(brTime.getMonth() + 1).padStart(2, '0');
  const yyyy = brTime.getFullYear();
  const hh = String(brTime.getHours()).padStart(2, '0');
  const min = String(brTime.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

export const brazilDateFromNow = (hoursAdded) => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brTime = new Date(utc - (3600000 * 3) + (hoursAdded * 3600000));
  const dd = String(brTime.getDate()).padStart(2, '0');
  const mm = String(brTime.getMonth() + 1).padStart(2, '0');
  const yyyy = brTime.getFullYear();
  const hh = String(brTime.getHours()).padStart(2, '0');
  const min = String(brTime.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};
