// FILE: src/App.tsx
// Replace ALL the content in your App.tsx file with this code

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, ExternalLink, Tag } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  });

  // Load links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('linksVault');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  // Save links to localStorage whenever links array changes
  useEffect(() => {
    localStorage.setItem('linksVault', JSON.stringify(links));
  }, [links]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for adding new link
  const openAddModal = () => {
    setFormData({ title: '', url: '', description: '', tags: '' });
    setEditingLink(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing link
  const openEditModal = (link: any) => {
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
      tags: link.tags.join(', ')
    });
    setEditingLink(link);
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setFormData({ title: '', url: '', description: '', tags: '' });
  };

  // Save link (create or update)
  const saveLink = () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Title and URL are required!');
      return;
    }

    const newLink = {
      id: editingLink ? editingLink.id : Date.now(),
      title: formData.title.trim(),
      url: formData.url.trim(),
      description: formData.description.trim(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: editingLink ? editingLink.createdAt : new Date().toISOString()
    };

    if (editingLink) {
      // Update existing link
      setLinks(prev => prev.map(link => 
        link.id === editingLink.id ? newLink : link
      ));
    } else {
      // Add new link
      setLinks(prev => [newLink, ...prev]);
    }

    closeModal();
  };

  // Delete link
  const deleteLink = (id: number) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setLinks(prev => prev.filter(link => link.id !== id));
    }
  };

  // Filter links based on search term
  const filteredLinks = links.filter(link => {
    const searchLower = searchTerm.toLowerCase();
    return (
      link.title.toLowerCase().includes(searchLower) ||
      link.url.toLowerCase().includes(searchLower) ||
      link.description.toLowerCase().includes(searchLower) ||
      link.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  });

  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  // Open link in new tab
  const openLink = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Links Vault</h1>
              <p className="text-gray-600 mt-1">Organize and manage your favorite links</p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Link
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search links, tags, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>{links.length} total links</span>
          {searchTerm && (
            <span>{filteredLinks.length} matching results</span>
          )}
        </div>

        {/* Links Grid */}
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matching links found' : 'No links saved yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start building your links collection by adding your first link'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Link
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.map(link => (
              <div key={link.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 
                      className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex-1 mr-2"
                      onClick={() => openLink(link.url)}
                    >
                      {link.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(link)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit link"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span 
                      className="cursor-pointer hover:text-blue-600 transition-colors duration-200 truncate"
                      onClick={() => openLink(link.url)}
                    >
                      {formatUrl(link.url)}
                    </span>
                  </div>

                  {link.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {link.description}
                    </p>
                  )}

                  {link.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {link.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter link title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="work, development, tools (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={saveLink}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    {editingLink ? 'Update Link' : 'Save Link'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .max-w-6xl {
            max-width: 100%;
          }
          
          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .py-8 {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }

        @media (max-width: 480px) {
          .px-4 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .gap-6 {
            gap: 1rem;
          }
          
          .text-3xl {
            font-size: 1.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;