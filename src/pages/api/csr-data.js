export default function handler(req, res) {
  res.status(200).json({
    timestamp: new Date().toISOString(),
    items: ['CSR 数据 1', 'CSR 数据 2', 'CSR 数据 3']
  });
}