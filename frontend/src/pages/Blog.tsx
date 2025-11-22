import React from 'react';
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import SEO from '../components/SEO';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How AI is Revolutionizing Property Inspections in 2025',
    excerpt: 'Discover how artificial intelligence is transforming the property inspection industry, saving time and improving accuracy for inspectors and property managers.',
    category: 'Industry Trends',
    date: 'Jan 15, 2025',
    readTime: '5 min read',
    image: '🤖',
    slug: 'ai-revolutionizing-property-inspections'
  },
  {
    id: '2',
    title: '10 Things Every Homeowner Should Document Before Moving Out',
    excerpt: 'Protect your security deposit with this comprehensive checklist of what to photograph and document before leaving your rental property.',
    category: 'Homeowner Tips',
    date: 'Jan 12, 2025',
    readTime: '7 min read',
    image: '🏠',
    slug: 'homeowner-move-out-checklist'
  },
  {
    id: '3',
    title: 'The Complete Guide to Property Inspection Reports',
    excerpt: 'Learn what makes a professional property inspection report, what to include, and how to present findings effectively to clients.',
    category: 'Best Practices',
    date: 'Jan 8, 2025',
    readTime: '10 min read',
    image: '📋',
    slug: 'complete-guide-inspection-reports'
  },
  {
    id: '4',
    title: 'How Property Managers Can Scale with Technology',
    excerpt: 'Managing hundreds of properties? Learn how modern technology can help you scale operations without hiring more staff.',
    category: 'Property Management',
    date: 'Jan 5, 2025',
    readTime: '6 min read',
    image: '🏘️',
    slug: 'property-managers-scale-with-technology'
  },
  {
    id: '5',
    title: 'Common Property Issues and How to Identify Them',
    excerpt: 'A visual guide to the most common property maintenance issues, from water damage to electrical problems, and how to spot them early.',
    category: 'Maintenance',
    date: 'Jan 3, 2025',
    readTime: '8 min read',
    image: '🔍',
    slug: 'common-property-issues-guide'
  },
  {
    id: '6',
    title: 'ROI Calculator: Is Professional Inspection Software Worth It?',
    excerpt: 'Break down the real costs and savings of using professional inspection software vs traditional methods. The numbers might surprise you.',
    category: 'Business',
    date: 'Dec 28, 2024',
    readTime: '5 min read',
    image: '💰',
    slug: 'inspection-software-roi-calculator'
  }
];

const categories = ['All', 'Industry Trends', 'Homeowner Tips', 'Best Practices', 'Property Management', 'Maintenance', 'Business'];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Property Inspection Blog & Resources"
        description="Expert tips, guides, and insights on property inspections, maintenance, and real estate. Learn from industry professionals."
        keywords="property inspection blog, real estate tips, maintenance guides, inspection best practices"
      />
      <MarketingNav />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, tips, and guides to help you master property inspections
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {selectedCategory === 'All' && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 mb-12 text-white">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Featured Post</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {blogPosts[0].title}
            </h2>
            <p className="text-blue-100 text-lg mb-6">
              {blogPosts[0].excerpt}
            </p>
            <div className="flex items-center space-x-6 text-sm text-blue-100 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{blogPosts[0].date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{blogPosts[0].readTime}</span>
              </div>
            </div>
            <Link
              to={`/blog/${blogPosts[0].slug}`}
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Read Article
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(selectedCategory === 'All' ? 1 : 0).map(post => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="text-6xl mb-4">{post.image}</div>
                
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {post.category}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Get the latest property inspection tips and industry insights delivered to your inbox
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm text-purple-100">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
      
      <MarketingFooter />
    </div>
  );
}
