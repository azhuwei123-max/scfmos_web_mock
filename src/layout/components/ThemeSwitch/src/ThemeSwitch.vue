<script lang="ts" setup>
import { computed, nextTick } from 'vue'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'ThemeSwitch' })

const appStore = useAppStore()

const isDark = computed({
  get: () => appStore.getIsDark,
  set: (val: boolean) => {
    appStore.setIsDark(val)
  }
})

const theme = computed(() => (isDark.value ? 'light' : 'dark'))

const toggleTheme = (event: MouseEvent) => {
  const isAppearanceTransition =
    typeof (document as any).startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  requestAnimationFrame(() => {
    const transition = (document as any).startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      const animate = document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 400,
          easing: 'ease-in-out',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)'
        }
      )
      animate.onfinish = () => {
        transition.skipTransition()
      }
    })
  })
}
</script>

<template>
  <button
    :aria-label="theme"
    :class="['theme-toggle', `is-${theme}`]"
    aria-live="polite"
    class="cursor-pointer border-none bg-transparent"
    type="button"
    @click.stop="toggleTheme"
  >
    <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18">
      <mask
        id="theme-toggle-moon-mask"
        class="theme-toggle__moon"
        fill="currentColor"
        stroke="none"
      >
        <rect fill="white" height="100%" width="100%" x="0" y="0" />
        <circle cx="40" cy="8" fill="black" r="11" />
      </mask>
      <circle
        id="sun"
        class="theme-toggle__sun"
        cx="12"
        cy="12"
        mask="url(#theme-toggle-moon-mask)"
        r="11"
      />
      <g class="theme-toggle__sun-beams">
        <line x1="12" x2="12" y1="1" y2="3" />
        <line x1="12" x2="12" y1="21" y2="23" />
        <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
        <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
        <line x1="1" x2="3" y1="12" y2="12" />
        <line x1="21" x2="23" y1="12" y2="12" />
        <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
        <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
      </g>
    </svg>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  color: var(--el-text-color-primary);
  will-change: transform, background-color;
}

.theme-toggle {
  &:hover {
    animation: shrink 0.3s ease-in-out;
  }

  &__moon {
    > circle {
      transition: transform 0.5s cubic-bezier(0, 0, 0.3, 1);
      will-change: transform;
    }
  }

  &__sun {
    fill: currentColor;
    opacity: 0.9;
    stroke: none;
    transform-origin: center center;
    transition: transform 1.6s cubic-bezier(0.25, 0, 0.2, 1);
    will-change: transform;
  }

  &:hover &__sun {
    opacity: 1;
  }

  &__sun-beams {
    stroke: currentColor;
    stroke-width: 2px;
    opacity: 0.9;
    transform-origin: center center;
    transition:
      transform 1.6s cubic-bezier(0.5, 1.5, 0.75, 1.25),
      opacity 0.6s cubic-bezier(0.25, 0, 0.3, 1);
    will-change: transform, opacity;
  }

  &:hover &__sun-beams {
    stroke: currentColor;
    opacity: 1;
  }

  &.is-light {
    .theme-toggle__sun {
      transform: scale(0.5);
    }

    .theme-toggle__sun-beams {
      transform: rotateZ(0.25turn);
    }
  }

  &.is-dark {
    .theme-toggle__moon > circle {
      transform: translateX(-20px);
    }

    .theme-toggle__sun-beams {
      opacity: 0;
    }
  }

  &:hover > svg {
    .theme-toggle__sun,
    .theme-toggle__moon {
      fill: currentColor;
    }
  }
}

@keyframes shrink {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
}
</style>
