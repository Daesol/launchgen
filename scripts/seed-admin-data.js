const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedData() {
  console.log('🌱 Seeding admin dashboard data...')

  try {
    // Create sample users
    const users = []
    for (let i = 1; i <= 25; i++) {
      const user = {
        email: `user${i}@example.com`,
        subscription_tier: i % 3 === 0 ? 'premium' : 'free'
      }
      users.push(user)
    }

    const { data: createdUsers, error: userError } = await supabase
      .from('users')
      .insert(users)
      .select()

    if (userError) {
      console.error('Error creating users:', userError)
      return
    }

    console.log(`✅ Created ${createdUsers.length} users`)

    // Create sample landing pages
    const pages = []
    for (let i = 1; i <= 50; i++) {
      const page = {
        slug: `sample-page-${i}`,
        title: `Sample Landing Page ${i}`,
        owner_id: createdUsers[i % createdUsers.length].id,
        config_json: {
          hero: {
            headline: `Sample Headline ${i}`,
            subheadline: `Sample subheadline for page ${i}`
          }
        }
      }
      pages.push(page)
    }

    const { data: createdPages, error: pageError } = await supabase
      .from('landing_pages')
      .insert(pages)
      .select()

    if (pageError) {
      console.error('Error creating pages:', pageError)
      return
    }

    console.log(`✅ Created ${createdPages.length} landing pages`)

    // Create sample leads
    const leads = []
    for (let i = 1; i <= 75; i++) {
      const lead = {
        page_id: createdPages[i % createdPages.length].id,
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        source: 'landing_page'
      }
      leads.push(lead)
    }

    const { data: createdLeads, error: leadError } = await supabase
      .from('leads')
      .insert(leads)
      .select()

    if (leadError) {
      console.error('Error creating leads:', leadError)
      return
    }

    console.log(`✅ Created ${createdLeads.length} leads`)

    // Create sample analytics events
    const events = []
    for (let i = 1; i <= 200; i++) {
      const event = {
        page_id: createdPages[i % createdPages.length].id,
        event_type: i % 3 === 0 ? 'form_submit' : 'page_view',
        metadata: {
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          referrer: 'https://google.com'
        }
      }
      events.push(event)
    }

    const { data: createdEvents, error: eventError } = await supabase
      .from('analytics_events')
      .insert(events)
      .select()

    if (eventError) {
      console.error('Error creating events:', eventError)
      return
    }

    console.log(`✅ Created ${createdEvents.length} analytics events`)

    console.log('🎉 Admin dashboard data seeded successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Users: ${createdUsers.length}`)
    console.log(`   - Pages: ${createdPages.length}`)
    console.log(`   - Leads: ${createdLeads.length}`)
    console.log(`   - Events: ${createdEvents.length}`)

  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

seedData() 