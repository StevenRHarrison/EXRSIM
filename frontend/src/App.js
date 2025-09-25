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
import { Textarea } from './components/ui/textarea';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
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
  Trash2,
  Save,
  Info
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-black border-b border-orange-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center group">
            {/* Custom EXRSIM Logo Design */}
            <div className="flex items-center space-x-2 group-hover:scale-105 transition-transform">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-lg">EX</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-orange-500 text-xl font-bold tracking-wider leading-none">
                  EXRSIM
                </span>
                <span className="text-orange-400/60 text-xs font-medium tracking-widest">
                  EMERGENCY TRAINING
                </span>
              </div>
            </div>
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

// HIRA Management Components
const HIRAForm = ({ onBack, onSave, editingEntry = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    notes: '',
    disaster_type: '',
    latitude: 0,
    longitude: 0,
    frequency: 1,
    fatalities: 0,
    injuries: 0,
    evacuation: 0,
    property_damage: 0,
    critical_infrastructure: 0,
    environmental_damage: 0,
    business_financial_impact: 0,
    psychosocial_impact: 0,
    change_in_frequency: [false, false, false, false],
    change_in_vulnerability: [false, false, false],
    hazard_image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const disasterTypes = [
    // Manmade disasters
    'Terrorism', 'Cyber Attack', 'Industrial Accident', 'Chemical Spill', 'Nuclear Accident',
    'Transportation Accident', 'Building Collapse', 'Fire (Structural)', 'Explosion',
    'Hazardous Material Release', 'Infrastructure Failure', 'Mass Shooting', 'Civil Unrest',
    'Supply Chain Disruption', 'Economic Crisis', 'Pandemic (Human-caused)',
    // Natural disasters  
    'Earthquake', 'Flood', 'Hurricane/Typhoon', 'Tornado', 'Wildfire', 'Drought',
    'Blizzard/Ice Storm', 'Heatwave', 'Thunderstorm/Hail', 'Landslide', 'Tsunami',
    'Volcanic Eruption', 'Pandemic (Natural)', 'Disease Outbreak', 'Insect Infestation',
    'Extreme Cold', 'Coastal Erosion', 'Sinkhole'
  ];

  const frequencyLevels = [
    { level: 1, label: 'Rare', description: 'Less than a 1% chance of occurrence in any year. Hazards with return periods >100 years.' },
    { level: 2, label: 'Very Unlikely', description: 'Between a 1 - 2% chance of occurrence in any year. Occurs every 50 – 100 years and includes hazards that have not occurred but are reported to be more likely to occur in the near future.' },
    { level: 3, label: 'Unlikely', description: 'Between a 2 – 10% chance of occurrence in any year. Occurs every 20 – 50 years.' },
    { level: 4, label: 'Probable', description: 'Between a 10 – 50% chance of occurrence in any year. Occurs every 5 – 20 years.' },
    { level: 5, label: 'Likely', description: 'Between a 50 – 100% chance of occurrence in any year. Occurs > 5 years.' },
    { level: 6, label: 'Almost Certain', description: '100% chance of occurrence in any year. The hazard occurs annually.' }
  ];

  const fatalityLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in fatalities within the community.' },
    { level: 1, label: 'Minor', description: 'Could result in fewer than five fatalities within the community.' },
    { level: 2, label: 'Moderate', description: 'Could result in 5 – 10 fatalities within the community.' },
    { level: 3, label: 'Severe', description: 'Could result in 10 – 50 fatalities within the community.' },
    { level: 4, label: 'Catastrophic', description: 'Could result in +50 fatalities within the community.' }
  ];

  const injuryLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in injuries within the community.' },
    { level: 1, label: 'Minor', description: 'Could injure fewer than 25 people within the community.' },
    { level: 2, label: 'Moderate', description: 'Could injure 25 – 100 people within the community.' },
    { level: 3, label: 'Severe', description: 'Could injure +100 people within the community.' }
  ];

  const evacuationLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in an evacuation shelter-in-place orders, or people stranded.' },
    { level: 1, label: 'Minor', description: 'Could result in fewer than 100 people being evacuated, sheltered-in-place or stranded.' },
    { level: 2, label: 'Moderate', description: 'Could result in 100 - 500 people being evacuated, sheltered-in-place or stranded.' },
    { level: 3, label: 'Severe', description: 'Could result in more than 500 people being evacuated, sheltered-in-place or stranded.' }
  ];

  const propertyLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in property damage within the community.' },
    { level: 1, label: 'Minor', description: 'Could cause minor and mostly cosmetic damage.' },
    { level: 2, label: 'Moderate', description: 'Localized severe damage (a few buildings destroyed).' },
    { level: 3, label: 'Severe', description: 'Widespread severe damage (many buildings destroyed).' }
  ];

  const infrastructureLevels = [
    { level: 0, label: 'None', description: 'Not likely to disrupt critical infrastructure services.' },
    { level: 1, label: 'Minor', description: 'Could disrupt 1 critical infrastructure service.' },
    { level: 2, label: 'Moderate', description: 'Could disrupt 2 – 3 critical infrastructure services.' },
    { level: 3, label: 'Severe', description: 'Could disrupt more than 3 critical infrastructure services.' }
  ];

  const environmentalLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in environmental damage.' },
    { level: 1, label: 'Minor', description: 'Could cause localized and reversible damage. Quick clean up possible.' },
    { level: 2, label: 'Moderate', description: 'Could cause major but reversible damage. Full clean up difficult.' },
    { level: 3, label: 'Severe', description: 'Could cause severe and irreversible environmental damage. Full clean up not possible.' }
  ];

  const businessLevels = [
    { level: 0, label: 'None', description: 'Not likely to disrupt business / financial activities.' },
    { level: 1, label: 'Moderate', description: 'Could result in losses for an industry.' },
    { level: 2, label: 'Severe', description: 'Could cause severe and irreversible environmental damage. Full clean up not possible.' }
  ];

  const psychosocialLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in significant psychosocial impacts.' },
    { level: 1, label: 'Moderate', description: 'Significant psychosocial impacts including limited panic, hoarding, self-evacuation and long-term psychosocial impacts.' },
    { level: 2, label: 'Severe', description: 'Widespread psychosocial impacts, e.g. mass panic, widespread hoarding and self-evacuation and long-term psychological impacts.' }
  ];

  const frequencyChangeQuestions = [
    'Are the number of non-emergency occurrences of the hazard increasing?',
    'Is human activity (e.g. population growth, change of drainage patterns) likely to lead to more interaction with the hazard or an increase in frequency?',
    'Are there an environmental reason (e.g. climate change) why the frequency of this hazard may increase?',
    'Are human factors such as business, financial, international practices more likely to increase the risk?'
  ];

  const vulnerabilityChangeQuestions = [
    'Is a large number of the population vulnerable or are the number of people vulnerable to this hazard increasing?',
    'Does critical infrastructure reliance or a "just-on-time" delivery system (e.g. stores not keeping a supply of food and relying on frequent shipments) make the population more vulnerable?',
    'Are response agencies not aware of, practiced and prepared to response to this hazard?'
  ];

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        name: editingEntry.name || '',
        description: editingEntry.description || '',
        notes: editingEntry.notes || '',
        disaster_type: editingEntry.disaster_type || '',
        latitude: editingEntry.latitude || 0,
        longitude: editingEntry.longitude || 0,
        frequency: editingEntry.frequency || 1,
        fatalities: editingEntry.fatalities || 0,
        injuries: editingEntry.injuries || 0,
        evacuation: editingEntry.evacuation || 0,
        property_damage: editingEntry.property_damage || 0,
        critical_infrastructure: editingEntry.critical_infrastructure || 0,
        environmental_damage: editingEntry.environmental_damage || 0,
        business_financial_impact: editingEntry.business_financial_impact || 0,
        psychosocial_impact: editingEntry.psychosocial_impact || 0,
        change_in_frequency: editingEntry.change_in_frequency || [false, false, false, false],
        change_in_vulnerability: editingEntry.change_in_vulnerability || [false, false, false],
        hazard_image: editingEntry.hazard_image || null
      });
      if (editingEntry.hazard_image) {
        setImagePreview(editingEntry.hazard_image);
      }
    }
  }, [editingEntry]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, hazard_image: imageData }));
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
        setFormData(prev => ({ ...prev, hazard_image: imageData }));
        
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
      if (editingEntry) {
        await axios.put(`${API}/hira/${editingEntry.id}`, formData);
      } else {
        await axios.post(`${API}/hira`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving HIRA entry:', error);
      alert('Error saving HIRA entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateChangeFrequency = (index, checked) => {
    const newArray = [...formData.change_in_frequency];
    newArray[index] = checked;
    setFormData(prev => ({ ...prev, change_in_frequency: newArray }));
  };

  const updateChangeVulnerability = (index, checked) => {
    const newArray = [...formData.change_in_vulnerability];
    newArray[index] = checked;
    setFormData(prev => ({ ...prev, change_in_vulnerability: newArray }));
  };

  const RadioSection = ({ title, levels, value, onChange, required = true }) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-orange-500 flex items-center">
          {title}
          {required && <span className="text-red-400 ml-1">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value.toString()} onValueChange={(val) => onChange(parseInt(val))}>
          {levels.map((level) => (
            <div key={level.level} className="flex items-start space-x-3 py-2">
              <RadioGroupItem value={level.level.toString()} id={`${title}-${level.level}`} />
              <div className="flex-1">
                <Label htmlFor={`${title}-${level.level}`} className="text-white font-medium cursor-pointer">
                  Level {level.level} - {level.label}
                </Label>
                <p className="text-sm text-gray-400 mt-1">{level.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to HIRA List
        </Button>
        <h1 className="text-3xl font-bold text-orange-500 mb-2">
          {editingEntry ? 'Edit HIRA Entry' : 'Add New HIRA Entry'}
        </h1>
        <p className="text-gray-400">Hazard Identification Risk Assessment for emergency planning</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hazard Image Upload */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Hazard Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Hazard" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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
                    id="hazard-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hazard-image-upload').click()}
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
                <p className="text-sm text-gray-400">Upload image of hazard area or related documentation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-300">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="disaster_type" className="text-gray-300">Disaster Type *</Label>
              <Select value={formData.disaster_type} onValueChange={(value) => setFormData(prev => ({ ...prev, disaster_type: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select disaster type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                  <SelectItem value="manmade-separator" disabled className="font-semibold text-orange-400">
                    --- MANMADE DISASTERS ---
                  </SelectItem>
                  {disasterTypes.slice(0, 16).map((type) => (
                    <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                      {type}
                    </SelectItem>
                  ))}
                  <SelectItem value="natural-separator" disabled className="font-semibold text-green-400">
                    --- NATURAL DISASTERS ---
                  </SelectItem>
                  {disasterTypes.slice(16).map((type) => (
                    <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-gray-300">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-gray-300">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-orange-500">Risk Assessment Categories</h2>
          
          <RadioSection
            title="Frequency"
            levels={frequencyLevels}
            value={formData.frequency}
            onChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
          />

          <RadioSection
            title="Fatalities"
            levels={fatalityLevels}
            value={formData.fatalities}
            onChange={(value) => setFormData(prev => ({ ...prev, fatalities: value }))}
          />

          <RadioSection
            title="Injuries"
            levels={injuryLevels}
            value={formData.injuries}
            onChange={(value) => setFormData(prev => ({ ...prev, injuries: value }))}
          />

          <RadioSection
            title="Evacuation"
            levels={evacuationLevels}
            value={formData.evacuation}
            onChange={(value) => setFormData(prev => ({ ...prev, evacuation: value }))}
          />

          <RadioSection
            title="Property Damage"
            levels={propertyLevels}
            value={formData.property_damage}
            onChange={(value) => setFormData(prev => ({ ...prev, property_damage: value }))}
          />

          <RadioSection
            title="Critical Infrastructure Service Impact (CI)"
            levels={infrastructureLevels}
            value={formData.critical_infrastructure}
            onChange={(value) => setFormData(prev => ({ ...prev, critical_infrastructure: value }))}
          />

          <RadioSection
            title="Environmental Damage"
            levels={environmentalLevels}
            value={formData.environmental_damage}
            onChange={(value) => setFormData(prev => ({ ...prev, environmental_damage: value }))}
          />

          <RadioSection
            title="Business Financial Impact"
            levels={businessLevels}
            value={formData.business_financial_impact}
            onChange={(value) => setFormData(prev => ({ ...prev, business_financial_impact: value }))}
          />

          <RadioSection
            title="Psychosocial Impact"
            levels={psychosocialLevels}
            value={formData.psychosocial_impact}
            onChange={(value) => setFormData(prev => ({ ...prev, psychosocial_impact: value }))}
          />

          {/* Change in Frequency */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-orange-500 flex items-center">
                Change in Frequency <span className="text-red-400 ml-1">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {frequencyChangeQuestions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`freq-${index}`}
                    checked={formData.change_in_frequency[index]}
                    onCheckedChange={(checked) => updateChangeFrequency(index, checked)}
                  />
                  <Label htmlFor={`freq-${index}`} className="text-gray-300 cursor-pointer">
                    {question}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Change in Vulnerability */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-orange-500 flex items-center">
                Change in Vulnerability <span className="text-red-400 ml-1">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vulnerabilityChangeQuestions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`vuln-${index}`}
                    checked={formData.change_in_vulnerability[index]}
                    onCheckedChange={(checked) => updateChangeVulnerability(index, checked)}
                  />
                  <Label htmlFor={`vuln-${index}`} className="text-gray-300 cursor-pointer">
                    {question}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            disabled={loading}
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingEntry ? 'Update HIRA Entry' : 'Save HIRA Entry'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const HIRAList = ({ onAddNew, onEdit }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API}/hira`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching HIRA entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this HIRA entry?')) {
      try {
        await axios.delete(`${API}/hira/${entryId}`);
        setEntries(prev => prev.filter(e => e.id !== entryId));
      } catch (error) {
        console.error('Error deleting HIRA entry:', error);
        alert('Error deleting HIRA entry. Please try again.');
      }
    }
  };

  const getRiskLevel = (frequency, impact) => {
    const riskScore = frequency * impact;
    if (riskScore >= 15) return { level: 'Critical', color: 'bg-red-500/20 text-red-300 border-red-500/30', score: riskScore };
    if (riskScore >= 10) return { level: 'High', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', score: riskScore };
    if (riskScore >= 5) return { level: 'Medium', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', score: riskScore };
    return { level: 'Low', color: 'bg-green-500/20 text-green-300 border-green-500/30', score: riskScore };
  };

  // Sort entries by risk score (highest risk first)
  const sortedEntries = [...entries].sort((a, b) => {
    const maxImpactA = Math.max(a.fatalities, a.injuries, a.evacuation, a.property_damage);
    const maxImpactB = Math.max(b.fatalities, b.injuries, b.evacuation, b.property_damage);
    const riskScoreA = a.frequency * maxImpactA;
    const riskScoreB = b.frequency * maxImpactB;
    return riskScoreB - riskScoreA; // Descending order (highest risk first)
  });

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">HIRA - Hazard Identification Risk Assessment</h1>
          <p className="text-gray-400">Identify and assess emergency risks for your community</p>
        </div>
        <Button 
          onClick={onAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          data-testid="add-hira-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add HIRA Entry
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No HIRA Entries Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start identifying and assessing hazards in your community to improve emergency preparedness.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First HIRA Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing {sortedEntries.length} hazard{sortedEntries.length !== 1 ? 's' : ''} (sorted by risk level)
            </p>
          </div>
          {sortedEntries.map((entry) => {
            const maxImpact = Math.max(entry.fatalities, entry.injuries, entry.evacuation, entry.property_damage);
            const riskLevel = getRiskLevel(entry.frequency, maxImpact);
            
            return (
              <Card key={entry.id} className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Hazard Image */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={entry.hazard_image} alt={entry.name} />
                        <AvatarFallback className="bg-gray-600 text-orange-500 text-lg font-semibold">
                          <AlertTriangle className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{entry.name}</h3>
                        <Badge className={riskLevel.color}>
                          {riskLevel.level} Risk
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {entry.disaster_type}
                        </Badge>
                        <span className="text-xs text-gray-500">Risk Score: {riskLevel.score}</span>
                      </div>
                      
                      <p className="text-gray-400 mb-4">{entry.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-orange-400 font-medium">Frequency:</span>
                          <span className="text-gray-300 ml-2">Level {entry.frequency}</span>
                        </div>
                        <div>
                          <span className="text-red-400 font-medium">Max Impact:</span>
                          <span className="text-gray-300 ml-2">Level {maxImpact}</span>
                        </div>
                        {entry.latitude && entry.longitude && (
                          <div>
                            <span className="text-green-400 font-medium">Location:</span>
                            <span className="text-gray-300 ml-2">{entry.latitude.toFixed(2)}, {entry.longitude.toFixed(2)}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-purple-400 font-medium">Created:</span>
                          <span className="text-gray-300 ml-2">{new Date(entry.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {entry.notes && (
                        <div className="mt-3 p-3 bg-gray-700/50 rounded">
                          <span className="text-blue-400 font-medium text-sm">Notes: </span>
                          <span className="text-gray-300 text-sm">{entry.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HIRAView = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingEntry, setEditingEntry] = useState(null);

  const handleAddNew = () => {
    setEditingEntry(null);
    setView('add');
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingEntry(null);
  };

  const handleSave = () => {
    setView('list');
    setEditingEntry(null);
    // The list will automatically refresh via useEffect
  };

  if (view === 'add' || view === 'edit') {
    return (
      <HIRAForm
        onBack={handleBack}
        onSave={handleSave}
        editingEntry={editingEntry}
      />
    );
  }

  return (
    <HIRAList
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
};

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