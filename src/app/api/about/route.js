export async function GET() {
  // 这里可以连接数据库获取实际数据
  return Response.json({
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
  });
}