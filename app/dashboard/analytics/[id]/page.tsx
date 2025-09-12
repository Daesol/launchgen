import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const PageAnalytics = dynamic(() => import('../../../../components/pages/dashboard/PageAnalytics'), { ssr: false });

interface PageProps {
  params: { id: string };
}

export default async function PageAnalyticsView({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch the landing page by id
  const { data: page, error: pageError } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', params.id)
    .eq('owner_id', session.user.id)
    .single();

  if (pageError || !page) {
    return (
      <div className="text-center text-red-500 mt-16">
        <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-sm text-neutral-400 mb-4">Page ID: {params.id}</p>
        <p className="text-sm">The page you're looking for doesn't exist or you don't have permission to access it.</p>
        <a href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to Dashboard
        </a>
      </div>
    );
  }

  // Fetch leads for this page
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('page_id', params.id)
    .order('created_at', { ascending: false });

  // Fetch analytics events for this page
  const { data: analyticsEvents, error: analyticsError } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('landing_page_id', params.id)
    .order('created_at', { ascending: false });

  // Calculate metrics
  const views = analyticsEvents?.filter(e => e.event_type === 'page_view').length || 0;
  const submits = analyticsEvents?.filter(e => e.event_type === 'form_submit').length || 0;
  const conversionRate = views > 0 ? (submits / views) * 100 : 0;

  // Get recent events (last 30 days) for time-based analysis
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentEvents = analyticsEvents?.filter(e => 
    new Date(e.created_at) >= thirtyDaysAgo
  ) || [];

  // Group events by date for chart data
  const eventsByDate = recentEvents.reduce((acc: any, event) => {
    const date = new Date(event.created_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { views: 0, submits: 0 };
    }
    if (event.event_type === 'page_view') acc[date].views++;
    if (event.event_type === 'form_submit') acc[date].submits++;
    return acc;
  }, {});

  const chartData = Object.entries(eventsByDate).map(([date, data]: [string, any]) => ({
    date,
    views: data.views,
    submits: data.submits,
    conversion: data.views > 0 ? (data.submits / data.views) * 100 : 0
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get traffic sources
  const trafficSources = analyticsEvents?.reduce((acc: any, event) => {
    const source = event.utm_source || event.referrer || 'Direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {}) || {};

  const analyticsData = {
    page,
    leads: leads || [],
    views,
    submits,
    conversionRate,
    chartData,
    trafficSources,
    recentEvents: recentEvents.slice(0, 50) // Last 50 events
  };

  return <PageAnalytics data={analyticsData} />;
}
