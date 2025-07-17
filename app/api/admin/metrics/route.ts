import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

interface User {
  id: string
  created_at: string
  email: string
}

interface Page {
  id: string
  created_at: string
  owner_id: string
}

interface Lead {
  id: string
  created_at: string
  page_id: string
}

interface AnalyticsEvent {
  id: string
  created_at: string
  landing_page_id: string
  event_type: string
}

export async function GET(request: NextRequest) {
  try {
    
    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'monthly'
    
    // Calculate date ranges
    const now = new Date()
    const currentPeriodStart = getPeriodStart(now, range)
    const previousPeriodStart = getPeriodStart(new Date(currentPeriodStart.getTime() - getPeriodDuration(range)), range)

    // Fetch user metrics
    const { data: users, error: usersError } = await supabaseServer
      .from('users')
      .select('id, created_at, email')

    if (usersError) {
      console.error('Users query error:', usersError)
      throw usersError
    }

    // Fetch page generation metrics
    const { data: pages, error: pagesError } = await supabaseServer
      .from('landing_pages')
      .select('id, created_at, owner_id')

    if (pagesError) {
      console.error('Pages query error:', pagesError)
      throw pagesError
    }

    // Fetch lead capture metrics
    const { data: leads, error: leadsError } = await supabaseServer
      .from('leads')
      .select('id, created_at, page_id')

    if (leadsError) {
      console.error('Leads query error:', leadsError)
      throw leadsError
    }

    // Fetch analytics events for page views
    const { data: analyticsEvents, error: analyticsError } = await supabaseServer
      .from('analytics_events')
      .select('id, created_at, landing_page_id, event_type')

    if (analyticsError) {
      console.error('Analytics query error:', analyticsError)
      throw analyticsError
    }

    // Calculate metrics
    const totalUsers = users?.length || 0
    // For now, consider all users as active since we don't track last_sign_in_at
    const activeUsers = totalUsers

    const totalPages = pages?.length || 0
    const pagesThisPeriod = pages?.filter((page: Page) => 
      new Date(page.created_at) >= currentPeriodStart
    ).length || 0

    const totalLeads = leads?.length || 0
    const leadsThisPeriod = leads?.filter((lead: Lead) => 
      new Date(lead.created_at) >= currentPeriodStart
    ).length || 0

    // Calculate page views from analytics events
    const pageViews = analyticsEvents?.filter((event: AnalyticsEvent) => 
      event.event_type === 'page_view'
    ).length || 0

    const pageViewsThisPeriod = analyticsEvents?.filter((event: AnalyticsEvent) => 
      event.event_type === 'page_view' && new Date(event.created_at) >= currentPeriodStart
    ).length || 0

    // Debug logging
    console.log('Metrics calculation:', {
      totalUsers,
      totalPages,
      totalLeads,
      pageViews,
      usersCount: users?.length,
      pagesCount: pages?.length,
      leadsCount: leads?.length,
      analyticsCount: analyticsEvents?.length
    })

    // Calculate growth rates
    const usersPreviousPeriod = users?.filter((user: User) => 
      new Date(user.created_at) >= previousPeriodStart && new Date(user.created_at) < currentPeriodStart
    ).length || 0

    const usersCurrentPeriod = users?.filter((user: User) => 
      new Date(user.created_at) >= currentPeriodStart
    ).length || 0

    const growthRate = usersPreviousPeriod > 0 
      ? ((usersCurrentPeriod - usersPreviousPeriod) / usersPreviousPeriod) * 100 
      : 0

    // Calculate conversion rate (leads per page view)
    const conversionRate = pageViews > 0 ? (totalLeads / pageViews) * 100 : 0

    // Get daily/weekly/monthly breakdowns
    const breakdown = getBreakdown(users, pages, leads, analyticsEvents, range)

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalPages,
      pagesThisMonth: pagesThisPeriod,
      totalLeads,
      leadsThisPeriod,
      pageViews,
      pageViewsThisPeriod,
      conversionRate,
      growthRate,
      breakdown
    })

  } catch (error) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

function getPeriodStart(date: Date, range: string): Date {
  const d = new Date(date)
  
  switch (range) {
    case 'daily':
      d.setHours(0, 0, 0, 0)
      return d
    case 'weekly':
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      d.setDate(diff)
      d.setHours(0, 0, 0, 0)
      return d
    case 'monthly':
      d.setDate(1)
      d.setHours(0, 0, 0, 0)
      return d
    case 'yearly':
      d.setMonth(0, 1)
      d.setHours(0, 0, 0, 0)
      return d
    default:
      return d
  }
}

function getPeriodDuration(range: string): number {
  switch (range) {
    case 'daily':
      return 24 * 60 * 60 * 1000
    case 'weekly':
      return 7 * 24 * 60 * 60 * 1000
    case 'monthly':
      return 30 * 24 * 60 * 60 * 1000
    case 'yearly':
      return 365 * 24 * 60 * 60 * 1000
    default:
      return 30 * 24 * 60 * 60 * 1000
  }
}

function getBreakdown(users: any[], pages: any[], leads: any[], analyticsEvents: any[], range: string) {
  const periods = range === 'daily' ? 7 : range === 'weekly' ? 12 : range === 'monthly' ? 12 : 5
  
  const breakdown = []
  for (let i = periods - 1; i >= 0; i--) {
    const periodStart = new Date()
    periodStart.setDate(periodStart.getDate() - (i * getPeriodDuration(range) / (24 * 60 * 60 * 1000)))
    const periodEnd = new Date(periodStart.getTime() + getPeriodDuration(range))
    
    const periodUsers = users?.filter(user => 
      new Date(user.created_at) >= periodStart && new Date(user.created_at) < periodEnd
    ).length || 0
    
    const periodPages = pages?.filter(page => 
      new Date(page.created_at) >= periodStart && new Date(page.created_at) < periodEnd
    ).length || 0
    
    const periodLeads = leads?.filter(lead => 
      new Date(lead.created_at) >= periodStart && new Date(lead.created_at) < periodEnd
    ).length || 0
    
    const periodPageViews = analyticsEvents?.filter((event: AnalyticsEvent) => 
      event.event_type === 'page_view' && 
      new Date(event.created_at) >= periodStart && 
      new Date(event.created_at) < periodEnd
    ).length || 0
    
    breakdown.push({
      period: periodStart.toISOString().split('T')[0],
      users: periodUsers,
      pages: periodPages,
      leads: periodLeads,
      pageViews: periodPageViews
    })
  }
  
  return breakdown
} 