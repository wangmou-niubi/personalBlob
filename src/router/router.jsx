import { useRoutes } from 'react-router-dom';
import Home from '@/view/Home/index.jsx';
import Blob from "@/view/blob/index.jsx";

/**
 * 公共路由
 */
export const constantRoutes = [
    {
        path: '/',
        id: 'Home',
        element: <Home />,
    },
    {
        path: '/Blob',
        id: 'Blob',
        element: <Blob />,
    }
    ]

// 创建一个可以被 React 应用程序使用的路由实例
const router = () => {
    const routes = useRoutes(constantRoutes);
    return routes;
};

export default router;
