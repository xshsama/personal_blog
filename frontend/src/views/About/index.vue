<template>
  <div class="about-view">
    <el-card class="about-card">
      <template #header>
        <div class="about-header">
          <el-avatar :size="100" :src="profile.avatar" />
          <h1 class="about-title">关于我</h1>
        </div>
      </template>

      <div class="about-content">
        <div class="section bio-section">
          <h2>个人简介</h2>
          <p>{{ profile.bio }}</p>
        </div>

        <div class="section skills-section">
          <h2>技术栈</h2>
          <div class="skills-container">
            <el-tag v-for="skill in profile.skills" :key="skill.name" :type="getTagType(skill.level)" class="skill-tag">
              {{ skill.name }}
              <el-progress :percentage="skill.level * 20" :stroke-width="5" :show-text="false" class="skill-progress" />
            </el-tag>
          </div>
        </div>

        <div class="section experience-section">
          <h2>工作经历</h2>
          <el-timeline>
            <el-timeline-item v-for="(exp, index) in profile.experiences" :key="index" :timestamp="exp.period"
              placement="top">
              <el-card class="experience-card">
                <h3>{{ exp.company }} - {{ exp.title }}</h3>
                <p>{{ exp.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>

        <div class="section projects-section">
          <h2>项目经历</h2>
          <el-carousel :interval="5000" type="card" height="280px">
            <el-carousel-item v-for="project in profile.projects" :key="project.name">
              <el-card class="project-card">
                <h3>{{ project.name }}</h3>
                <div class="project-tags">
                  <el-tag v-for="tag in project.technologies" :key="tag" size="small" class="project-tag">{{ tag
                  }}</el-tag>
                </div>
                <p>{{ project.description }}</p>
                <div class="project-links">
                  <el-link v-if="project.github" :href="project.github" target="_blank" type="primary">
                    <i class="fab fa-github"></i> GitHub
                  </el-link>
                  <el-link v-if="project.demo" :href="project.demo" target="_blank" type="success">
                    <i class="fas fa-external-link-alt"></i> Demo
                  </el-link>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="section progress-section">
          <h2>建设进度</h2>
          <div class="progress-overview">
            <el-card class="progress-card">
              <template #header>
                <div class="progress-header">
                  <span>总体完成进度</span>
                  <el-progress type="dashboard" :percentage="profile.totalProgress"
                    :color="progressColors"></el-progress>
                </div>
              </template>
              <p class="progress-description">
                目前已完成基础功能开发，正在进行功能优化和新特性开发。
              </p>
            </el-card>
          </div>

          <div class="modules-progress">
            <el-timeline>
              <el-timeline-item v-for="(module, index) in profile.modules" :key="index"
                :type="module.status === 'completed' ? 'success' : module.status === 'in-progress' ? 'primary' : 'info'"
                :hollow="module.status === 'planned'" :timestamp="module.timestamp">
                <el-card class="module-card">
                  <h4>{{ module.name }}</h4>
                  <p>{{ module.description }}</p>
                  <div class="module-progress">
                    <el-progress :percentage="module.progress"
                      :status="module.status === 'completed' ? 'success' : undefined"></el-progress>
                  </div>
                  <div class="module-features">
                    <el-tag v-for="(feature, fidx) in module.features" :key="fidx" :type="feature.done ? 'success' : ''"
                      :effect="feature.done ? 'light' : 'plain'" size="small" class="feature-tag">
                      {{ feature.name }}
                    </el-tag>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>

        <div class="section contact-section">
          <h2>联系方式</h2>
          <div class="contact-items">
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <el-link :href="`mailto:${profile.email}`" type="primary">{{ profile.email }}</el-link>
            </div>
            <div class="contact-item" v-if="profile.github">
              <i class="fab fa-github"></i>
              <el-link :href="profile.github" target="_blank" type="info">GitHub</el-link>
            </div>
            <div class="contact-item" v-if="profile.linkedin">
              <i class="fab fa-linkedin"></i>
              <el-link :href="profile.linkedin" target="_blank" type="primary">LinkedIn</el-link>
            </div>
            <div class="contact-item" v-if="profile.twitter">
              <i class="fab fa-twitter"></i>
              <el-link :href="profile.twitter" target="_blank" type="primary">Twitter</el-link>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { getGitCommits } from '../../api/git';

export default defineComponent({
  name: 'AboutView',
  setup() {
    const loading = ref(false);
    const commits = ref([]);
    const progressColors = [
      { color: '#f56c6c', percentage: 20 },
      { color: '#e6a23c', percentage: 40 },
      { color: '#5cb87a', percentage: 60 },
      { color: '#1989fa', percentage: 80 },
      { color: '#6f7ad3', percentage: 100 }
    ];

    const profile = ref({
      name: '张三',
      avatar: '#',
      bio: '我是一名热爱技术的前端开发工程师,专注于Vue.js和React生态系统。' +
        '我喜欢创建用户友好、高性能的web应用程序,并且持续学习最新的前端技术。' +
        '在空闲时间,我喜欢写技术博客分享我的学习心得,同时也是开源社区的积极贡献者。',

      skills: [
        { name: 'Vue.js', level: 5 },
        { name: 'React', level: 4 },
        { name: 'JavaScript', level: 5 },
        { name: 'TypeScript', level: 4 },
        { name: 'HTML/CSS', level: 5 },
        { name: 'Node.js', level: 3 },
        { name: 'Python', level: 3 },
        { name: 'Java', level: 2 }
      ],

      experiences: [
        {
          company: 'ABC科技有限公司',
          title: '高级前端工程师',
          period: '2023 - 至今',
          description: '负责公司核心产品的前端架构设计和开发,带领前端团队实现产品迭代,优化前端性能和用户体验。'
        },
        {
          company: 'DEF互联网公司',
          title: '前端开发工程师',
          period: '2020 - 2023',
          description: '参与电子商务平台的开发维护,使用Vue.js构建响应式用户界面,实现购物车、支付等核心功能模块。'
        },
        {
          company: 'GHI创业公司',
          title: '初级前端工程师',
          period: '2018 - 2020',
          description: '参与小型团队开发SaaS应用,负责功能开发和bug修复,学习使用前端框架和工具链。'
        }
      ],

      projects: [
        {
          name: '个人博客系统',
          technologies: ['Vue 3', 'Element Plus', 'Spring Boot'],
          description: '一个功能完备的个人博客系统,包括文章管理、分类标签、用户评论等功能,支持Markdown编辑。',
          github: 'https://github.com/zhangsan/personal-blog',
          demo: 'https://blog-demo.zhangsan.com'
        },
        {
          name: '在线笔记应用',
          technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
          description: '支持实时协作编辑的在线笔记应用,具有笔记分享、标签组织、搜索等功能。',
          github: 'https://github.com/zhangsan/online-notes',
          demo: 'https://notes-app.zhangsan.com'
        },
        {
          name: '电影资讯平台',
          technologies: ['Vue 2', 'Vuex', 'Flask', 'MySQL'],
          description: '电影资讯和评分平台,提供最新电影信息、评分、评论和电影推荐功能。',
          github: 'https://github.com/zhangsan/movie-info',
          demo: 'https://movie-info.zhangsan.com'
        }
      ],

      modules: [],
      changelog: [],

      email: 'zhangsan@example.com',
      github: 'https://github.com/zhangsan',
      linkedin: 'https://linkedin.com/in/zhangsan',
      twitter: 'https://twitter.com/zhangsan'
    });

    // 计算总体完成进度
    const calculateProgress = (commits) => {
      const totalSteps = 10;
      return Math.min(Math.round((commits.length / totalSteps) * 100), 100);
    };

    // 获取Git提交信息
    const fetchGitCommits = async () => {
      loading.value = true;
      try {
        const response = await getGitCommits(10);
        commits.value = response.data;

        // 更新模块状态
        profile.value.modules = commits.value.map(commit => ({
          name: '代码提交',
          description: commit.message,
          timestamp: new Date(commit.date).toLocaleDateString('zh-CN'),
          status: 'completed',
          progress: 100,
          features: [
            { name: commit.shortId, done: true }
          ]
        })).slice(0, 5); // 只显示最近5次提交

        // 添加更新日志
        profile.value.changelog = commits.value.map(commit => ({
          date: new Date(commit.date).toLocaleDateString('zh-CN'),
          title: commit.shortId,
          content: commit.fullMessage || commit.message,
          type: 'success'
        })).slice(0, 5); // 只显示最近5次提交

        // 更新总体进度
        const progress = calculateProgress(commits.value);
        profile.value.totalProgress = progress;
      } catch (error) {
        console.error('Failed to fetch git commits:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchGitCommits();
    });

    // 根据技能级别获取标签类型
    const getTagType = (level) => {
      if (level >= 5) return 'success';
      if (level >= 4) return 'primary';
      if (level >= 3) return 'warning';
      if (level >= 2) return 'info';
      return 'danger';
    };

    return {
      profile,
      getTagType,
      progressColors,
      loading,
      commits
    };
  }
});
</script>

<style scoped>
.about-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.about-card {
  margin-bottom: 30px;
}

.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.about-title {
  margin: 10px 0 0 0;
  color: #333;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  margin-bottom: 20px;
}

.section h2 {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
  color: #333;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.skill-progress {
  margin-top: 5px;
  width: 100px;
}

.experience-card {
  margin-bottom: 10px;
}

.experience-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.1rem;
}

.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px;
}

.project-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
}

.project-links {
  margin-top: auto;
  display: flex;
  gap: 15px;
}

.contact-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-item i {
  width: 20px;
  text-align: center;
}

.progress-section {
  margin-top: 40px;
}

.progress-overview {
  margin-bottom: 30px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-description {
  color: #606266;
  text-align: center;
  margin-top: 20px;
}

.modules-progress {
  margin-bottom: 30px;
}

.module-card {
  margin-bottom: 10px;
}

.module-card h4 {
  margin: 0;
  margin-bottom: 10px;
  color: #303133;
}

.module-progress {
  margin: 15px 0;
}

.module-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.feature-tag {
  border-radius: 4px;
}

.changelog h3 {
  margin-bottom: 20px;
  color: #303133;
}

@media (max-width: 768px) {
  .about-view {
    padding: 10px;
  }

  .skills-container {
    justify-content: center;
  }

  .contact-items {
    flex-direction: column;
  }

  .progress-header {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
