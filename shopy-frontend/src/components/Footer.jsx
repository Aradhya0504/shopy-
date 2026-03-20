import { Link } from 'react-router-dom'
import {
  FiShoppingBag,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
} from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold text-white">Shopy</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop shop for everything you need. Quality products, great prices, fast delivery.
            </p>
            <div className="flex items-center gap-3">
              
               <a href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiGithub size={20} />
              </a>
              
               <a href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home',     path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'Cart',     path: '/cart' },
                { label: 'Orders',   path: '/orders' },
                { label: 'Profile',  path: '/profile' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {[
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Clothing',
                'Books',
                'Sports',
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={16} className="text-blue-500 shrink-0" />
                support@shopy.com
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone size={16} className="text-blue-500 shrink-0" />
                +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMapPin size={16} className="text-blue-500 shrink-0" />
                123 Shop Street, Mumbai, India
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white text-sm font-medium mb-2">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 text-sm text-white px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Shopy. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiShoppingBag size={16} className="text-blue-500" />
            Built with React, Node.js & MongoDB
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
