import Link from 'next/link';
import styles from './about.module.css';



// 添加元数据配置
const metadata = {
  title: '关于我 | 前端开发工程师',
  description: '专注于前端开发的技术博主，擅长 React、Next.js、TypeScript 等技术栈',
  keywords: ['前端开发', 'React', 'Next.js', 'JavaScript', '技术博客'],
  openGraph: {
    title: '关于我 | 前端开发工程师',
    description: '专注于前端开发的技术博主，分享前端开发经验和技术心得',
    images: ['/img/profile.jpg'],
    type: 'profile',
    profile: {
      firstName: '你的名字',
      username: '你的用户名',
    },
  },
};

// 删除 getData 函数，直接在组件中使用数据
const aboutData = {
  profile: "热爱技术，专注于前端开发的工程师...",
  skills: ["React", "Next.js", "TypeScript", "Node.js"],
  experiences: [
    {
      company: "XX科技有限公司",
      period: "2020-至今",
      description: "负责公司核心产品的前端开发..."
    }
  ],
  projects: [
    {
      name: "个人博客系统",
      description: "基于Next.js开发的个人博客系统",
      link: "https://github.com/yourusername/blog"
    }
  ],
  email: "your.email@example.com",
  github: "https://github.com/yourusername"
};

export default async function About() {
  // 直接使用 aboutData 而不是从 API 获取
  const data = aboutData;
  
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h1 itemProp="name">关于我</h1>
        <p className={styles.subtitle} itemProp="jobTitle">
          前端开发工程师 / 技术博主
        </p>
      </header>

      <section className={styles.profile} itemScope itemType="http://schema.org/Person">
        <div className={styles.info}>
          <h2>个人简介</h2>
          <p itemProp="description">{data.profile}</p>
          <ul className={styles.skills} itemProp="knowsAbout">
            {data.skills?.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.experience}>
        <h2>工作经历</h2>
        {data.experiences?.map((exp, index) => (
          <div key={index} className={styles.expItem} itemScope itemType="http://schema.org/WorkExperience">
            <h3 itemProp="name">{exp.company}</h3>
            <p className={styles.period} itemProp="dateRange">{exp.period}</p>
            <p itemProp="description">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className={styles.projects}>
        <h2>开源项目</h2>
        {data.projects?.map((project, index) => (
          <div key={index} className={styles.projectItem}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              查看项目
            </a>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.backHome}>
          返回首页
        </Link>
        <div className={styles.contact}>
          <a href={`mailto:${data.email}`}>邮箱联系</a>
          <a href={data.github} target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </div>
      </footer>
    </article>
  );
}