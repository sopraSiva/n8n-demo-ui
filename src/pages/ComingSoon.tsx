import { Layout } from '../components/Layout';

export function ComingSoon() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h1>
          <p className="text-gray-600 text-lg">This page is under construction.</p>
        </div>
      </div>
    </Layout>
  );
}
