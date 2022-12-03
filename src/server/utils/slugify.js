export const slugify = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/ /g, '_').toLowerCase().replace(/[^\w-]+/g, '');
}