# Foodo Admin Dashboard

The admin dashboard for Foodo, a restaurant management system. This dashboard allows restaurant administrators to manage restaurant listings, including adding, editing, and deleting restaurants.

## Features Implemented

### 1. Restaurant Management
- **Create Restaurants**: Add new restaurants with detailed information
  - Basic info (name, description)
  - Images (uploaded to Supabase storage)
  - Operating details (opening hours, estimated delivery time)
  - Categorization (tags, category)
  - Pricing (price range)
  - Location (distance)
  - Featured status

- **Edit Restaurants**: Modify existing restaurant information
- **Delete Restaurants**: Remove restaurants from the system
- **List View**: View all restaurants in a responsive grid layout

### 2. Image Management
- Integrated with Supabase Storage
- Secure image upload with proper policies
- Public access for viewing images
- Automatic URL generation for uploaded images

### 3. Database Integration
- Connected to Supabase backend
- Real-time updates
- Proper data schema with columns:
  - name
  - description
  - image
  - opening_hours
  - tags
  - category
  - price_range
  - distance
  - estimated_time
  - featured
  - rating
  - created_at
  - updated_at

### 4. UI/UX Features
- Responsive design
- Toast notifications for actions
- Loading states
- Error handling
- Form validation
- Image preview
- Tag selection
- Category filtering

## Technical Setup

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment
- Deployed on AWS Amplify
- Custom domain setup: admin.hifoodo.com
- Automatic builds from main branch
- Client-side routing configured

### Database Policies
- Public access enabled for development
- Ready for authentication implementation in the future

## Tech Stack
- React + TypeScript
- Vite for build tool
- Tailwind CSS for styling
- Supabase for backend and storage
- AWS Amplify for hosting

## Future Improvements
1. User Authentication
2. Role-based access control
3. Menu management
4. Order tracking
5. Analytics dashboard
6. Multi-language support

## Local Development
1. Clone the repository
```bash
git clone https://github.com/basiljilani/Foodo-admin.git
```

2. Install dependencies
```bash
cd Foodo-admin
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Add your Supabase credentials

4. Start development server
```bash
npm run dev
```

## Production Build
```bash
npm run build
```

## Related Projects
- Main App Repository: [Foodo](https://github.com/basiljilani/Foodo)
- Live Site: [hifoodo.com](https://hifoodo.com)
- Admin Dashboard: [admin.hifoodo.com](https://admin.hifoodo.com)
