# Overview

PSL Mobil Enerji is a premium, fully responsive Flask website for a Turkish mobile generator services company. The site features a sophisticated dark theme with electric blue/cyan accents, glassmorphism effects, and electric animation overlays. Built with modern web technologies, it provides a professional platform showcasing vehicle-mounted mobile generator services across various sectors including events, construction, emergency situations, and agriculture.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Flask with Jinja2 templating engine
- **Styling**: Tailwind CSS via CDN with custom CSS for electric effects and glassmorphism
- **JavaScript**: Vanilla JS with AOS (Animate On Scroll) library for animations
- **Design Pattern**: Component-based template structure with base.html extending to page templates
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## Backend Architecture
- **Web Framework**: Python Flask with minimal configuration
- **Session Management**: Flask's built-in session handling with secret key
- **Error Handling**: Custom 404 page with branded styling
- **Environment Configuration**: Environment variables for SMTP and WhatsApp integration
- **Deployment**: WSGI-ready with ProxyFix middleware for reverse proxy support

## Template Structure
- **Base Template**: `base.html` with comprehensive SEO meta tags, Open Graph, and Twitter Card support
- **Partial Components**: Modular navbar, footer, and hero sections for reusability
- **Page Templates**: Dedicated templates for sectors, technology, gallery, and contact pages
- **Content Architecture**: Data-driven approach with template variables for dynamic content

## Performance Optimizations
- **Asset Loading**: Preconnected fonts, optimized resource loading
- **SEO**: Structured meta tags, canonical URLs, and schema markup ready
- **Animations**: Hardware-accelerated CSS animations with electric effects
- **Image Optimization**: Lazy loading and responsive image handling

# External Dependencies

## Core Dependencies
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Google Fonts**: Inter font family for typography
- **Feather Icons**: Lightweight SVG icon library
- **AOS Library**: Animate On Scroll for entrance animations

## Planned Integrations
- **SMTP Service**: Email functionality via Flask-Mail (configured for Gmail)
- **WhatsApp Integration**: Direct messaging capability with phone number configuration
- **Analytics**: Google Analytics integration ready
- **CDN**: CloudFlare integration prepared

## Data Storage
- **Development**: JSON file-based lead storage in `/tmp/leads.json`
- **Email Configuration**: SMTP settings via environment variables
- **Contact Management**: Form submission handling with validation

## SEO and Marketing
- **Robots.txt**: Search engine optimization with sitemap references
- **Humans.txt**: Development team and technology stack documentation
- **Meta Tags**: Comprehensive social media and search engine optimization
- **Structured Data**: Schema markup ready for local business implementation