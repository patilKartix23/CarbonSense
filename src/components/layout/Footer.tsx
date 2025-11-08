import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Github, Twitter, Mail } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-climate-blue-500 to-climate-green-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CarbonSense</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              An ML-powered comprehensive climate monitoring and carbon footprint tracking application with AI-powered insights and social features.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/carbon" className="text-gray-400 hover:text-white">
                  Carbon Tracker
                </Link>
              </li>
              <li>
                <Link to="/ccus" className="text-gray-400 hover:text-white">
                  CCUS Hub
                </Link>
              </li>
              <li>
                <Link to="/eco-shopping" className="text-gray-400 hover:text-white">
                  EcoMarket
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-400 hover:text-white">
                  Climate Map
                </Link>
              </li>
              <li>
                <Link to="/social" className="text-gray-400 hover:text-white">
                  Social Feed
                </Link>
              </li>
              <li>
                <Link to="/advocacy" className="text-gray-400 hover:text-white">
                  Advocacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="https://www.ipcc.ch/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  IPCC Climate Reports
                </a>
              </li>
              <li>
                <a href="https://climate.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  NASA Climate Data
                </a>
              </li>
              <li>
                <Link to="/advocacy" className="text-gray-400 hover:text-white">
                  Climate Advocacy Guide
                </Link>
              </li>
              <li>
                <a href="https://unfccc.int/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  UN Climate Action
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex items-center justify-center text-gray-400">
            {/* Made In Bharat Tag */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 via-white to-green-600 p-0.5 rounded-lg">
              <div className="bg-gray-900 px-3 py-1 rounded-md flex items-center space-x-2">
                <span className="text-orange-400 font-semibold">IND</span>
                <span className="text-white font-medium text-sm">Made In Bharat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
