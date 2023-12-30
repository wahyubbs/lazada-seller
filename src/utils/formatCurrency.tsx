export default function numberFormat(number: number) {
  return new Intl.NumberFormat("id").format(number);
}
