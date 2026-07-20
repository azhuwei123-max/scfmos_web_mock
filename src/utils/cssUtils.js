/**
 * 获取浏览器版本
 * @returns 119.0.0.0
 */
const checkChromeVersion = () => {
  const list = navigator.userAgent.match(/Chrome\/([\d.]+)/)

  if (!list) return ''

  return list[1]
}

/**
 * 判断当前浏览器版本是否支持该动画函数
 * ainimation.finished、effect.setKeyframe等函数需要版本至少84的要求
 * @returns
 */
const isChromeVersion = () => {
  const version = checkChromeVersion()
  return version && version.split('.')[0] >= 84
}

const isChromeOk = isChromeVersion()

/**
 * 获取元素当前高度。若未获取到高度，则通过特殊方式获取元素高度
 * @param el
 * @returns 58
 */
const getElHeight = (el) => {
  let height = el.getBoundingClientRect().height
  if (height) return height

  // 不进行渲染而获取元素高度
  const height_copy = el.style.height
  el.style.height = 'auto'
  height = el.getBoundingClientRect().height
  el.style.height = height_copy

  return height
}

/**
 * @param height1 '2px'
 */
const getKeyFrames = (height1, height2) => {
  if (height1 != 'auto') height1 += 'px'
  if (height2 != 'auto') height2 += 'px'

  return [
    { height: height1, overflow: 'hidden' },
    { height: height2, overflow: 'hidden' },
  ]
}

/**
 * 高度变化动画渲染
 * @param el
 * @param bool 元素默认显隐，该属性不会触发动画效果
 * @example
 *    let animation = dynHeightAni(element, false)
 *    animation.animate(true)
 *
 *    注意：在适当时候销毁
 *    animation = null
 */
export const dynHeightAni = (el, bool) => {
  // 若浏览器版本过低则跳过动画，直接坐显隐控制
  if (!isChromeOk) {
    return {
      animate: (curBool) => {
        if (curBool) {
          el.style.height = 'auto'
          el.style.overflow = 'unset'
        } else {
          el.style.height = '0px'
          el.style.overflow = 'hidden'
        }
      },
    }
  }

  // 当前元素显示状态，用于动画结束后，若元素显示，则清空样式限制
  let curBool = bool
  const status = bool ? 'auto' : 0
  let elAnimation = el.animate(getKeyFrames(status, status), {
    duration: 300,
    fill: 'forwards',
  })

  // 首次控制显隐取消动画时间，直接结束
  elAnimation.playbackRate = -1
  elAnimation.finished.then((_) => {
    // 第一次动画结束后，恢复速率
    elAnimation.playbackRate = 1
  })

  // 动画回调
  elAnimation.onfinish = () => {
    // fill:forwards方式保持样式，会同时锁样式（无法修改同名样式）
    // 通过提交样式并且取消操作，可解除锁样式
    elAnimation.commitStyles()
    elAnimation.cancel()

    if (curBool) {
      el.style.height = 'auto'
      el.style.overflow = 'unset'
    }
  }

  let animate = (bool) => {
    if (!elAnimation || !!bool == curBool) return

    curBool = !!bool

    let height1 = 0,
      height2 = 0,
      elHeight,
      runningElHeight

    /**
     * 若动画进行中再次触发动画
     * 记录当前动画的高度，下次动画的关键帧以此高度作为基准，使动画效果更加流畅
     */
    if (elAnimation.playState === 'running') {
      runningElHeight = getElHeight(el)
      elAnimation.cancel()
    }

    elHeight = getElHeight(el)

    // 判断是否有正在running的动画高度
    if (runningElHeight) {
      height1 = bool ? runningElHeight : 0
      height2 = bool ? elHeight : runningElHeight
    } else {
      height2 = elHeight
    }

    // 关键帧
    const keyFrames = getKeyFrames(height1, height2)

    if (!bool) keyFrames.reverse()

    // 新动画仅修改关键帧，减少性能开支
    elAnimation.effect.setKeyframes(keyFrames)
    elAnimation.play()
  }

  let setDuration = (duration = 300) => {
    elAnimation.effect.updateTiming({ duration })
  }

  return {
    animate,
    setDuration,
  }
}
