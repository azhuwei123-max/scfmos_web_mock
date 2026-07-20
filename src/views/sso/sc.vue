<template>
  <div class="generator-container">
    <h2 class="title">Spring Boot 项目生成器</h2>

    <el-form :model="form" label-width="100px" class="form-box">
      <el-form-item label="Group">
        <el-input v-model="form.group" placeholder="com.example" />
      </el-form-item>

      <el-form-item label="Artifact">
        <el-input v-model="form.artifact" placeholder="demo" />
      </el-form-item>

      <el-form-item label="Name">
        <el-input v-model="form.name" placeholder="demo" />
      </el-form-item>

      <el-form-item>
        <el-button tpye="" @click="generateProject"> 🚀 生成项目 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GeneratorForm',
  data() {
    return {
      form: {
        group: 'com.example',
        artifact: 'demo',
        name: 'demo'
      }
    }
  },
  methods: {
    generateProject() {
      const { group, artifact, name } = this.form
      alert(`✅ 已生成项目：
Group: ${group}
Artifact: ${artifact}
Name: ${name}`)
      // 实际场景这里可以调用后端接口生成 zip 文件
    }
  }
}
</script>

<style scoped>
.generator-container {
  width: 480px;
  margin: 80px auto;
  padding: 30px 40px;
  background: linear-gradient(145deg, #f6f7f9, #e9edf3);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  font-size: 20px;
  color: #333;
  margin-bottom: 25px;
}

.el-input input {
  background-color: #fff;
  border-radius: 8px;
}

.el-button {
  width: 100%;
  border-radius: 10px;
  font-size: 16px;
}
</style>
