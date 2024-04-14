module.exports = {
  content: ["./**/*.{html,js}"],
  presets: [
    require('@rise8/tailwind-pixel-perfect-preset')
  ],
  theme: {
    fontSize:{"custom-xs":"12rem","custom-sm":"14rem","custom-lg":"18rem","custom-2xl":"24rem","custom-3xl":"28rem","custom-4xl":"40rem"},borderRadius:{lg:"32rem"},extend:{colors:{"cornflower-blue":"#6175de",iris:"#495dc6",white:"#ffffff",dark:"#202935","cloudy-blue":"#cfd6de","dark-two":"#212934","denim-blue":"#3547a4","dark-slate-blue":"#1e2c6d","pale-grey":"#f8f9fa","pale-grey-two":"#e1e7eb",blush:"#f27979",wheat:"#fcd97e","dull-teal":"#53a691","dark-three":"#1e2936","bluey-grey":"#8695a9","bluey-grey-two":"#8095ad","iris-10":"#495dc6","iris-30":"#495dc6","dark-blue-grey":"#15293a","bluey-grey-three":"#8895a7","bluey-grey-four":"#8395ab","white-two":"#f2f2f2","white-three":"#e6e6e6","cloudy-blue-two":"#b8c4ce","pale-gold":"#fdd368","pale-gold-30":"#fdd368","light-mustard":"#f4ca64","light-mustard-10":"#f4ca64","dark-four":"#1c2937","dark-five":"#1b2937","iris-two":"#485cc5","dark-blue-grey-two":"#192939"},gap:{"spacing-xxs":"4rem","spacing-xs":"8rem","spacing-s":"12rem","spacing-m":"16rem","spacing-l":"20rem","spacing-xl":"24rem"}}
  },
  plugins: [],
}
