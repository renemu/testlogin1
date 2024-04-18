const thousandSeparator = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const upsale = (total_qty, sales) => {
  let res = total_qty / sales;
  res = (Math.round(res * 100) / 100).toFixed(2);
  return res;
};

const pad = (n) => {
    return (n < 10) ? ("0" + n) : n;
}

export { thousandSeparator, upsale, pad}
