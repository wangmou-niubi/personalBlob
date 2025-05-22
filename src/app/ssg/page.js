
 function SSGPage({ ssgData, isrData, csrData }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>SSG + ISR 技术对比</h1>

      <section style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ddd' }}>
        <h2>SSG + ISR 数据</h2>
        <p>更新时间: {isrData.timestamp}</p>
        <ul>
          {isrData.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ddd' }}>
        <h2>客户端渲染 (CSR) 数据</h2>
        <p>更新时间: {csrData.timestamp}</p>
        <ul>
          {csrData.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <p style={{ color: '#666', marginTop: '2rem' }}>
        注意：SSG + ISR 部分在页面加载时已经包含数据，而 CSR 部分需要客户端 JavaScript 执行后才能获取数据。
      </p>
    </div>
  );
}

// 使用新的数据获取方式
async function getData() {
  // 模拟数据获取
  const ssgData = {
    timestamp: new Date().toISOString(),
    items: ['SSG 数据 1', 'SSG 数据 2', 'SSG 数据 3']
  };

  const isrData = {
    timestamp: new Date().toISOString(),
    items: ['ISR 数据 1', 'ISR 数据 2', 'ISR 数据 3']
  };

  return {
    ssgData,
    isrData,
    csrData: { timestamp: '加载中...', items: [] }
  };
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}

export const revalidate = 10; // ISR: 每10秒重新生成页面

export default async function Page() {
  const { ssgData, isrData, csrData } = await getData();
  return <SSGPage ssgData={ssgData} isrData={isrData} csrData={csrData} />;
}

// 客户端数据获取
if (typeof window !== 'undefined') {
  fetch('/api/csr-data')
    .then(res => res.json())
    .then(data => {
      const csrSection = document.querySelector('#csr-section');
      if (csrSection) {
        csrSection.innerHTML = `
          <h2>客户端渲染 (CSR) 数据</h2>
          <p>更新时间: ${data.timestamp}</p>
          <ul>
            ${data.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      }
    });
}