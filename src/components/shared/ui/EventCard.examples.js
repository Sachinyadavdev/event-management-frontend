// EventCard Component Usage Examples - SCALABLE VERSION

// Example 1: Home Page (Guest/Public View)
import EventCard from '../components/shared/ui/EventCard.jsx';
// or 
import { EventCard } from '../components/shared/ui';

const HomePage = () => {
  const handleRegister = (event) => {
    // Redirect to registration/login
    window.location.href = `/auth/register?eventId=${event.id}`;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredEvents.map(event => (
        <EventCard 
          key={event.id} 
          event={event}
          userType="guest"
          context="home"
          showSpeakers={true}
          showSponsors={true}
          showTags={true}
          onRegister={handleRegister}
        />
      ))}
    </div>
  );
};

// Example 2: Member Dashboard
const MemberDashboard = () => {
  const handleRegister = async (event) => {
    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        // Update local state or refetch data
        setEvents(prev => prev.map(e => 
          e.id === event.id 
            ? { ...e, registrationStatus: 'registered' }
            : e
        ));
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Upcoming Events</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event}
              userType="member"
              context="member"
              showSpeakers={true}
              showSponsors={false}
              showTags={true}
              onRegister={handleRegister}
            />
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Past Events</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {pastEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event}
              userType="member"
              context="member"
              showSpeakers={false}
              showSponsors={false}
              showTags={false}
              showActions={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

// Example 3: Admin Dashboard
const AdminDashboard = () => {
  const handleEdit = (event) => {
    navigate(`/admin/events/${event.id}/edit`);
  };

  const handleDelete = async (event) => {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await fetch(`/api/admin/events/${event.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        // Remove from local state
        setEvents(prev => prev.filter(e => e.id !== event.id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <Button onClick={() => navigate('/admin/events/create')}>
          Create New Event
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            userType="admin"
            context="admin"
            showSpeakers={true}
            showSponsors={true}
            showTags={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

// Example 4: API Integration with Pagination & Caching
const useEvents = (userType, context, page = 1, limit = 12) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cache, setCache] = useState(new Map());

  const fetchEvents = useCallback(async () => {
    const cacheKey = `${userType}-${context}-${page}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      setEvents(cache.get(cacheKey));
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        userType,
        context
      });

      const response = await fetch(`/api/events?${params}`, {
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      
      // Cache the results
      setCache(prev => new Map(prev).set(cacheKey, data.events));
      setEvents(data.events);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [userType, context, page, limit, cache]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, hasMore, refetch: fetchEvents };
};

// Example 5: Complete Events Page with Pagination
const EventsPage = ({ userType = 'guest' }) => {
  const [page, setPage] = useState(1);
  const { events, loading, hasMore, refetch } = useEvents(userType, 'listing', page);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleRegister = async (event) => {
    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        refetch(); // Refresh the data
        toast.success('Registration successful!');
      }
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  if (loading && page === 1) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            userType={userType}
            context="listing"
            onRegister={handleRegister}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button 
            onClick={handleLoadMore} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Load More Events'}
          </Button>
        </div>
      )}
    </div>
  );
};

// Example 6: Event Data Structure (Enhanced)
const enhancedEventStructure = {
  id: 1,
  title: "Advanced Cybersecurity Summit",
  hostedBy: "ISACA Silicon Valley Chapter",
  date: "2025-11-20",
  time: "9:00 AM - 6:00 PM",
  venue: "San Francisco Convention Center",
  location: "San Francisco, CA",
  mode: "In-Person", // Virtual, Hybrid
  priceType: "Paid", // Free, Paid
  price: "$299",
  cpScore: 8,
  registrationStatus: "available", // registered, full, closed
  capacity: 200,
  registeredCount: 87,
  description: "Join us for a comprehensive day...",
  bannerImage: "/images/events/summit-2025.jpg",
  speakers: [
    { name: "Dr. Sarah Chen", photo: "/images/speakers/sarah-chen.jpg" }
  ],
  sponsors: [
    { name: "CyberSec Corp", logo: "/images/sponsors/cybersec.png" }
  ],
  tags: ["cybersecurity", "summit", "networking"],
  // Admin specific fields
  createdBy: "admin@isaca.org",
  createdAt: "2025-09-15T10:00:00Z",
  updatedAt: "2025-10-01T14:30:00Z",
  status: "published", // draft, published, cancelled
  // Member specific fields  
  userRegistrationDate: "2025-10-05T09:15:00Z",
  paymentStatus: "completed",
  checkInStatus: "pending"
};

// Example 3: Full event data structure
const fullEvent = {
  id: 1,
  title: "Advanced Cybersecurity Summit",
  hostedBy: "ISACA Silicon Valley Chapter",
  date: "2025-11-20",
  time: "9:00 AM - 6:00 PM",
  venue: "San Francisco Convention Center",
  location: "San Francisco, CA",
  mode: "In-Person",
  priceType: "Paid",
  price: "$299",
  cpScore: 8,
  description: "Join us for a comprehensive day of cybersecurity insights, networking, and professional development. This summit brings together industry leaders, practitioners, and emerging professionals to explore the latest trends, challenges, and solutions in cybersecurity.",
  bannerImage: "/images/events/cybersecurity-summit-2025.jpg",
  speakers: [
    { 
      name: "Dr. Sarah Chen", 
      photo: "/images/speakers/sarah-chen.jpg" 
    },
    { 
      name: "Michael Rodriguez", 
      photo: "/images/speakers/michael-rodriguez.jpg" 
    },
    { 
      name: "Lisa Thompson", 
      photo: "/images/speakers/lisa-thompson.jpg" 
    }
  ],
  sponsors: [
    { 
      name: "CyberSec Corporation", 
      logo: "/images/sponsors/cybersec-corp.png" 
    },
    { 
      name: "SecureTech Solutions", 
      logo: "/images/sponsors/securetech.png" 
    },
    { 
      name: "InfoSec Pro", 
      logo: "/images/sponsors/infosec-pro.png" 
    }
  ],
  tags: ["cybersecurity", "summit", "networking", "professional-development", "industry-leaders"]
};

export default MyEventsPage;