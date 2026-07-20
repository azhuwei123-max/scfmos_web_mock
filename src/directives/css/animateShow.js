import { dynHeightAni } from '@/utils/cssUtils.js'

/**
 * 高度动画控制显隐指令
 * 
 *  <div v-animateShow="isShow" />
 * @param {*} app 
 */
export function animateShow(app) {
  app.directive('animateShow', {
    beforeMount(el, binding) {
      const { value } = binding
      el.myAnimation = dynHeightAni(el, !!value)
    },

    updated(el, binding) {
      const { value } = binding
      console.log('???????', value);
      el.myAnimation?.animate(value)
    },
  })
}
