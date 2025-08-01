import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, ExternalLink, Tag, Zap, Globe, Star } from 'lucide-react';
import './App.css';

// Define proper TypeScript interfaces
interface Link {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: string;
}

const App: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  });

  // Load links from localStorage on component mount
  useEffect(() => {
    try {
      const savedLinks = localStorage.getItem('linksVault');
      console.log('Loading from localStorage:', savedLinks);
      if (savedLinks && savedLinks !== 'undefined' && savedLinks !== '[]') {
        const parsedLinks = JSON.parse(savedLinks);
        console.log('Parsed links:', parsedLinks);
        setLinks(parsedLinks);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      localStorage.removeItem('linksVault');
      setIsLoaded(true);
    }
  }, []);

  // Save links to localStorage whenever links array changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        console.log('Saving to localStorage:', links);
        localStorage.setItem('linksVault', JSON.stringify(links));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [links, isLoaded]);

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
  const openEditModal = (link: Link) => {
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

    const newLink: Link = {
      id: editingLink ? editingLink.id : Date.now(),
      title: formData.title.trim(),
      url: formData.url.trim(),
      description: formData.description.trim(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: editingLink ? editingLink.createdAt : new Date().toISOString()
    };

    if (editingLink) {
      setLinks(prev => prev.map(link => 
        link.id === editingLink.id ? newLink : link
      ));
    } else {
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
    <div className="app-container">
      {/* Animated Background */}
      <div className="cyber-background">
        <div className="grid-overlay"></div>
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
      </div>

      {/* Header */}
      <header className="futuristic-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <Zap className="logo-icon" />
              <div className="logo-text">
                <h1 className="main-title">Codetribe taks 2</h1>
                <div className="subtitle">highligh the rectangle above try me!</div>
              </div>
            </div>
          </div>
          <button onClick={openAddModal} className="add-button">
            <Plus className="button-icon" />
            <span>Initialize Link</span>
            <div className="button-glow"></div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Scan neural pathways..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-glow"></div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="stats-panel">
          <div className="stat-item">
            <Globe className="stat-icon" />
            <span className="stat-value">{links.length}</span>
            <span className="stat-label">Neural Links</span>
          </div>
          {searchTerm && (
            <div className="stat-item">
              <Star className="stat-icon" />
              <span className="stat-value">{filteredLinks.length}</span>
              <span className="stat-label">Matches Found</span>
            </div>
          )}
        </div>

        {/* Links Grid */}
        {filteredLinks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-container">
              <ExternalLink className="empty-icon" />
              <div className="icon-pulse"></div>
            </div>
            <h3 className="empty-title">
              {searchTerm ? 'Neural Scan Complete' : 'Initialize Your Digital Nexus'}
            </h3>
            <p className="empty-description">
              {searchTerm 
                ? 'No matching neural patterns detected. Adjust scan parameters.' 
                : 'Begin by establishing your first quantum link connection to the digital matrix.'
              }
            </p>
            {!searchTerm && (
              <button onClick={openAddModal} className="primary-cta">
                <Plus className="button-icon" />
                <span>Create First Link</span>
                <div className="button-energy"></div>
              </button>
            )}
          </div>
        ) : (
          <div className="links-grid">
            {filteredLinks.map((link, index) => (
              <div key={link.id} className="link-card" style={{'--delay': `${index * 0.1}s`} as React.CSSProperties}>
                <div className="card-glow"></div>
                <div className="card-content">
                  <div className="card-header">
                    <h3 
                      className="link-title"
                      onClick={() => openLink(link.url)}
                    >
                      {link.title}
                    </h3>
                    <div className="card-actions">
                      <button
                        onClick={() => openEditModal(link)}
                        className="action-button edit-button"
                        title="Modify neural pattern"
                      >
                        <Edit2 className="action-icon" />
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="action-button delete-button"
                        title="Terminate connection"
                      >
                        <Trash2 className="action-icon" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="link-url" onClick={() => openLink(link.url)}>
                    <ExternalLink className="url-icon" />
                    <span className="url-text">{formatUrl(link.url)}</span>
                  </div>

                  {link.description && (
                    <p className="link-description">{link.description}</p>
                  )}

                  {link.tags.length > 0 && (
                    <div className="tags-container">
                      {link.tags.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="tag-chip">
                          <Tag className="tag-icon" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="card-border"></div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={closeModal}></div>
          <div className="modal-container">
            <div className="modal-glow"></div>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingLink ? 'Modify Neural Link' : 'Initialize New Connection'}
                </h2>
                <div className="modal-subtitle">Configure quantum parameters</div>
              </div>

              <div className="form-container">
                <div className="input-group">
                  <label htmlFor="title" className="input-label">
                    <span>Neural Identifier</span>
                    <span className="required-indicator">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="cyber-input"
                    placeholder="Enter neural designation"
                    required
                  />
                  <div className="input-glow"></div>
                </div>

                <div className="input-group">
                  <label htmlFor="url" className="input-label">
                    <span>Quantum Address</span>
                    <span className="required-indicator">*</span>
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="cyber-input"
                    placeholder="https://matrix.nexus"
                    required
                  />
                  <div className="input-glow"></div>
                </div>

                <div className="input-group">
                  <label htmlFor="description" className="input-label">
                    <span>Data Signature</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="cyber-textarea"
                    placeholder="Optional neural pathway description"
                  />
                  <div className="input-glow"></div>
                </div>

                <div className="input-group">
                  <label htmlFor="tags" className="input-label">
                    <span>Classification Tags</span>
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="cyber-input"
                    placeholder="neural, quantum, matrix (comma-separated)"
                  />
                  <div className="input-glow"></div>
                  <p className="input-hint">Separate multiple tags with commas</p>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={saveLink}
                    className="primary-button"
                  >
                    <span>{editingLink ? 'Update Matrix' : 'Establish Link'}</span>
                    <div className="button-energy"></div>
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="secondary-button"
                  >
                    <span>Abort Sequence</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;