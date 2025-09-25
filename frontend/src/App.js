import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import shadcn components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ScrollArea } from './components/ui/scroll-area';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { 
  CalendarDays, 
  Users, 
  AlertTriangle, 
  ClipboardList, 
  Plus, 
  Settings,
  Home,
  BookOpen,
  Target,
  Shield,
  ArrowLeft,
  Camera,
  Upload,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-black border-b border-orange-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_emergency-drill-2/artifacts/rcx6bwsz_EXRSIM_Small.tiff" 
              alt="EXRSIM Logo" 
              className="h-8 w-auto max-w-32 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
            <span className="text-orange-500 text-2xl font-bold tracking-wider hidden">
              EXRSIM
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/builder" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Exercise Builder
            </Link>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </nav>
  );
};

// Sidebar Component
const Sidebar = ({ onMenuSelect, activeMenu }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'exercises', label: 'Exercises', icon: Target },
    { id: 'msel', label: 'MSEL', icon: ClipboardList },
    { id: 'hira', label: 'HIRA', icon: AlertTriangle },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'builder', label: 'Exercise Builder', icon: BookOpen }
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-orange-500/20 h-screen">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h3 className="text-orange-500 font-semibold mb-4 text-sm uppercase tracking-wider">
            Emergency Management
          </h3>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuSelect(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeMenu === item.id
                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                    : 'text-gray-300 hover:text-orange-500 hover:bg-gray-800'
                }`}
                data-testid={`sidebar-${item.id}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API}/exercises`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      planned: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      active: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Exercise Dashboard</h1>
          <p className="text-gray-400">Manage your emergency training exercises</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          New Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : exercises.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Exercises Yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Create your first emergency training exercise to get started with EXRSIM.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exercise
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          exercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors cursor-pointer"
              data-testid={`exercise-card-${exercise.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">{exercise.name}</CardTitle>
                    <Badge className={getStatusColor(exercise.status)}>
                      {exercise.status.charAt(0).toUpperCase() + exercise.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-400 mt-2">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Start: {formatDate(exercise.start_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>End: {formatDate(exercise.end_date)}</span>
                  </div>
                  {exercise.goals.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>{exercise.goals.length} Goal{exercise.goals.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Participant Management Components
const ParticipantForm = ({ onBack, onSave, editingParticipant = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    address: '',
    city: '',
    provinceState: '',
    country: 'Canada',
    homePhone: '',
    cellPhone: '',
    email: '',
    involvedInExercise: false,
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const positions = [
    'Incident Commander',
    'Operations Chief',
    'Planning Chief',
    'Logistics Chief',
    'Finance/Administration Chief',
    'Safety Officer',
    'Liaison Officer',
    'Public Information Officer',
    'Observer',
    'Evaluator',
    'Emergency Operations Center Manager',
    'Communications Coordinator',
    'Resource Coordinator',
    'Situation Analyst'
  ];

  const countries = [
    'Canada',
    'USA',
    'United Kingdom',
    '---',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Argentina',
    'Australia',
    'Austria',
    'Bangladesh',
    'Belgium',
    'Brazil',
    'Bulgaria',
    'Chile',
    'China',
    'Colombia',
    'Czech Republic',
    'Denmark',
    'Egypt',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Japan',
    'Jordan',
    'Kenya',
    'South Korea',
    'Mexico',
    'Netherlands',
    'New Zealand',
    'Norway',
    'Pakistan',
    'Philippines',
    'Poland',
    'Portugal',
    'Romania',
    'Russia',
    'Saudi Arabia',
    'South Africa',
    'Spain',
    'Sweden',
    'Switzerland',
    'Thailand',
    'Turkey',
    'Ukraine',
    'Vietnam'
  ];

  useEffect(() => {
    if (editingParticipant) {
      setFormData({
        firstName: editingParticipant.firstName || '',
        lastName: editingParticipant.lastName || '',
        position: editingParticipant.position || '',
        address: editingParticipant.address || '',
        city: editingParticipant.city || '',
        provinceState: editingParticipant.provinceState || '',
        country: editingParticipant.country || 'Canada',
        homePhone: editingParticipant.homePhone || '',
        cellPhone: editingParticipant.cellPhone || '',
        email: editingParticipant.email || '',
        involvedInExercise: editingParticipant.involvedInExercise || false,
        profileImage: editingParticipant.profileImage || null
      });
      if (editingParticipant.profileImage) {
        setImagePreview(editingParticipant.profileImage);
      }
    }
  }, [editingParticipant]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, profileImage: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, profileImage: imageData }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const participantData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.cellPhone || formData.homePhone,
        address: `${formData.address}, ${formData.city}, ${formData.provinceState}`,
        organization: '', // Will be handled later
        role: formData.position.toLowerCase().replace(/\s+/g, '_'),
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        city: formData.city,
        provinceState: formData.provinceState,
        country: formData.country,
        homePhone: formData.homePhone,
        cellPhone: formData.cellPhone,
        involvedInExercise: formData.involvedInExercise,
        profileImage: formData.profileImage
      };

      if (editingParticipant) {
        const response = await axios.put(`${API}/participants/${editingParticipant.id}`, participantData);
        onSave(response.data);
      } else {
        const response = await axios.post(`${API}/participants`, participantData);
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error saving participant:', error);
      alert('Error saving participant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Participants
        </Button>
        <h1 className="text-3xl font-bold text-orange-500 mb-2">
          {editingParticipant ? 'Edit Participant' : 'Add New Participant'}
        </h1>
        <p className="text-gray-400">Enter participant information for emergency exercise training</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Profile Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload').click()}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-sm text-gray-400">Upload from file or capture with camera</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="position" className="text-gray-300">Position *</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {positions.map((position) => (
                    <SelectItem key={position} value={position} className="text-white focus:bg-gray-600">
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homePhone" className="text-gray-300">Home Phone</Label>
                <Input
                  id="homePhone"
                  type="tel"
                  value={formData.homePhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, homePhone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="cellPhone" className="text-gray-300">Cell Phone</Label>
                <Input
                  id="cellPhone"
                  type="tel"
                  value={formData.cellPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, cellPhone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-gray-300">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-gray-300">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="provinceState" className="text-gray-300">Province/State</Label>
                <Input
                  id="provinceState"
                  value={formData.provinceState}
                  onChange={(e) => setFormData(prev => ({ ...prev, provinceState: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="AB, ON, CA, TX"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country" className="text-gray-300">Country</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                  {countries.map((country) => (
                    <SelectItem 
                      key={country} 
                      value={country} 
                      className="text-white focus:bg-gray-600"
                      disabled={country === '---'}
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="involvedInExercise"
                checked={formData.involvedInExercise}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, involvedInExercise: checked }))}
              />
              <Label htmlFor="involvedInExercise" className="text-gray-300">
                Participant is involved in the current exercise
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingParticipant ? 'Update Participant' : 'Add Participant')}
          </Button>
        </div>
      </form>
    </div>
  );
};

const ParticipantsList = ({ onAddNew, onEdit }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'participating'

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${API}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(participant => {
    if (filter === 'participating') {
      return participant.involvedInExercise === true;
    }
    return true; // 'all' - show all participants
  });

  const deleteParticipant = async (participantId) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      try {
        await axios.delete(`${API}/participants/${participantId}`);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
      } catch (error) {
        console.error('Error deleting participant:', error);
        alert('Error deleting participant. Please try again.');
      }
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Exercise Participants</h1>
          <p className="text-gray-400">Manage emergency exercise team members</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="participant-filter" className="text-gray-300 text-sm">
              Filter:
            </Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger 
                id="participant-filter"
                className="w-40 bg-gray-700 border-gray-600 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white focus:bg-gray-600">
                  Show All ({participants.length})
                </SelectItem>
                <SelectItem value="participating" className="text-white focus:bg-gray-600">
                  Show Participating ({participants.filter(p => p.involvedInExercise).length})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={onAddNew}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            data-testid="add-participant-btn"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
      </div>

      {/* Filter Status Indicator */}
      {!loading && participants.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>
              Showing {filteredParticipants.length} of {participants.length} participants
            </span>
            {filter === 'participating' && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active Exercise Filter
              </Badge>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/4"></div>
                    <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredParticipants.length === 0 && filter === 'participating' ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Active Participants</h3>
            <p className="text-gray-500 text-center mb-4">
              No participants are currently marked as involved in the exercise.
            </p>
            <Button 
              onClick={() => setFilter('all')}
              variant="outline"
              className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
            >
              Show All Participants
            </Button>
          </CardContent>
        </Card>
      ) : filteredParticipants.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Participants Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Add emergency team members to start building your exercise roster.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Participant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredParticipants.map((participant) => (
            <Card 
              key={participant.id} 
              className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={participant.profileImage} alt={participant.name} />
                    <AvatarFallback className="bg-orange-500 text-black text-lg font-semibold">
                      {getInitials(participant.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {participant.name}
                      </h3>
                      {participant.involvedInExercise && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Active Exercise
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Target className="h-4 w-4 text-orange-500" />
                        <span>{participant.position || participant.role || 'No position'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Mail className="h-4 w-4 text-orange-500" />
                        <span className="truncate">{participant.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Phone className="h-4 w-4 text-orange-500" />
                        <span>{participant.cellPhone || participant.phone || 'No phone'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="truncate">
                          {participant.city && participant.country ? 
                            `${participant.city}, ${participant.country}` : 
                            participant.address || 'No address'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(participant)}
                      className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteParticipant(participant.id)}
                      className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ParticipantsView = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingParticipant, setEditingParticipant] = useState(null);

  const handleAddNew = () => {
    setEditingParticipant(null);
    setView('add');
  };

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingParticipant(null);
  };

  const handleSave = () => {
    setView('list');
    setEditingParticipant(null);
    // The list will automatically refresh via useEffect
  };

  if (view === 'add' || view === 'edit') {
    return (
      <ParticipantForm
        onBack={handleBack}
        onSave={handleSave}
        editingParticipant={editingParticipant}
      />
    );
  }

  return (
    <ParticipantsList
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
};

// Placeholder components for other views
const ExerciseView = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">Exercises</h1>
    <p className="text-gray-400">Exercise management interface coming soon...</p>
  </div>
);

const MSELView = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">MSEL</h1>
    <p className="text-gray-400">Master Sequence Event List interface coming soon...</p>
  </div>
);

const HIRAView = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">HIRA</h1>
    <p className="text-gray-400">Hazard Identification Risk Assessment interface coming soon...</p>
  </div>
);

const ExerciseBuilder = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">Exercise Builder</h1>
    <p className="text-gray-400">Step-by-step exercise builder coming soon...</p>
  </div>
);

// Main App Component
function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'exercises':
        return <ExerciseView />;
      case 'msel':
        return <MSELView />;
      case 'hira':
        return <HIRAView />;
      case 'participants':
        return <ParticipantsView />;
      case 'builder':
        return <ExerciseBuilder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <Navigation />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar onMenuSelect={setActiveMenu} activeMenu={activeMenu} />
            <main className="flex-1 overflow-auto">
              {renderContent()}
            </main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;