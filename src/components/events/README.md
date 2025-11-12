# Events Management System Documentation

## Overview
The Events Management System is a comprehensive, modular solution for managing ISACA Silicon Valley chapter events. It provides a complete event lifecycle management from creation to completion, with support for speakers, agendas, registration, and more.

## Architecture

### Component Structure
```
components/
├── events/
│   ├── EventForm.jsx          # Multi-step event creation/editing form
│   ├── EventList.jsx          # Advanced event listing with filtering
│   ├── SpeakerForm.jsx        # Speaker management component
│   ├── AgendaForm.jsx         # Agenda builder component
│   └── index.js               # Component exports
└── admin/
    └── EventsManagement.jsx   # Main admin interface
```

## Core Components

### 1. EventForm Component
**Purpose**: Multi-step form for creating and editing events with comprehensive field coverage.

**Features**:
- 6-step wizard interface
- Complete event data management
- Real-time validation
- Support for all event types (in-person, virtual, hybrid)
- Pricing configuration (member/non-member rates)
- Educational credits (CP score) management
- Banner and media support

**Props**:
- `initialData`: Pre-populated event data (for editing)
- `onSubmit`: Callback for form submission
- `onCancel`: Callback for cancellation
- `isLoading`: Loading state
- `submitButtonText`: Custom submit button text

**Event Data Structure**:
```javascript
{
  // Basic Information
  title: string,
  shortDescription: string,
  descriptionHtml: string,
  category: 'workshop' | 'seminar' | 'webinar' | 'conference' | 'meeting' | 'networking' | 'training' | 'certification',
  
  // Date & Time
  startsAt: datetime,
  endsAt: datetime,
  timezone: string,
  registrationDeadline: datetime,
  
  // Location & Mode
  mode: 'in_person' | 'virtual' | 'hybrid',
  venue: {
    name: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    coordinates: { lat: number, lng: number }
  },
  virtualLinks: {
    zoom: string,
    googleMeet: string,
    teams: string,
    other: string,
    password: string,
    instructions: string
  },
  
  // Capacity & Registration
  capacity: number,
  seatsLeft: number,
  allowWaitlist: boolean,
  
  // Pricing
  isPaid: boolean,
  price: {
    member: number,
    nonMember: number
  },
  currency: string,
  
  // Content & Media
  bannerUrl: string,
  bannerOverlay: {
    color: string,
    opacity: number
  },
  
  // Educational Credits
  cpScore: number,
  cpType: 'technical' | 'business' | 'leadership',
  certificatesEnabled: boolean,
  
  // Host & Organization
  hostedBy: string,
  contactEmail: string,
  contactPhone: string,
  
  // Speakers & Agenda
  speakers: Array<Speaker>,
  agenda: Array<AgendaItem>,
  
  // Status & Visibility
  status: 'draft' | 'published' | 'cancelled' | 'completed',
  visibility: 'public' | 'members_only' | 'private',
  featured: boolean,
  
  // Additional Settings
  allowPhotography: boolean,
  codeOfConduct: boolean,
  accessibilityNotes: string,
  specialRequirements: string,
  tags: Array<string>
}
```

### 2. SpeakerForm Component
**Purpose**: Manage event speakers with complete profile information.

**Features**:
- Add/edit/remove speakers
- Speaker profile management
- Social media links
- Photo support
- Bio editing

**Speaker Data Structure**:
```javascript
{
  id: string,
  name: string,
  title: string,
  company: string,
  bio: string,
  photo: string,
  linkedin: string,
  twitter: string,
  website: string
}
```

### 3. AgendaForm Component
**Purpose**: Build detailed event agendas with speaker assignments.

**Features**:
- Time-based agenda items
- Speaker assignment
- Session type categorization
- Drag-and-drop reordering
- Duration calculation
- Session templates

**Agenda Item Structure**:
```javascript
{
  id: string,
  start: time,
  end: time,
  title: string,
  description: string,
  speakers: Array<string>, // Speaker IDs
  type: 'session' | 'break' | 'lunch' | 'networking' | 'keynote' | 'panel' | 'workshop' | 'qa'
}
```

### 4. EventList Component
**Purpose**: Display and manage events with advanced filtering and bulk operations.

**Features**:
- Grid/list view toggle
- Advanced search and filtering
- Bulk operations
- Status management
- Registration progress tracking
- Quick actions (edit, duplicate, delete)

**Props**:
- `events`: Array of event objects
- `loading`: Loading state
- `onEdit`: Edit event callback
- `onDelete`: Delete event callback
- `onDuplicate`: Duplicate event callback
- `onStatusChange`: Status change callback
- `showActions`: Show/hide action buttons
- `view`: Display view ('grid' | 'list')

### 5. EventsManagement Component
**Purpose**: Main admin interface combining all event management functionality.

**Features**:
- Tabbed interface (List, Create, Edit)
- Quick statistics dashboard
- Comprehensive event management
- Integration with all sub-components

## Integration with EventDetails

The Events Management system is designed to work seamlessly with the existing EventDetails component. All fields and data structures are compatible, ensuring:

1. **Data Consistency**: Events created in admin can be displayed in public views
2. **Feature Parity**: All EventDetails features are supported in the admin form
3. **Backward Compatibility**: Existing event data structures remain supported

### Compatible Fields:
- ✅ Basic info (title, description, category)
- ✅ Date/time settings with timezone support
- ✅ Location (venue) and virtual meeting links
- ✅ Pricing (member/non-member rates)
- ✅ Capacity and registration tracking
- ✅ Speaker management
- ✅ Agenda/schedule building
- ✅ Educational credits (CP scores)
- ✅ Banner images and branding
- ✅ Status and visibility controls

## Usage Examples

### Creating a New Event
```jsx
import { EventsManagement } from '../components/admin/EventsManagement';

// In your admin route
<EventsManagement />
```

### Using Individual Components
```jsx
import { EventForm, SpeakerForm, AgendaForm } from '../components/events';

// Custom event creation flow
const [eventData, setEventData] = useState({});
const [speakers, setSpeakers] = useState([]);
const [agenda, setAgenda] = useState([]);

<EventForm 
  initialData={eventData}
  onSubmit={handleEventSubmit}
  onCancel={handleCancel}
/>

<SpeakerForm 
  speakers={speakers}
  onUpdate={setSpeakers}
/>

<AgendaForm 
  agenda={agenda}
  speakers={speakers}
  onUpdate={setAgenda}
/>
```

### Event Filtering and Search
```jsx
import { EventList } from '../components/events';

<EventList
  events={events}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onDuplicate={handleDuplicate}
  showActions={true}
/>
```

## API Integration

Replace mock data with actual API calls:

### Event CRUD Operations
```javascript
// GET /api/events - List all events
// POST /api/events - Create new event
// PUT /api/events/:id - Update event
// DELETE /api/events/:id - Delete event
// GET /api/events/:id - Get event details

// Example API integration
const createEvent = async (eventData) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(eventData)
  });
  return response.json();
};
```

## Security Considerations

1. **Input Validation**: All form inputs are validated client-side and should be validated server-side
2. **Authorization**: Admin routes should require proper authentication
3. **File Uploads**: Banner images and speaker photos should be validated for type and size
4. **Data Sanitization**: HTML content should be sanitized to prevent XSS attacks

## Performance Optimizations

1. **Lazy Loading**: Large event lists can be paginated
2. **Image Optimization**: Banner images should be optimized and served via CDN
3. **Caching**: Event data can be cached for better performance
4. **Bundle Splitting**: Event management components can be code-split for admin routes

## Customization Guide

### Adding New Event Types
1. Update the `category` options in EventForm.jsx
2. Add corresponding icons in EventList.jsx
3. Update validation rules if needed

### Custom Fields
1. Add new fields to the event data structure
2. Update EventForm validation
3. Add corresponding UI elements
4. Update API integration

### Styling
All components use Tailwind CSS classes and support dark mode. Customize by:
1. Updating CSS classes
2. Adding custom Tailwind configurations
3. Implementing theme variables

## Testing

### Unit Tests
- Form validation logic
- Component rendering
- Event data transformations

### Integration Tests
- Complete event creation flow
- Speaker and agenda management
- Bulk operations

### E2E Tests
- Admin workflow from creation to publication
- Public event display
- Registration flow

## Deployment

1. **Development**: All components work in development mode with mock data
2. **Staging**: Replace mock data with staging API endpoints
3. **Production**: Ensure all environment variables are configured
4. **CDN**: Configure image hosting for banners and speaker photos

## Troubleshooting

### Common Issues
1. **Form Validation Errors**: Check required field validation in EventForm
2. **Speaker/Agenda Not Saving**: Ensure proper data flow between components
3. **Image Upload Issues**: Verify file size and type restrictions
4. **Date/Time Issues**: Check timezone handling and format

### Debug Mode
Enable debug logging by setting `DEBUG_EVENTS=true` in environment variables.

## Future Enhancements

1. **Calendar Integration**: Sync with Google Calendar, Outlook
2. **Email Automation**: Automated event reminders and confirmations
3. **Analytics Dashboard**: Event performance metrics
4. **Mobile App**: React Native companion app
5. **Social Sharing**: Enhanced social media integration
6. **Payment Integration**: Stripe/PayPal for paid events
7. **Live Streaming**: Integration with streaming platforms
8. **QR Code Generation**: Automated ticket generation

## Support

For technical support or feature requests:
- Create GitHub issues for bugs and feature requests
- Review component documentation and prop interfaces
- Check browser console for detailed error messages
- Ensure all dependencies are properly installed