declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
// Tương tự cho scss/sass nếu bạn dùng
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}