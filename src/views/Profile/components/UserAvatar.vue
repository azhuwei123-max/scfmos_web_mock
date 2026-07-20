<template>
  <div class="change-avatar">
    <div class="avatar-container">
      <div class="default-avatar-overlay" >
        <el-avatar :size="120" class="default-avatar" :style="avatarStyle">
          {{ firstChar }}
        </el-avatar>
      </div>
      <CropperAvatar
      ref="cropperRef"
      :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
      :showBtn="false"
      :value="img"
      width="120px"
      @change="handelUpload"
      class="avatar-hidden"
    />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { uploadAvatar } from '@/api/system/user/profile'
import { CropperAvatar } from '@/components/Cropper'
import { useUserStore } from '@/store/modules/user'


defineOptions({ name: 'UserAvatar' })

defineProps({
  img: propTypes.string.def('')
})

const userStore = useUserStore()

// 获取用户名字首个字符
const firstChar = computed(()=> {
  const nickname = userStore.getUser?.nickname || ''
  return nickname ? nickname.charAt(0).toUpperCase() :'U'
})

// 投向样式:蓝色背景，白色字体
const avatarStyle = computed(()=> ({
  backgroundColor:'#409EFF',
  color:'#fff',
  fontSize:'48px',
  fontWeight:'bold',
  cursor:'pointer'
}))


const cropperRef = ref()
const handelUpload = async ({ data }) => {
  const res = await uploadAvatar({ avatarFile: data })
  cropperRef.value.close()
  userStore.setUserAvatarAction(res.data)
}
</script>

<style lang="scss" scoped>
.change-avatar {
  img {
    display: block;
    margin-bottom: 15px;
    border-radius: 50%;
  }

  .avatar-container {
    position: relative;
    display: inline-block;
  }

  .default-avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: pointer;

    .default-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s;
    }


    // &:hover::after {
    //   position: absolute;
    //   inset: 0;
    //   font-size: 24px;
    //   -webkit-font-smoothing: antialiased;
    //   -moz-osx-font-smoothing: grayscale;
    //   font-style: normal;
    //   line-height: 120px;
    //   color: #eee;
    //   cursor: pointer;
    //    background: rgb(0 0 0 / 50%);
    //    border-radius:50% ;
    //    content:'+';
    //    display: flex;
    //    align-items: center;
    //    justify-content: center;
    // }
  }

  :deep(.avatar-hidden) {
    .user-info-head {
      .el-avatar {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
}
</style>
