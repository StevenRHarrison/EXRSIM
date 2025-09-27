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
  Info,
  FileText,
  Flag,
  Map,
  Trophy,
  CheckCircle,
  Calendar,
  Building,
  Key,
  Radio,
  Headphones,
  MessageSquare,
  ShieldAlert,
  Clock,
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Star,
  Lightbulb,
  AlertCircle,
  Zap,
  MessageCircle,
  CheckSquare
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
      const response = await axios.get(`${API}/exercise-builder`);
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
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Handle both time formats
    if (timeString && timeString.includes(':')) {
      return timeString;
    }
    return timeString || 'Not set';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Exercise Dashboard</h1>
          <p className="text-gray-400">Manage your emergency training exercises</p>
        </div>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          onClick={() => window.location.href = '#builder'}
          data-testid="new-exercise-btn"
        >
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
                  Create your first emergency training exercise using the Exercise Builder.
                </p>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                  onClick={() => window.location.href = '#builder'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start Exercise Builder
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
              onClick={() => window.location.href = `#manage?exercise=${exercise.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">{exercise.exercise_name}</CardTitle>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {exercise.exercise_type}
                    </Badge>
                  </div>
                  {exercise.exercise_image && (
                    <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden ml-3">
                      <img src={exercise.exercise_image} alt={exercise.exercise_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <CardDescription className="text-gray-400 mt-2">
                  {exercise.exercise_description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{exercise.location || 'Location not set'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Start: {formatDate(exercise.start_date)} at {formatTime(exercise.start_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>End: {formatDate(exercise.end_date)} at {formatTime(exercise.end_time)}</span>
                  </div>
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
    assignedTo: '',
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
    'Exercise Evaluator',
    'Exercise Director',
    'Exercise Observer',
    'Team Coordinator',
    'Team Planner',
    'Team Facilitator',
    'Team Evaluator',
    'Team Task',
    'Participant',
    'Staff Member',
    'Fire Chief',
    'Police Chief',
    'Fire Fighter',
    'Medical',
    'Supervisor',
    'Security',
    'Facilitator',
    'Umpire',
    'Scribe',
    'Assistant',
    'Exercise Controller',
    'Agency Representative',
    'Owner',
    'Actor',
    'VIP',
    'Media',
    'Visitor'
  ];

  const assignedToOptions = [
    'Operations Center EOC',
    'Command Post',
    'Airbase',
    'Base',
    'Camp',
    'Exercise',
    'Fire Hall',
    'Heliport',
    'Helispot',
    'Hospital',
    'Incident',
    'Medical',
    'Police',
    'Public Works',
    'Staging Areas',
    'Mobile Unit',
    'Stationary Unit',
    'Assistant',
    'Assembly Place',
    'Muster Point'
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
        assignedTo: editingParticipant.assignedTo || '',
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
        address: formData.address, // Include the individual address field
        fullAddress: `${formData.address}, ${formData.city}, ${formData.provinceState}`, // Keep full address for compatibility
        organization: '', // Will be handled later
        role: formData.position.toLowerCase().replace(/\s+/g, '_'),
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        assignedTo: formData.assignedTo,
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

  const saveStepDraft = async () => {
    setLoading(true);
    try {
      // Save current form data as draft
      const draftData = {
        ...formData,
        isDraft: true
      };
      
      // You could save this to localStorage or send to backend
      localStorage.setItem('participantDraft', JSON.stringify(draftData));
      console.log('Participant step saved as draft:', draftData);
      
      // Show success message
      alert('Step saved successfully!');
    } catch (error) {
      console.error('Error saving step:', error);
      alert('Error saving step. Please try again.');
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="assignedTo" className="text-gray-300">Assigned to</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select assignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {assignedToOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-white focus:bg-gray-600">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
        
        {/* Save Step Button */}
        <div className="flex justify-end">
          <Button 
            onClick={saveStepDraft}
            disabled={loading}
            variant="outline"
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Step'}
          </Button>
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

// Exercise List View (separate from Dashboard)
const ExerciseListView = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API}/exercise-builder`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExercise = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await axios.delete(`${API}/exercise-builder/${exerciseId}`);
        setExercises(prev => prev.filter(e => e.id !== exerciseId));
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Error deleting exercise. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (timeString && timeString.includes(':')) {
      return timeString;
    }
    return timeString || 'Not set';
  };

  const getExerciseTypeColor = (type) => {
    const colors = {
      'Table Top': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Drill': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Functional': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Full Scale Exercise': 'bg-red-500/20 text-red-300 border-red-500/30',
      'No-Notice Exercise': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Real World Event': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (selectedExercise) {
    return (
      <ExerciseDetailView 
        exercise={selectedExercise} 
        onBack={() => setSelectedExercise(null)} 
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Exercise Management</h1>
          <p className="text-gray-400">Manage completed emergency training exercises</p>
        </div>
        <Button 
          onClick={() => window.location.href = '#builder'}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          data-testid="new-exercise-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Exercise
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3"></div>
                    <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Exercises Created Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Use the Exercise Builder to create your first emergency training exercise.
            </p>
            <Button 
              onClick={() => window.location.href = '#builder'}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Exercise Builder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
          {exercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Exercise Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-600 overflow-hidden flex items-center justify-center">
                      {exercise.exercise_image ? (
                        <img 
                          src={exercise.exercise_image} 
                          alt={exercise.exercise_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Target className="h-8 w-8 text-orange-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {exercise.exercise_name}
                      </h3>
                      <Badge className={getExerciseTypeColor(exercise.exercise_type)}>
                        {exercise.exercise_type}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 mb-3 line-clamp-2">{exercise.exercise_description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="truncate">{exercise.location || 'Location not set'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <CalendarDays className="h-4 w-4 text-orange-500" />
                        <span>Start: {formatDate(exercise.start_date)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <CalendarDays className="h-4 w-4 text-orange-500" />
                        <span>End: {formatDate(exercise.end_date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>Created: {new Date(exercise.created_at).toLocaleDateString()}</span>
                      <span>Times: {formatTime(exercise.start_time)} - {formatTime(exercise.end_time)}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExercise(exercise);
                      }}
                      className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                    >
                      <Target className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteExercise(exercise.id);
                      }}
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

// Exercise Detail View
const ExerciseDetailView = ({ exercise, onBack }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exercise List
        </Button>
        <div className="flex items-start space-x-6">
          {exercise.exercise_image && (
            <div className="w-32 h-32 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
              <img 
                src={exercise.exercise_image} 
                alt={exercise.exercise_name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">{exercise.exercise_name}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-base px-3 py-1">
                {exercise.exercise_type}
              </Badge>
            </div>
            <p className="text-gray-300 text-lg">{exercise.exercise_description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-gray-400 text-sm">Location</Label>
              <p className="text-white">{exercise.location || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Start</Label>
              <p className="text-white">
                {new Date(exercise.start_date).toLocaleDateString()} at {exercise.start_time || 'TBD'}
              </p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">End</Label>
              <p className="text-white">
                {new Date(exercise.end_date).toLocaleDateString()} at {exercise.end_time || 'TBD'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scope */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-gray-400 text-sm">Hazards</Label>
              <p className="text-white text-sm">{exercise.scope_hazards || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Geographic Area</Label>
              <p className="text-white text-sm">{exercise.scope_geographic_area || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Functions</Label>
              <p className="text-white text-sm">{exercise.scope_functions || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Purpose */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">{exercise.purpose_description || 'Not specified'}</p>
          </CardContent>
        </Card>

        {/* Scenario */}
        {(exercise.scenario_name || exercise.scenario_description) && (
          <Card className="bg-gray-800 border-gray-700 col-span-full">
            <CardHeader>
              <CardTitle className="text-orange-500">Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                {exercise.scenario_image && (
                  <div className="w-24 h-24 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                    <img 
                      src={exercise.scenario_image} 
                      alt={exercise.scenario_name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{exercise.scenario_name}</h3>
                  <p className="text-gray-300">{exercise.scenario_description}</p>
                  {(exercise.scenario_latitude || exercise.scenario_longitude) && (
                    <p className="text-gray-400 text-sm mt-2">
                      Coordinates: {exercise.scenario_latitude}, {exercise.scenario_longitude}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button
          variant="outline"
          className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          onClick={() => window.location.href = `#builder?exercise=${exercise.id}`}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Exercise
        </Button>
        <Button
          variant="outline"
          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          View MSEL
        </Button>
      </div>
    </div>
  );
};

const ExerciseView = () => {
  return <ExerciseListView />;
};

// MSEL Management Components
const MSELForm = ({ onBack, onSave, editingEvent = null }) => {
  const [formData, setFormData] = useState({
    exercise_id: '',
    event_number: 1,
    scenario_time: '',
    event_type: '',
    inject_mode: '',
    from_entity: '',
    to_entity: '',
    message: '',
    expected_response: '',
    objective_capability_task: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const eventTypes = [
    'Player Inject',
    'Media Inject',
    'Discussion Question',
    'Information Update',
    'Decision Point',
    'Time Advance',
    'Scenario Development',
    'Resource Request',
    'Communication Test',
    'Evaluation Checkpoint'
  ];

  const injectModes = [
    'Phone Call',
    'Radio Communication',
    'Email/Message',
    'Face-to-Face',
    'Written Document',
    'Media Broadcast',
    'Social Media',
    'Emergency Alert System',
    'Controller Briefing',
    'Automated System'
  ];

  const controllerRoles = [
    'Exercise Controller',
    'Lead Controller',
    'Safety Officer',
    'Evaluator',
    'SIMCELL Controller',
    'Communications Controller',
    'Media Controller',
    'Logistics Controller',
    'Technical Controller',
    'Observer Controller'
  ];

  const playerRoles = [
    'Incident Commander',
    'Operations Section',
    'Planning Section',
    'Logistics Section',
    'Finance/Administration Section',
    'Safety Officer',
    'Public Information Officer',
    'Liaison Officer',
    'All Players',
    'Emergency Operations Center',
    'Field Teams',
    'Media Representatives'
  ];

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        exercise_id: editingEvent.exercise_id || '',
        event_number: editingEvent.event_number || 1,
        scenario_time: editingEvent.scenario_time || '',
        event_type: editingEvent.event_type || '',
        inject_mode: editingEvent.inject_mode || '',
        from_entity: editingEvent.from_entity || '',
        to_entity: editingEvent.to_entity || '',
        message: editingEvent.message || '',
        expected_response: editingEvent.expected_response || '',
        objective_capability_task: editingEvent.objective_capability_task || '',
        notes: editingEvent.notes || ''
      });
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingEvent) {
        await axios.put(`${API}/msel/event/${editingEvent.id}`, formData);
      } else {
        await axios.post(`${API}/msel`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving MSEL event:', error);
      alert('Error saving MSEL event. Please try again.');
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
          Back to MSEL List
        </Button>
        <h1 className="text-3xl font-bold text-orange-500 mb-2">
          {editingEvent ? 'Edit MSEL Event' : 'Add New MSEL Event'}
        </h1>
        <p className="text-gray-400">Master Sequence Event List - Exercise event planning and tracking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Identification */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Event Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_number" className="text-gray-300">Event Number *</Label>
                <Input
                  id="event_number"
                  type="number"
                  min="1"
                  value={formData.event_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_number: parseInt(e.target.value) || 1 }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="scenario_time" className="text-gray-300">Designated Scenario Time *</Label>
                <Input
                  id="scenario_time"
                  value={formData.scenario_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, scenario_time: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., 09:30, T+15 minutes, Day 1 - 14:00"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="exercise_id" className="text-gray-300">Exercise ID (Optional)</Label>
              <Input
                id="exercise_id"
                value={formData.exercise_id}
                onChange={(e) => setFormData(prev => ({ ...prev, exercise_id: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Link to specific exercise"
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Classification */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Event Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event_type" className="text-gray-300">Event Type *</Label>
              <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="inject_mode" className="text-gray-300">Inject Mode *</Label>
              <Select value={formData.inject_mode} onValueChange={(value) => setFormData(prev => ({ ...prev, inject_mode: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select inject mode" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {injectModes.map((mode) => (
                    <SelectItem key={mode} value={mode} className="text-white focus:bg-gray-600">
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Communication Details */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Communication Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="from_entity" className="text-gray-300">From (Controller/Entity) *</Label>
              <Select value={formData.from_entity} onValueChange={(value) => setFormData(prev => ({ ...prev, from_entity: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select controller role or type custom" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {controllerRoles.map((role) => (
                    <SelectItem key={role} value={role} className="text-white focus:bg-gray-600">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={formData.from_entity}
                onChange={(e) => setFormData(prev => ({ ...prev, from_entity: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white mt-2"
                placeholder="Or type custom controller/entity name"
              />
            </div>

            <div>
              <Label htmlFor="to_entity" className="text-gray-300">To (Player/Group) *</Label>
              <Select value={formData.to_entity} onValueChange={(value) => setFormData(prev => ({ ...prev, to_entity: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select player role or type custom" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {playerRoles.map((role) => (
                    <SelectItem key={role} value={role} className="text-white focus:bg-gray-600">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={formData.to_entity}
                onChange={(e) => setFormData(prev => ({ ...prev, to_entity: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white mt-2"
                placeholder="Or type custom player/group name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Content */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Event Content & Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-gray-300">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
                placeholder="The core content of the inject - information, request, or call to action"
                required
              />
            </div>

            <div>
              <Label htmlFor="expected_response" className="text-gray-300">Expected Participant Response *</Label>
              <Textarea
                id="expected_response"
                value={formData.expected_response}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_response: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="The anticipated action or reaction from the player"
                required
              />
            </div>

            <div>
              <Label htmlFor="objective_capability_task" className="text-gray-300">Objective, Capability, and/or Critical Task *</Label>
              <Textarea
                id="objective_capability_task"
                value={formData.objective_capability_task}
                onChange={(e) => setFormData(prev => ({ ...prev, objective_capability_task: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="The specific exercise objective or critical task this event tests"
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
                placeholder="Additional controller information or details"
              />
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
            {loading ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingEvent ? 'Update Event' : 'Save Event'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const MSELList = ({ onAddNew, onEdit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/msel`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching MSEL events:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this MSEL event?')) {
      try {
        await axios.delete(`${API}/msel/event/${eventId}`);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (error) {
        console.error('Error deleting MSEL event:', error);
        alert('Error deleting MSEL event. Please try again.');
      }
    }
  };

  const toggleCompletion = async (event) => {
    try {
      const updatedEvent = {
        ...event,
        completed: !event.completed,
        actual_time: !event.completed ? new Date().toLocaleTimeString() : null
      };
      await axios.put(`${API}/msel/event/${event.id}`, updatedEvent);
      setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
    } catch (error) {
      console.error('Error updating event completion:', error);
    }
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      'Player Inject': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Media Inject': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Discussion Question': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Information Update': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Decision Point': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[eventType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  // Sort events by event number
  const sortedEvents = [...events].sort((a, b) => a.event_number - b.event_number);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">MSEL - Master Sequence Event List</h1>
          <p className="text-gray-400">Manage exercise event timeline and inject sequences</p>
        </div>
        <Button 
          onClick={onAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          data-testid="add-msel-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add MSEL Event
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No MSEL Events Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start planning your exercise by creating sequence events and inject timelines.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First MSEL Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''} (sorted by event number)
            </p>
          </div>
          {sortedEvents.map((event) => (
            <Card key={event.id} className={`bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors ${event.completed ? 'opacity-75' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Event Number Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      event.completed ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'
                    }`}>
                      #{event.event_number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">Event #{event.event_number}</h3>
                      <Badge className={getEventTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                      <Badge className="bg-gray-600/20 text-gray-300 border-gray-600/30">
                        {event.inject_mode}
                      </Badge>
                      {event.completed && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Completed
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-orange-400 font-medium text-sm">Scenario Time:</span>
                        <span className="text-gray-300 ml-2">{event.scenario_time}</span>
                      </div>
                      <div>
                        <span className="text-blue-400 font-medium text-sm">From → To:</span>
                        <span className="text-gray-300 ml-2">{event.from_entity} → {event.to_entity}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-green-400 font-medium text-sm">Message:</span>
                      <p className="text-gray-300 text-sm mt-1">{event.message}</p>
                    </div>

                    <div className="mb-3">
                      <span className="text-purple-400 font-medium text-sm">Expected Response:</span>
                      <p className="text-gray-300 text-sm mt-1">{event.expected_response}</p>
                    </div>

                    <div className="mb-3">
                      <span className="text-yellow-400 font-medium text-sm">Objective/Task:</span>
                      <p className="text-gray-300 text-sm mt-1">{event.objective_capability_task}</p>
                    </div>

                    {event.notes && (
                      <div className="mb-3 p-3 bg-gray-700/50 rounded">
                        <span className="text-cyan-400 font-medium text-sm">Controller Notes:</span>
                        <p className="text-gray-300 text-sm mt-1">{event.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {new Date(event.created_at).toLocaleString()}</span>
                      {event.completed && event.actual_time && (
                        <span>Completed at: {event.actual_time}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCompletion(event)}
                      className={event.completed 
                        ? "border-green-600 text-green-300 hover:text-green-200 hover:border-green-500/50"
                        : "border-orange-600 text-orange-300 hover:text-orange-200 hover:border-orange-500/50"
                      }
                    >
                      {event.completed ? 'Mark Pending' : 'Mark Complete'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(event)}
                      className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
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

const MSELView = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddNew = () => {
    setEditingEvent(null);
    setView('add');
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingEvent(null);
  };

  const handleSave = () => {
    setView('list');
    setEditingEvent(null);
    // The list will automatically refresh via useEffect
  };

  if (view === 'add' || view === 'edit') {
    return (
      <MSELForm
        onBack={handleBack}
        onSave={handleSave}
        editingEvent={editingEvent}
      />
    );
  }

  return (
    <MSELList
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
};

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

// Exercise Builder Step-by-Step Wizard
const ExerciseBuilderWizard = ({ onBack, editingExercise = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [exerciseData, setExerciseData] = useState({
    // Step 1: Exercise
    exercise_image: null,
    exercise_name: '',
    exercise_type: '',
    exercise_description: '',
    location: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    // Step 2: Scope
    scope_description: '',
    scope_hazards: '',
    scope_geographic_area: '',
    scope_functions: '',
    scope_organizations: '',
    scope_personnel: '',
    scope_exercise_type: '',
    // Step 3: Purpose
    purpose_description: '',
    // Step 4: Scenario
    scenario_image: null,
    scenario_name: '',
    scenario_description: '',
    scenario_latitude: 0,
    scenario_longitude: 0
  });
  const [imagePreview, setImagePreview] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic lists for add functionality
  const [goals, setGoals] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [events, setEvents] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [codeWords, setCodeWords] = useState([]);
  const [callsigns, setCallsigns] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [assumptions, setAssumptions] = useState([]);
  const [artificialities, setArtificialities] = useState([]);
  const [safetyConcerns, setSafetyConcerns] = useState([]);

  // Current form states for adding items
  const [currentGoal, setCurrentGoal] = useState({ name: '', description: '', achieved: 'No' });
  const [currentObjective, setCurrentObjective] = useState({ name: '', description: '', achieved: 'No' });
  const [currentEvent, setCurrentEvent] = useState({ 
    name: '', description: '', actions: '', latitude: 0, longitude: 0, 
    start_date: '', start_time: '', end_date: '', end_time: '', 
    tier_scale: '', escalation_value: 'none' 
  });
  const [currentFunction, setCurrentFunction] = useState({ name: '', description: '', achieved: 'No' });
  const [currentOrganization, setCurrentOrganization] = useState({ 
    name: '', description: '', home_base: '', contact_first_name: '', 
    contact_last_name: '', contact_phone: '', contact_email: '' 
  });
  const [currentCodeWord, setCurrentCodeWord] = useState({ word: '', meaning: '' });
  const [currentCallsign, setCurrentCallsign] = useState({ callsign: '', description: '' });
  const [currentFrequency, setCurrentFrequency] = useState({ 
    frequency: '', type: '', description: '', primary_backup: 'Primary' 
  });
  const [currentAssumption, setCurrentAssumption] = useState({ assumption: '', description: '' });
  const [currentArtificiality, setCurrentArtificiality] = useState({ artificiality: '', description: '' });
  const [currentSafetyConcern, setSafetyConcern] = useState({ 
    concern: '', safety_officer: '', phone: '', description: '' 
  });

  // Load existing exercise data when editing
  useEffect(() => {
    if (editingExercise) {
      setIsEditing(true);
      
      // Convert ISO date strings back to date format for form inputs
      const startDate = editingExercise.start_date ? new Date(editingExercise.start_date) : null;
      const endDate = editingExercise.end_date ? new Date(editingExercise.end_date) : null;
      
      setExerciseData({
        id: editingExercise.id,
        exercise_image: editingExercise.exercise_image || null,
        exercise_name: editingExercise.exercise_name || '',
        exercise_type: editingExercise.exercise_type || '',
        exercise_description: editingExercise.exercise_description || '',
        location: editingExercise.location || '',
        start_date: startDate ? startDate.toISOString().split('T')[0] : '',
        start_time: startDate ? startDate.toTimeString().slice(0, 5) : '',
        end_date: endDate ? endDate.toISOString().split('T')[0] : '',
        end_time: endDate ? endDate.toTimeString().slice(0, 5) : '',
        scope_description: editingExercise.scope_description || '',
        scope_hazards: editingExercise.scope_hazards || '',
        scope_geographic_area: editingExercise.scope_geographic_area || '',
        scope_functions: editingExercise.scope_functions || '',
        scope_organizations: editingExercise.scope_organizations || '',
        scope_personnel: editingExercise.scope_personnel || '',
        scope_exercise_type: editingExercise.scope_exercise_type || '',
        purpose_description: editingExercise.purpose_description || '',
        scenario_image: editingExercise.scenario_image || null,
        scenario_name: editingExercise.scenario_name || '',
        scenario_description: editingExercise.scenario_description || '',
        scenario_latitude: editingExercise.scenario_latitude || 0,
        scenario_longitude: editingExercise.scenario_longitude || 0
      });

      // Set image previews if they exist
      const previews = {};
      if (editingExercise.exercise_image) {
        previews.exercise_image = editingExercise.exercise_image;
      }
      if (editingExercise.scenario_image) {
        previews.scenario_image = editingExercise.scenario_image;
      }
      setImagePreview(previews);

      // Load dynamic collections if they exist
      console.log('Loading dynamic collections from editingExercise:', editingExercise);
      console.log('Full editingExercise object:', JSON.stringify(editingExercise, null, 2));
      console.log('Goals data:', editingExercise.goals);
      console.log('Goals type:', typeof editingExercise.goals);
      console.log('Goals is array:', Array.isArray(editingExercise.goals));
      console.log('Objectives data:', editingExercise.objectives);
      console.log('Objectives type:', typeof editingExercise.objectives);
      console.log('Objectives is array:', Array.isArray(editingExercise.objectives));
      
      // Always set the collections, even if they're empty arrays
      if (editingExercise.goals !== undefined) {
        console.log('Setting goals with data:', editingExercise.goals);
        setGoals(Array.isArray(editingExercise.goals) ? editingExercise.goals : []);
      }
      if (editingExercise.objectives !== undefined) {
        console.log('Setting objectives with data:', editingExercise.objectives);
        setObjectives(Array.isArray(editingExercise.objectives) ? editingExercise.objectives : []);
      }
      if (editingExercise.events !== undefined) {
        setEvents(Array.isArray(editingExercise.events) ? editingExercise.events : []);
      }
      if (editingExercise.functions !== undefined) {
        setFunctions(Array.isArray(editingExercise.functions) ? editingExercise.functions : []);
      }
      if (editingExercise.organizations !== undefined) {
        setOrganizations(Array.isArray(editingExercise.organizations) ? editingExercise.organizations : []);
      }
      if (editingExercise.codeWords !== undefined) {
        setCodeWords(Array.isArray(editingExercise.codeWords) ? editingExercise.codeWords : []);
      }
      if (editingExercise.callsigns !== undefined) {
        setCallsigns(Array.isArray(editingExercise.callsigns) ? editingExercise.callsigns : []);
      }
      if (editingExercise.frequencies !== undefined) {
        setFrequencies(Array.isArray(editingExercise.frequencies) ? editingExercise.frequencies : []);
      }
      if (editingExercise.assumptions !== undefined) {
        setAssumptions(Array.isArray(editingExercise.assumptions) ? editingExercise.assumptions : []);
      }
      if (editingExercise.artificialities !== undefined) {
        setArtificialities(Array.isArray(editingExercise.artificialities) ? editingExercise.artificialities : []);
      }
      if (editingExercise.safetyConcerns !== undefined) {
        setSafetyConcerns(Array.isArray(editingExercise.safetyConcerns) ? editingExercise.safetyConcerns : []);
      }
    }
  }, [editingExercise]);

  const exerciseTypes = [
    'Table Top',
    'Drill', 
    'Functional',
    'Full Scale Exercise',
    'No-Notice Exercise',
    'Real World Event'
  ];

  const steps = [
    { number: 1, title: 'Exercise', description: 'Basic exercise information' },
    { number: 2, title: 'Scope', description: 'Define exercise scope and boundaries' },
    { number: 3, title: 'Purpose', description: 'Exercise purpose and intent' },
    { number: 4, title: 'Scenario', description: 'Exercise scenario details' },
    { number: 5, title: 'Goals', description: 'Exercise goals and outcomes' },
    { number: 6, title: 'Objectives', description: 'Specific objectives to test' },
    { number: 7, title: 'Events', description: 'Exercise events and timeline' },
    { number: 8, title: 'Functions', description: 'Functions to be exercised' },
    { number: 9, title: 'Injections', description: 'MSEL integration' },
    { number: 10, title: 'Organizations', description: 'Participating organizations' },
    { number: 11, title: 'Team Coordinators', description: 'Exercise coordination team' },
    { number: 12, title: 'Code Words', description: 'Exercise code words' },
    { number: 13, title: 'Callsigns', description: 'Communication callsigns' },
    { number: 14, title: 'Comm Frequencies', description: 'Radio frequencies' },
    { number: 15, title: 'Assumptions', description: 'Exercise assumptions' },
    { number: 16, title: 'Artificialities', description: 'Artificial constraints' },
    { number: 17, title: 'Safety', description: 'Safety considerations' }
  ];

  const handleImageUpload = (event, imageType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(prev => ({ ...prev, [imageType]: imageData }));
        setExerciseData(prev => ({ ...prev, [imageType]: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async (imageType) => {
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
        setImagePreview(prev => ({ ...prev, [imageType]: imageData }));
        setExerciseData(prev => ({ ...prev, [imageType]: imageData }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add handlers for dynamic items
  const addGoal = () => {
    if (currentGoal.name.trim()) {
      setGoals(prev => [...prev, { ...currentGoal, id: Date.now() }]);
      setCurrentGoal({ name: '', description: '', achieved: 'No' });
    }
  };

  const addObjective = () => {
    if (currentObjective.name.trim()) {
      setObjectives(prev => [...prev, { ...currentObjective, id: Date.now() }]);
      setCurrentObjective({ name: '', description: '', achieved: 'No' });
    }
  };

  const addEvent = () => {
    if (currentEvent.name.trim()) {
      setEvents(prev => [...prev, { ...currentEvent, id: Date.now() }]);
      setCurrentEvent({ 
        name: '', description: '', actions: '', latitude: 0, longitude: 0, 
        start_date: '', start_time: '', end_date: '', end_time: '', 
        tier_scale: '', escalation_value: 'none' 
      });
    }
  };

  const addFunction = () => {
    if (currentFunction.name.trim()) {
      setFunctions(prev => [...prev, { ...currentFunction, id: Date.now() }]);
      setCurrentFunction({ name: '', description: '', achieved: 'No' });
    }
  };

  const addOrganization = () => {
    if (currentOrganization.name.trim()) {
      setOrganizations(prev => [...prev, { ...currentOrganization, id: Date.now() }]);
      setCurrentOrganization({ 
        name: '', description: '', home_base: '', contact_first_name: '', 
        contact_last_name: '', contact_phone: '', contact_email: '' 
      });
    }
  };

  const addCodeWord = () => {
    if (currentCodeWord.word.trim()) {
      setCodeWords(prev => [...prev, { ...currentCodeWord, id: Date.now() }]);
      setCurrentCodeWord({ word: '', meaning: '' });
    }
  };

  const addCallsign = () => {
    if (currentCallsign.callsign.trim()) {
      setCallsigns(prev => [...prev, { ...currentCallsign, id: Date.now() }]);
      setCurrentCallsign({ callsign: '', description: '' });
    }
  };

  const addFrequency = () => {
    if (currentFrequency.frequency.trim()) {
      setFrequencies(prev => [...prev, { ...currentFrequency, id: Date.now() }]);
      setCurrentFrequency({ 
        frequency: '', type: '', description: '', primary_backup: 'Primary' 
      });
    }
  };

  const addAssumption = () => {
    if (currentAssumption.assumption.trim()) {
      setAssumptions(prev => [...prev, { ...currentAssumption, id: Date.now() }]);
      setCurrentAssumption({ assumption: '', description: '' });
    }
  };

  const addArtificiality = () => {
    if (currentArtificiality.artificiality.trim()) {
      setArtificialities(prev => [...prev, { ...currentArtificiality, id: Date.now() }]);
      setCurrentArtificiality({ artificiality: '', description: '' });
    }
  };

  const addSafetyConcern = () => {
    if (currentSafetyConcern.concern.trim()) {
      setSafetyConcerns(prev => [...prev, { ...currentSafetyConcern, id: Date.now() }]);
      setSafetyConcern({ 
        concern: '', safety_officer: '', phone: '', description: '' 
      });
    }
  };

  // Remove handlers
  const removeGoal = (id) => setGoals(prev => prev.filter(item => item.id !== id));
  const removeObjective = (id) => setObjectives(prev => prev.filter(item => item.id !== id));
  const removeEvent = (id) => setEvents(prev => prev.filter(item => item.id !== id));
  const removeFunction = (id) => setFunctions(prev => prev.filter(item => item.id !== id));
  const removeOrganization = (id) => setOrganizations(prev => prev.filter(item => item.id !== id));
  const removeCodeWord = (id) => setCodeWords(prev => prev.filter(item => item.id !== id));
  const removeCallsign = (id) => setCallsigns(prev => prev.filter(item => item.id !== id));
  const removeFrequency = (id) => setFrequencies(prev => prev.filter(item => item.id !== id));
  const removeAssumption = (id) => setAssumptions(prev => prev.filter(item => item.id !== id));
  const removeArtificiality = (id) => setArtificialities(prev => prev.filter(item => item.id !== id));
  const removeSafetyConcern = (id) => setSafetyConcerns(prev => prev.filter(item => item.id !== id));

  // Save current step as draft
  const saveStepDraft = async () => {
    setLoading(true);
    try {
      // Combine all current data
      const allData = {
        ...exerciseData,
        goals,
        objectives,
        events,
        functions,
        organizations,
        codeWords,
        callsigns,
        frequencies,
        assumptions,
        artificialities,
        safetyConcerns
      };

      // Use the same save logic as the main save function
      let startDate, endDate;
      
      if (allData.start_date) {
        startDate = new Date(allData.start_date + 'T' + (allData.start_time || '00:00'));
        if (isNaN(startDate.getTime())) {
          throw new Error('Invalid start date');
        }
      } else {
        startDate = new Date();
      }
      
      if (allData.end_date) {
        endDate = new Date(allData.end_date + 'T' + (allData.end_time || '23:59'));
        if (isNaN(endDate.getTime())) {
          throw new Error('Invalid end date');
        }
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }
      
      const exercisePayload = {
        ...allData,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        scope_exercise_type: allData.exercise_type
      };
      
      const payloadForAPI = { ...exercisePayload };
      delete payloadForAPI.id;
      
      if (isEditing && exerciseData.id) {
        await axios.put(`${API}/exercise-builder/${exerciseData.id}`, payloadForAPI);
        alert(`Step ${currentStep} saved successfully!`);
      } else {
        const response = await axios.post(`${API}/exercise-builder`, payloadForAPI);
        // Update the exercise ID for future saves
        if (response.data.id) {
          setExerciseData(prev => ({ ...prev, id: response.data.id }));
          setIsEditing(true);
        }
        alert(`Step ${currentStep} saved as draft!`);
      }
    } catch (error) {
      console.error('Error saving step:', error);
      alert('Error saving step. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveExercise = async () => {
    setLoading(true);
    try {
      // Validate and convert date strings to proper datetime format
      let startDate, endDate;
      
      if (exerciseData.start_date) {
        startDate = new Date(exerciseData.start_date + 'T' + (exerciseData.start_time || '00:00'));
        if (isNaN(startDate.getTime())) {
          throw new Error('Invalid start date');
        }
      } else {
        // Use current date if no start date provided
        startDate = new Date();
      }
      
      if (exerciseData.end_date) {
        endDate = new Date(exerciseData.end_date + 'T' + (exerciseData.end_time || '23:59'));
        if (isNaN(endDate.getTime())) {
          throw new Error('Invalid end date');
        }
      } else {
        // Use start date + 1 day if no end date provided
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }
      
      // Log debug information about data being saved
      console.log('💾 Saving Exercise with Complete Data:');
      console.log('📝 Basic Exercise Data:', exerciseData);
      console.log('🎯 Goals:', goals);
      console.log('🔸 Objectives:', objectives);
      console.log('📅 Events:', events);
      console.log('⚙️ Functions:', functions);
      console.log('🏢 Organizations:', organizations);
      
      const exercisePayload = {
        ...exerciseData,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        scope_exercise_type: exerciseData.exercise_type,
        // Add all dynamic collections
        goals: goals,
        objectives: objectives,
        events: events,
        functions: functions,
        organizations: organizations,
        codeWords: codeWords,
        callsigns: callsigns,
        frequencies: frequencies,
        assumptions: assumptions,
        artificialities: artificialities,
        safetyConcerns: safetyConcerns
      };
      
      console.log('📦 Complete Payload Being Sent:', exercisePayload);
      
      // Remove id from payload for create operations, but keep it for updates
      const payloadForAPI = { ...exercisePayload };
      delete payloadForAPI.id;
      
      if (isEditing && exerciseData.id) {
        // Update existing exercise
        await axios.put(`${API}/exercise-builder/${exerciseData.id}`, payloadForAPI);
        alert('Exercise updated successfully!');
      } else {
        // Create new exercise
        await axios.post(`${API}/exercise-builder`, payloadForAPI);
        alert('Exercise saved successfully!');
      }
      
      // Clear URL parameters after saving and go back
      if (isEditing) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      onBack();
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error saving exercise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadComponent = ({ imageType, title }) => (
    <div className="flex items-center space-x-6">
      <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
        {imagePreview[imageType] ? (
          <img src={imagePreview[imageType]} alt={title} className="w-full h-full object-cover rounded-lg" />
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
            onChange={(e) => handleImageUpload(e, imageType)}
            className="hidden"
            id={`${imageType}-upload`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`${imageType}-upload`).click()}
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleCameraCapture(imageType)}
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
        </div>
        <p className="text-sm text-gray-400">Upload image or capture with camera</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Exercise
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="exercise_image" title="Exercise" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Exercise Name *</Label>
                  <Input
                    value={exerciseData.exercise_name}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, exercise_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Exercise Type *</Label>
                  <Select 
                    value={exerciseData.exercise_type} 
                    onValueChange={(value) => setExerciseData(prev => ({ ...prev, exercise_type: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select exercise type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {exerciseTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Description *</Label>
                  <Textarea
                    value={exerciseData.exercise_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, exercise_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Location *</Label>
                  <Input
                    value={exerciseData.location}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Start Date *</Label>
                    <Input
                      type="date"
                      value={exerciseData.start_date}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Start Time</Label>
                    <Input
                      type="time"
                      value={exerciseData.start_time}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">End Date *</Label>
                    <Input
                      type="date"
                      value={exerciseData.end_date}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">End Time</Label>
                    <Input
                      type="time"
                      value={exerciseData.end_time}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 2: // Scope
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Scope Description</Label>
                  <Textarea
                    value={exerciseData.scope_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Hazards</Label>
                  <Textarea
                    value={exerciseData.scope_hazards}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_hazards: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Geographic Area</Label>
                  <Textarea
                    value={exerciseData.scope_geographic_area}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_geographic_area: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Functions</Label>
                  <Textarea
                    value={exerciseData.scope_functions}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_functions: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Organizations</Label>
                  <Textarea
                    value={exerciseData.scope_organizations}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_organizations: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Personnel</Label>
                  <Textarea
                    value={exerciseData.scope_personnel}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_personnel: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Exercise Type (Copied from Step 1)</Label>
                  <Input
                    value={exerciseData.exercise_type}
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 3: // Purpose
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-gray-300">Purpose Description</Label>
                  <Textarea
                    value={exerciseData.purpose_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, purpose_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                    placeholder="Describe the overall purpose and intent of this exercise..."
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 4: // Scenario
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Scenario Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="scenario_image" title="Scenario" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Scenario Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Scenario Name</Label>
                  <Input
                    value={exerciseData.scenario_name}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scenario_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Scenario Description</Label>
                  <Textarea
                    value={exerciseData.scenario_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scenario_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={exerciseData.scenario_latitude}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, scenario_latitude: parseFloat(e.target.value) || 0 }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={exerciseData.scenario_longitude}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, scenario_longitude: parseFloat(e.target.value) || 0 }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 5: // Goals
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Goals</CardTitle>
                <CardDescription className="text-gray-400">
                  Define the high-level goals for this exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Goal Name</Label>
                  <Input
                    value={currentGoal.name}
                    onChange={(e) => setCurrentGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Test emergency notification systems"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Goal Description</Label>
                  <Textarea
                    value={currentGoal.description}
                    onChange={(e) => setCurrentGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this goal in detail..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Goal Achieved</Label>
                  <RadioGroup 
                    value={currentGoal.achieved} 
                    onValueChange={(value) => setCurrentGoal(prev => ({ ...prev, achieved: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="goal-yes" />
                      <Label htmlFor="goal-yes" className="text-green-400">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Partial" id="goal-partial" />
                      <Label htmlFor="goal-partial" className="text-yellow-400">Partial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="goal-no" />
                      <Label htmlFor="goal-no" className="text-red-400">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={addGoal}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                  <Button 
                    onClick={saveStepDraft}
                    disabled={loading}
                    variant="outline"
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Step'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Display added goals */}
            {goals.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Goals ({goals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <div key={goal.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{goal.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              goal.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                              goal.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                              'bg-red-500/20 text-red-300 border-red-500/30'
                            }>
                              {goal.achieved}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeGoal(goal.id)}
                              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 6: // Objectives
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Objectives</CardTitle>
                <CardDescription className="text-gray-400">
                  Define specific, measurable objectives to be tested
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Objective Name</Label>
                  <Input
                    value={currentObjective.name}
                    onChange={(e) => setCurrentObjective(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Activate EOC within 30 minutes"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Objective Description</Label>
                  <Textarea
                    value={currentObjective.description}
                    onChange={(e) => setCurrentObjective(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the specific objective to be measured..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Objective Achieved</Label>
                  <RadioGroup 
                    value={currentObjective.achieved} 
                    onValueChange={(value) => setCurrentObjective(prev => ({ ...prev, achieved: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="obj-yes" />
                      <Label htmlFor="obj-yes" className="text-green-400">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Partial" id="obj-partial" />
                      <Label htmlFor="obj-partial" className="text-yellow-400">Partial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="obj-no" />
                      <Label htmlFor="obj-no" className="text-red-400">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={addObjective}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                  <Button 
                    onClick={saveStepDraft}
                    disabled={loading}
                    variant="outline"
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Step'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Display added objectives */}
            {objectives.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Objectives ({objectives.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {objectives.map((objective) => (
                      <div key={objective.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{objective.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              objective.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                              objective.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                              'bg-red-500/20 text-red-300 border-red-500/30'
                            }>
                              {objective.achieved}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeObjective(objective.id)}
                              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{objective.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 7: // Events
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Event Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="event_image" title="Event" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Events</CardTitle>
                <CardDescription className="text-gray-400">
                  Define key events within the exercise timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Event Name</Label>
                  <Input
                    value={currentEvent.name}
                    onChange={(e) => setCurrentEvent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Initial Emergency Notification"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Event Description</Label>
                  <Textarea
                    value={currentEvent.description}
                    onChange={(e) => setCurrentEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the event in detail..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Anticipated Actions</Label>
                  <Textarea
                    value={currentEvent.actions}
                    onChange={(e) => setCurrentEvent(prev => ({ ...prev, actions: e.target.value }))}
                    placeholder="What actions are expected from participants?"
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={currentEvent.latitude}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.0"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={currentEvent.longitude}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.0"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Start Date</Label>
                    <Input
                      type="date"
                      value={currentEvent.start_date}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, start_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Start Time</Label>
                    <Input
                      type="time"
                      value={currentEvent.start_time}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, start_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">End Date</Label>
                    <Input
                      type="date"
                      value={currentEvent.end_date}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, end_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">End Time</Label>
                    <Input
                      type="time"
                      value={currentEvent.end_time}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, end_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Tier Scale</Label>
                  <Select value={currentEvent.tier_scale} onValueChange={(value) => setCurrentEvent(prev => ({ ...prev, tier_scale: value }))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select tier scale" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="tier1" className="text-white">Tier 1: Incident - Moderately disruptive event</SelectItem>
                      <SelectItem value="tier2" className="text-white">Tier 2: Emergency - Disruptive event requiring external assistance</SelectItem>
                      <SelectItem value="tier3" className="text-white">Tier 3: Disaster - Significant event with severe impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Escalation Value</Label>
                  <RadioGroup 
                    value={currentEvent.escalation_value} 
                    onValueChange={(value) => setCurrentEvent(prev => ({ ...prev, escalation_value: value }))}
                    className="grid grid-cols-5 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="esc-none" />
                      <Label htmlFor="esc-none" className="bg-gray-500 text-white px-2 py-1 rounded text-sm">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="esc-low" />
                      <Label htmlFor="esc-low" className="bg-green-600 text-white px-2 py-1 rounded text-sm">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="confirm" id="esc-confirm" />
                      <Label htmlFor="esc-confirm" className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">Confirm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warning" id="esc-warning" />
                      <Label htmlFor="esc-warning" className="bg-orange-600 text-white px-2 py-1 rounded text-sm">Warning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="danger" id="esc-danger" />
                      <Label htmlFor="esc-danger" className="bg-red-600 text-white px-2 py-1 rounded text-sm">Danger</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={addEvent} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </CardContent>
            </Card>

            {/* Added Events Display */}
            {events.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Events ({events.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{event.name}</h3>
                            <p className="text-gray-300 text-sm">{event.description}</p>
                            <div className="mt-2 flex space-x-4 text-xs text-gray-400">
                              <span>Start: {event.start_date} {event.start_time}</span>
                              <span>End: {event.end_date} {event.end_time}</span>
                              <span>Tier: {event.tier_scale}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeEvent(event.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 8: // Functions
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Functions</CardTitle>
                <CardDescription className="text-gray-400">
                  Define the functions to be exercised and tested
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Function Name</Label>
                  <Input
                    value={currentFunction.name}
                    onChange={(e) => setCurrentFunction(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Emergency Communications"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Function Description</Label>
                  <Textarea
                    value={currentFunction.description}
                    onChange={(e) => setCurrentFunction(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the function being tested..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Function Achieved</Label>
                  <RadioGroup 
                    value={currentFunction.achieved} 
                    onValueChange={(value) => setCurrentFunction(prev => ({ ...prev, achieved: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="func-yes" />
                      <Label htmlFor="func-yes" className="text-green-400">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Partial" id="func-partial" />
                      <Label htmlFor="func-partial" className="text-yellow-400">Partial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="func-no" />
                      <Label htmlFor="func-no" className="text-red-400">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button onClick={addFunction} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Function
                </Button>
              </CardContent>
            </Card>

            {/* Added Functions Display */}
            {functions.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Functions ({functions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {functions.map((func) => (
                      <div key={func.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{func.name}</h3>
                            <p className="text-gray-300 text-sm">{func.description}</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                              func.achieved === 'Yes' ? 'bg-green-600 text-white' :
                              func.achieved === 'Partial' ? 'bg-yellow-600 text-white' :
                              'bg-red-600 text-white'
                            }`}>
                              {func.achieved}
                            </span>
                          </div>
                          <Button
                            onClick={() => removeFunction(func.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 9: // Injections (MSEL Integration)
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Injections</CardTitle>
                <CardDescription className="text-gray-400">
                  Import MSEL events for this exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <div className="flex items-center space-x-3">
                    <ClipboardList className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="text-blue-300 font-semibold">MSEL Integration</h3>
                      <p className="text-gray-400 text-sm">Import events from Master Sequence Event List</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => window.open('#msel', '_blank')}
                  >
                    Open MSEL
                  </Button>
                </div>
                <div>
                  <Label className="text-gray-300">Exercise ID for MSEL Linking</Label>
                  <Input
                    placeholder="Enter exercise ID to link MSEL events"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Import MSEL Events
                </Button>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 10: // Organizations
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Organization Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="org_image" title="Organization" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Organizations</CardTitle>
                <CardDescription className="text-gray-400">
                  Add organizations participating in the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Organization Name</Label>
                  <Input
                    value={currentOrganization.name}
                    onChange={(e) => setCurrentOrganization(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., City Emergency Services"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={currentOrganization.description}
                    onChange={(e) => setCurrentOrganization(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the organization's role..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Home Base</Label>
                  <Input
                    value={currentOrganization.home_base}
                    onChange={(e) => setCurrentOrganization(prev => ({ ...prev, home_base: e.target.value }))}
                    placeholder="Organization headquarters or base location"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Contact First Name</Label>
                    <Input
                      value={currentOrganization.contact_first_name}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_first_name: e.target.value }))}
                      placeholder="First name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Contact Last Name</Label>
                    <Input
                      value={currentOrganization.contact_last_name}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_last_name: e.target.value }))}
                      placeholder="Last name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Contact Cell Phone</Label>
                    <Input
                      value={currentOrganization.contact_phone}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Contact Email</Label>
                    <Input
                      type="email"
                      value={currentOrganization.contact_email}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="contact@organization.com"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <Button onClick={addOrganization} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </Button>
              </CardContent>
            </Card>

            {/* Added Organizations Display */}
            {organizations.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Organizations ({organizations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizations.map((org) => (
                      <div key={org.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{org.name}</h3>
                            <p className="text-gray-300 text-sm">{org.description}</p>
                            <div className="mt-2 text-xs text-gray-400 space-y-1">
                              <div>Home Base: {org.home_base}</div>
                              <div>Contact: {org.contact_first_name} {org.contact_last_name}</div>
                              <div>Phone: {org.contact_phone} | Email: {org.contact_email}</div>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeOrganization(org.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 11: // Team Coordinators
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Team Coordinators</CardTitle>
                <CardDescription className="text-gray-400">
                  Select participants who will serve as team coordinators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="text-green-300 font-semibold">Participant Integration</h3>
                      <p className="text-gray-400 text-sm">Import eligible participants with coordinator roles</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    Load Coordinators
                  </Button>
                </div>
                <div className="bg-gray-700/50 p-4 rounded">
                  <p className="text-gray-400 text-sm">
                    Coordinators will be automatically selected from participants with the following roles:
                  </p>
                  <ul className="text-gray-400 text-sm mt-2 space-y-1">
                    <li>• Incident Commander</li>
                    <li>• Operations Chief</li>
                    <li>• Planning Chief</li>
                    <li>• Logistics Chief</li>
                    <li>• Finance Chief</li>
                    <li>• Participants with "Coordinator" in position title</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 12: // Code Words
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Code Word Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="code_image" title="Code Word" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Code Words</CardTitle>
                <CardDescription className="text-gray-400">
                  Define code words used during the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Code Word</Label>
                  <Input
                    value={currentCodeWord.word}
                    onChange={(e) => setCurrentCodeWord(prev => ({ ...prev, word: e.target.value }))}
                    placeholder="e.g., THUNDERBOLT"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Definition</Label>
                  <Textarea
                    value={currentCodeWord.meaning}
                    onChange={(e) => setCurrentCodeWord(prev => ({ ...prev, meaning: e.target.value }))}
                    placeholder="Define what this code word means..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addCodeWord} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Code Word
                </Button>
              </CardContent>
            </Card>

            {/* Added Code Words Display */}
            {codeWords.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Code Words ({codeWords.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {codeWords.map((codeWord) => (
                      <div key={codeWord.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{codeWord.word}</h3>
                            <p className="text-gray-300 text-sm mt-1">{codeWord.meaning}</p>
                          </div>
                          <Button
                            onClick={() => removeCodeWord(codeWord.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 13: // Callsigns
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Callsign Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="callsign_image" title="Callsign" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Communication Callsigns</CardTitle>
                <CardDescription className="text-gray-400">
                  Define radio callsigns for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Callsign</Label>
                  <Input
                    value={currentCallsign.callsign}
                    onChange={(e) => setCurrentCallsign(prev => ({ ...prev, callsign: e.target.value }))}
                    placeholder="e.g., COMMAND-1"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Definition</Label>
                  <Textarea
                    value={currentCallsign.description}
                    onChange={(e) => setCurrentCallsign(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Define the role or position for this callsign..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addCallsign} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Callsign
                </Button>
              </CardContent>
            </Card>

            {/* Added Callsigns Display */}
            {callsigns.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Callsigns ({callsigns.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {callsigns.map((callsign) => (
                      <div key={callsign.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{callsign.callsign}</h3>
                            <p className="text-gray-300 text-sm mt-1">{callsign.description}</p>
                          </div>
                          <Button
                            onClick={() => removeCallsign(callsign.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 14: // Communication Frequencies
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Frequency Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="freq_image" title="Communication Frequency" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Communication Frequencies</CardTitle>
                <CardDescription className="text-gray-400">
                  Define radio frequencies and settings for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Frequency Name</Label>
                    <Input
                      value={currentFrequency.frequency || ''}
                      onChange={(e) => setCurrentFrequency(prev => ({ ...prev, frequency: e.target.value }))}
                      placeholder="e.g., Command Net"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Frequency (MHz)</Label>
                    <Input
                      value={currentFrequency.type || ''}
                      onChange={(e) => setCurrentFrequency(prev => ({ ...prev, type: e.target.value }))}
                      placeholder="e.g., 155.475"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={currentFrequency.description || ''}
                    onChange={(e) => setCurrentFrequency(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the usage of this frequency..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Tone (Hz)</Label>
                    <Select 
                      value={currentFrequency.tone || ''} 
                      onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, tone: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                        {['71.9', '74.4', '77.0', '79.7', '82.5', '85.4', '88.5', '91.5', '94.8', '97.4', '100.0', '103.5', '107.2', '110.9', '114.8', '118.8', '123.0', '127.3'].map((tone) => (
                          <SelectItem key={tone} value={tone} className="text-white">{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Offset</Label>
                    <Select 
                      value={currentFrequency.offset || ''} 
                      onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, offset: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select offset" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="negative" className="text-white">Negative</SelectItem>
                        <SelectItem value="positive" className="text-white">Positive</SelectItem>
                        <SelectItem value="simplex" className="text-white">Simplex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Channel</Label>
                    <Input
                      value={currentFrequency.channel || ''}
                      onChange={(e) => setCurrentFrequency(prev => ({ ...prev, channel: e.target.value }))}
                      placeholder="e.g., 1"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Radio Type</Label>
                    <Select 
                      value={currentFrequency.radio_type || ''} 
                      onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, radio_type: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select radio type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="handheld" className="text-white">Handheld</SelectItem>
                        <SelectItem value="mobile" className="text-white">Mobile</SelectItem>
                        <SelectItem value="base_station" className="text-white">Base Station</SelectItem>
                        <SelectItem value="repeater" className="text-white">Repeater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Primary/Backup</Label>
                  <Select 
                    value={currentFrequency.primary_backup || 'Primary'} 
                    onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, primary_backup: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Primary" className="text-white">Primary</SelectItem>
                      <SelectItem value="Backup" className="text-white">Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addFrequency} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Frequency
                </Button>
              </CardContent>
            </Card>

            {/* Added Frequencies Display */}
            {frequencies.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Frequencies ({frequencies.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {frequencies.map((freq) => (
                      <div key={freq.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{freq.frequency}</h3>
                            <p className="text-gray-300 text-sm mt-1">{freq.description}</p>
                            <div className="mt-2 text-xs text-gray-400 grid grid-cols-2 gap-2">
                              <span>Frequency: {freq.type}</span>
                              <span>Type: {freq.primary_backup}</span>
                              <span>Tone: {freq.tone || 'Not set'}</span>
                              <span>Radio: {freq.radio_type || 'Not set'}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeFrequency(freq.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 15: // Assumptions
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Assumption Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="assumption_image" title="Assumption" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Assumptions</CardTitle>
                <CardDescription className="text-gray-400">
                  Define assumptions made for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Assumption Name</Label>
                  <Input
                    value={currentAssumption.assumption || ''}
                    onChange={(e) => setCurrentAssumption(prev => ({ ...prev, assumption: e.target.value }))}
                    placeholder="e.g., Weather Conditions"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Assumption Description</Label>
                  <Textarea
                    value={currentAssumption.description || ''}
                    onChange={(e) => setCurrentAssumption(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the assumption being made..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addAssumption} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assumption
                </Button>
              </CardContent>
            </Card>

            {/* Added Assumptions Display */}
            {assumptions.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Assumptions ({assumptions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assumptions.map((assumption) => (
                      <div key={assumption.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{assumption.assumption}</h3>
                            <p className="text-gray-300 text-sm mt-1">{assumption.description}</p>
                          </div>
                          <Button
                            onClick={() => removeAssumption(assumption.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 16: // Artificialities
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Artificiality Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="artificiality_image" title="Artificiality" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Artificialities</CardTitle>
                <CardDescription className="text-gray-400">
                  Define artificial constraints or limitations for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Artificiality Name</Label>
                  <Input
                    value={currentArtificiality.artificiality || ''}
                    onChange={(e) => setCurrentArtificiality(prev => ({ ...prev, artificiality: e.target.value }))}
                    placeholder="e.g., Simulated Resource Limitations"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Artificiality Description</Label>
                  <Textarea
                    value={currentArtificiality.description || ''}
                    onChange={(e) => setCurrentArtificiality(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the artificial constraint or limitation..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addArtificiality} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artificiality
                </Button>
              </CardContent>
            </Card>

            {/* Added Artificialities Display */}
            {artificialities.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Artificialities ({artificialities.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {artificialities.map((artificiality) => (
                      <div key={artificiality.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{artificiality.artificiality}</h3>
                            <p className="text-gray-300 text-sm mt-1">{artificiality.description}</p>
                          </div>
                          <Button
                            onClick={() => removeArtificiality(artificiality.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 17: // Safety
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Safety Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="safety_image" title="Safety" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Safety Officer Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Safety officer details are automatically populated from participants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-6 w-6 text-green-400" />
                    <h3 className="text-green-300 font-semibold">Current Safety Officer</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-300">First Name</Label>
                      <Input 
                        placeholder="Auto-populated"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Last Name</Label>
                      <Input 
                        placeholder="Auto-populated"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Cell Phone</Label>
                      <Input 
                        placeholder="Auto-populated"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 mt-3"
                  >
                    Load Safety Officer Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Safety Concerns</CardTitle>
                <CardDescription className="text-gray-400">
                  Document safety concerns and considerations for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Safety Concern Name</Label>
                  <Input
                    value={currentSafetyConcern.concern || ''}
                    onChange={(e) => setSafetyConcern(prev => ({ ...prev, concern: e.target.value }))}
                    placeholder="e.g., Vehicle Operations"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Safety Concern Description</Label>
                  <Textarea
                    value={currentSafetyConcern.description || ''}
                    onChange={(e) => setSafetyConcern(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the safety concern and mitigation measures..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Safety Officer Name</Label>
                    <Input
                      value={currentSafetyConcern.safety_officer || ''}
                      onChange={(e) => setSafetyConcern(prev => ({ ...prev, safety_officer: e.target.value }))}
                      placeholder="Responsible safety officer"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Officer Phone</Label>
                    <Input
                      value={currentSafetyConcern.phone || ''}
                      onChange={(e) => setSafetyConcern(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button onClick={addSafetyConcern} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Safety Concern
                </Button>
              </CardContent>
            </Card>

            {/* Added Safety Concerns Display */}
            {safetyConcerns.length > 0 && (
              <Card className="bg-gray-800 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-500">Added Safety Concerns ({safetyConcerns.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safetyConcerns.map((concern) => (
                      <div key={concern.id} className="p-4 bg-gray-700 rounded-lg border-l-4 border-red-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <ShieldAlert className="h-5 w-5 text-red-400" />
                              <h3 className="font-semibold text-white text-lg">{concern.concern}</h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{concern.description}</p>
                            <div className="text-xs text-gray-400">
                              <span>Safety Officer: {concern.safety_officer || 'Not assigned'}</span>
                              {concern.phone && <span> | Phone: {concern.phone}</span>}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeSafetyConcern(concern.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar Progress */}
        <div className="w-80 bg-gray-900 border-r border-orange-500/20 h-screen sticky top-0">
          <div className="p-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-400 hover:text-orange-500 mb-6 w-full justify-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h2 className="text-orange-500 font-bold text-lg mb-6">
              {isEditing ? 'Edit Exercise' : 'Exercise Builder'}
            </h2>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === step.number
                        ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                        : currentStep > step.number
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep === step.number
                          ? 'bg-orange-500 text-black'
                          : currentStep > step.number
                          ? 'bg-green-500 text-black'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {currentStep > step.number ? '✓' : step.number}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{step.title}</div>
                        <div className="text-xs opacity-75">{step.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                Step {currentStep}: {steps[currentStep - 1]?.title}
              </h1>
              <p className="text-gray-400">{steps[currentStep - 1]?.description}</p>
            </div>

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-gray-600 text-gray-300"
              >
                Previous
              </Button>

              <div className="text-center">
                <span className="text-gray-400 text-sm">
                  Step {currentStep} of {steps.length}
                </span>
              </div>

              <div className="space-x-3">
                {currentStep === steps.length ? (
                  <Button
                    onClick={saveExercise}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? 'Saving...' : 'Complete Exercise'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={saveExercise}
                      disabled={loading}
                      className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-orange-500 hover:bg-orange-600 text-black"
                    >
                      Next
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExerciseBuilder = () => {
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check URL parameters for exercise ID to edit
    // Handle parameters in hash format: #builder?exercise=<id>
    const hash = window.location.hash;
    const queryStart = hash.indexOf('?');
    let exerciseId = null;
    
    if (queryStart !== -1) {
      const queryString = hash.substring(queryStart + 1);
      const urlParams = new URLSearchParams(queryString);
      exerciseId = urlParams.get('exercise');
    }
    
    if (exerciseId) {
      setLoading(true);
      fetchExerciseForEdit(exerciseId);
    }
  }, []);

  const fetchExerciseForEdit = async (exerciseId) => {
    try {
      const response = await axios.get(`${API}/exercise-builder/${exerciseId}`);
      setEditingExercise(response.data);
    } catch (error) {
      console.error('Error fetching exercise for edit:', error);
      alert('Error loading exercise for editing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading exercise for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <ExerciseBuilderWizard 
      onBack={() => window.history.back()} 
      editingExercise={editingExercise}
    />
  );
};

// Scope Modal Component
const ScopeModal = ({ isOpen, onClose, onSave, initialData = null, exerciseId }) => {
  const [scopeData, setScopeData] = useState({
    scope_description: '',
    scope_hazards: '',
    scope_geographic_area: '',
    scope_functions: '',
    scope_organizations: '',
    scope_personnel: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setScopeData({
        scope_description: initialData.scope_description || '',
        scope_hazards: initialData.scope_hazards || '',
        scope_geographic_area: initialData.scope_geographic_area || '',
        scope_functions: initialData.scope_functions || '',
        scope_organizations: initialData.scope_organizations || '',
        scope_personnel: initialData.scope_personnel || ''
      });
    } else {
      setScopeData({
        scope_description: '',
        scope_hazards: '',
        scope_geographic_area: '',
        scope_functions: '',
        scope_organizations: '',
        scope_personnel: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSave = async () => {
    console.log('🚀 ScopeModal handleSave called');
    console.log('📊 Current scopeData:', scopeData);
    console.log('🆔 Exercise ID:', exerciseId);
    
    setLoading(true);
    try {
      console.log('📡 Fetching current exercise data...');
      
      // First fetch the current exercise data to get all required fields
      const currentExerciseResponse = await axios.get(`${API}/exercise-builder/${exerciseId}`);
      const currentExercise = currentExerciseResponse.data;
      
      console.log('✅ Current exercise fetched:', currentExercise);
      
      // Merge the scope data with the existing exercise data
      // Ensure required fields have valid values
      const updatePayload = {
        ...currentExercise,
        // Provide defaults for required fields if they're empty
        exercise_type: currentExercise.exercise_type || 'Table Top',
        location: currentExercise.location || 'Not specified',
        start_time: currentExercise.start_time || '09:00',
        end_time: currentExercise.end_time || '17:00',
        // Update scope fields
        scope_description: scopeData.scope_description,
        scope_hazards: scopeData.scope_hazards,
        scope_geographic_area: scopeData.scope_geographic_area,
        scope_functions: scopeData.scope_functions,
        scope_organizations: scopeData.scope_organizations,
        scope_personnel: scopeData.scope_personnel
      };
      
      console.log('📦 Update payload prepared:', updatePayload);
      console.log('🔄 Sending PUT request to:', `${API}/exercise-builder/${exerciseId}`);
      
      const response = await axios.put(`${API}/exercise-builder/${exerciseId}`, updatePayload);
      
      console.log('✅ Save successful! Response:', response.data);
      
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('❌ Error saving scope:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      // Show error message to user
      alert(`Error saving scope data: ${error.response?.data?.detail || error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-orange-500">
            {initialData ? 'Edit Exercise Scope' : 'Add Exercise Scope'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label className="text-gray-300">Scope Description</Label>
            <Textarea
              value={scopeData.scope_description}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_description: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={3}
              placeholder="Describe the overall scope of this exercise..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Hazards</Label>
            <Textarea
              value={scopeData.scope_hazards}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_hazards: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="List the hazards to be addressed in this exercise..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Geographic Area</Label>
            <Textarea
              value={scopeData.scope_geographic_area}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_geographic_area: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="Define the geographic boundaries and areas involved..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Functions</Label>
            <Textarea
              value={scopeData.scope_functions}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_functions: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="Specify the emergency response functions to be exercised..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Organizations</Label>
            <Textarea
              value={scopeData.scope_organizations}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_organizations: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="List the organizations and agencies participating..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Personnel</Label>
            <Textarea
              value={scopeData.scope_personnel}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_personnel: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="Describe the personnel and roles involved..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            {loading ? 'Saving...' : initialData ? 'Update Scope' : 'Add Scope'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Exercise Management Dashboard Component
const ExerciseManagementDashboard = ({ exerciseId }) => {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  
  // Modal states
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [editingScope, setEditingScope] = useState(null);
  
  // Exercise Steps menu expansion state
  const [exerciseStepsExpanded, setExerciseStepsExpanded] = useState(true);
  
  // Improvement menu expansion state
  const [improvementExpanded, setImprovementExpanded] = useState(true);

  useEffect(() => {
    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  const fetchExercise = async () => {
    try {
      const response = await axios.get(`${API}/exercise-builder/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      console.error('Error fetching exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const topLevelMenuItems = [
    { id: 'overview', title: 'Exercise Overview', icon: Shield }
  ];

  const exerciseStepsMenuItems = [
    { id: 'scope', title: 'Scope', icon: Target },
    { id: 'purpose', title: 'Purpose', icon: Flag },
    { id: 'scenario', title: 'Scenario', icon: Map },
    { id: 'goals', title: 'Goals', icon: Trophy },
    { id: 'events', title: 'Events', icon: Calendar },
    { id: 'functions', title: 'Functions', icon: Settings },
    { id: 'injections', title: 'Injections (MSEL)', icon: ClipboardList },
    { id: 'organizations', title: 'Organizations', icon: Building },
    { id: 'coordinators', title: 'Team Coordinators', icon: Users },
    { id: 'codewords', title: 'Code Words', icon: Key },
    { id: 'callsigns', title: 'Callsigns', icon: Radio },
    { id: 'frequencies', title: 'Communications', icon: Headphones },
    { id: 'assumptions', title: 'Assumptions', icon: MessageSquare },
    { id: 'artificialities', title: 'Artificialities', icon: AlertTriangle },
    { id: 'safety', title: 'Safety Concerns', icon: ShieldAlert },
  ];

  const improvementMenuItems = [
    { id: 'evaluations', title: 'Evaluations', icon: Star },
    { id: 'lessons_learned', title: 'Lessons Learned', icon: Lightbulb },
    { id: 'deficiencies', title: 'Deficiencies', icon: AlertCircle },
    { id: 'near_misses', title: 'Near Misses', icon: Zap },
    { id: 'comments', title: 'Comments', icon: MessageCircle },
    { id: 'corrective_actions', title: 'Corrective Actions', icon: CheckSquare }
  ];

  // Combined for compatibility with existing code
  const exerciseMenuItems = [
    ...topLevelMenuItems,
    { id: 'exercise', title: 'Exercise Details', icon: FileText },
    { id: 'objectives', title: 'Objectives', icon: CheckCircle },
    ...exerciseStepsMenuItems,
    ...improvementMenuItems
  ];

  const getExerciseStatus = () => {
    if (!exercise) return 'Unknown';
    const now = new Date();
    const startDate = new Date(exercise.start_date);
    const endDate = new Date(exercise.end_date);
    
    if (now < startDate) return 'Planning';
    if (now >= startDate && now <= endDate) return 'Active';
    if (now > endDate) return 'Completed';
    return 'Scheduled';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Scheduled': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const renderExerciseOverview = () => {
    if (!exercise) return null;
    
    const status = getExerciseStatus();
    
    return (
      <div className="space-y-6">
        {/* Exercise Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{exercise.exercise_name}</h1>
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(status)}>
                  {status}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {exercise.exercise_type}
                </Badge>
              </div>
            </div>
            {exercise.exercise_image && (
              <div className="w-20 h-20 rounded-lg bg-gray-700 overflow-hidden">
                <img src={exercise.exercise_image} alt={exercise.exercise_name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          
          <p className="text-gray-300 mb-4">{exercise.exercise_description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="text-sm font-medium text-gray-300">Location</span>
              </div>
              <p className="text-white">{exercise.location || 'Not specified'}</p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-orange-400" />
                <span className="text-sm font-medium text-gray-300">Duration</span>
              </div>
              <p className="text-white">
                {new Date(exercise.start_date).toLocaleDateString()} - {new Date(exercise.end_date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-orange-400" />
                <span className="text-sm font-medium text-gray-300">Participants</span>
              </div>
              <p className="text-white">{exercise.coordinators?.length || 0} Coordinators</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{exercise.goals?.length || 0}</div>
              <div className="text-sm text-gray-400">Goals</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{exercise.objectives?.length || 0}</div>
              <div className="text-sm text-gray-400">Objectives</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{exercise.events?.length || 0}</div>
              <div className="text-sm text-gray-400">Events</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{exercise.organizations?.length || 0}</div>
              <div className="text-sm text-gray-400">Organizations</div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Preparedness Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exercise Timeline */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-orange-500 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Exercise Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className="text-white font-medium">Exercise Start</div>
                    <div className="text-sm text-gray-400">
                      {new Date(exercise.start_date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-white font-medium">Exercise End</div>
                    <div className="text-sm text-gray-400">
                      {new Date(exercise.end_date).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center">
                <ShieldAlert className="h-5 w-5 mr-2" />
                Safety Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-white font-medium">Safety Concerns: {exercise.safetyConcerns?.length || 0}</div>
                <div className="text-sm text-gray-400">
                  {exercise.safetyConcerns?.length > 0 ? 
                    "Safety protocols have been documented for this exercise." : 
                    "No specific safety concerns documented."
                  }
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => setActiveSection('safety')}
                >
                  View Safety Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-black"
                onClick={() => window.location.href = `#builder?exercise=${exercise.id}`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Exercise
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                onClick={() => setActiveSection('goals')}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Manage Goals
              </Button>
              <Button 
                variant="outline" 
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                onClick={() => setActiveSection('events')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
              <Button 
                variant="outline" 
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                onClick={() => setActiveSection('coordinators')}
              >
                <Users className="h-4 w-4 mr-2" />
                Team Coordinators
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSectionContent = () => {
    if (activeSection === 'overview') {
      return renderExerciseOverview();
    }
    
    // Render specific management interfaces for each section
    switch (activeSection) {
      case 'scope':
        return renderScopeManagement();
      case 'goals':
        return renderGoalsManagement();
      case 'objectives':
        return renderObjectivesManagement();
      case 'events':
        return renderEventsManagement();
      case 'safety':
        return renderSafetyManagement();
      case 'evaluations':
        return renderEvaluationsManagement();
      case 'lessons_learned':
        return renderLessonsLearnedManagement();
      case 'deficiencies':
        return renderDeficienciesManagement();
      case 'near_misses':
        return renderNearMissesManagement();
      case 'comments':
        return renderCommentsManagement();
      case 'corrective_actions':
        return renderCorrectiveActionsManagement();
      default:
        return renderGenericSectionManagement();
    }
  };

  const handleScopeUpdate = (updatedExercise) => {
    setExercise(updatedExercise);
  };

  const renderScopeManagement = () => {
    const hasScope = exercise?.scope_description || exercise?.scope_hazards || 
                    exercise?.scope_geographic_area || exercise?.scope_functions || 
                    exercise?.scope_organizations || exercise?.scope_personnel;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Scope</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {
              setEditingScope(hasScope ? exercise : null);
              setScopeModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {hasScope ? 'Edit Scope' : 'Add Scope'}
          </Button>
        </div>

        {/* Scope Display */}
        {hasScope ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-6">
                {exercise.scope_description && (
                  <div>
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">Description</h3>
                    <p className="text-gray-300">{exercise.scope_description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exercise.scope_hazards && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Hazards</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_hazards}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_geographic_area && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Geographic Area</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_geographic_area}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_functions && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Functions</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_functions}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_organizations && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Organizations</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_organizations}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_personnel && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Personnel</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_personnel}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                  <Button 
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => {
                      setEditingScope(exercise);
                      setScopeModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Scope
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-800 border-gray-700 border-dashed">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Scope Defined</h3>
              <p className="text-gray-500 mb-4">
                Define the exercise scope including hazards, geographic area, functions, organizations, and personnel.
              </p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-black"
                onClick={() => {
                  setEditingScope(null);
                  setScopeModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Scope
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Exercise Details Context */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Location:</span>
                <p className="text-white">{exercise?.location || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-400">Start Date:</span>
                <p className="text-white">{exercise?.start_date || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">End Date:</span>
                <p className="text-white">{exercise?.end_date || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Exercise Type:</span>
                <p className="text-white">{exercise?.exercise_type || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGoalsManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Goals</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new goal logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {exercise.goals && exercise.goals.length > 0 ? (
            exercise.goals.map((goal, index) => (
              <Card key={goal.id || index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{goal.name}</h3>
                      <p className="text-gray-300 mb-3">{goal.description}</p>
                      <Badge className={
                        goal.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        goal.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }>
                        Status: {goal.achieved}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Goals Yet</h3>
                <p className="text-gray-500 mb-4">Add exercise goals to track progress and success criteria.</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderObjectivesManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Objectives</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new objective logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </div>

        {/* Objectives List */}
        <div className="space-y-4">
          {exercise.objectives && exercise.objectives.length > 0 ? (
            exercise.objectives.map((objective, index) => (
              <Card key={objective.id || index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{objective.name}</h3>
                      <p className="text-gray-300 mb-3">{objective.description}</p>
                      <Badge className={
                        objective.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        objective.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }>
                        Status: {objective.achieved}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Objectives Yet</h3>
                <p className="text-gray-500 mb-4">Add specific objectives to measure exercise success.</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Objective
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderEventsManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Events</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new event logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {exercise.events && exercise.events.length > 0 ? (
            exercise.events.map((event, index) => (
              <Card key={event.id || index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
                      <p className="text-gray-300 mb-3">{event.description}</p>
                      <div className="flex space-x-4 text-sm text-gray-400">
                        <span>Start: {event.startTime || 'Not set'}</span>
                        <span>End: {event.endTime || 'Not set'}</span>
                        <span>Tier: {event.tierScale || 'Not set'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Events Yet</h3>
                <p className="text-gray-500 mb-4">Add events to create the exercise timeline and scenarios.</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Event
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderSafetyManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Safety Concerns</h1>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {/* Add new safety concern logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Safety Concern
          </Button>
        </div>

        {/* Safety Concerns List */}
        <div className="space-y-4">
          {exercise.safetyConcerns && exercise.safetyConcerns.length > 0 ? (
            exercise.safetyConcerns.map((concern, index) => (
              <Card key={concern.id || index} className="bg-gray-800 border-red-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <ShieldAlert className="h-5 w-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">{concern.name}</h3>
                      </div>
                      <p className="text-gray-300 mb-3">{concern.description}</p>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        Priority: High
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <ShieldAlert className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Safety Concerns</h3>
                <p className="text-gray-500 mb-4">Document safety concerns and mitigation measures for this exercise.</p>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Safety Concern
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderGenericSectionManagement = () => {
    const sectionTitle = exerciseMenuItems.find(item => item.id === activeSection)?.title || activeSection;
    const sectionData = exercise?.[activeSection] || [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{sectionTitle}</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new item logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {sectionTitle}
          </Button>
        </div>

        {/* Current Data Display */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Current {sectionTitle} Data</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(sectionData) && sectionData.length > 0 ? (
              <div className="space-y-4">
                {sectionData.map((item, index) => (
                  <div key={item.id || index} className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">
                          {item.name || item.word || item.callsign || `${sectionTitle} ${index + 1}`}
                        </h3>
                        {item.description && (
                          <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        )}
                        {item.definition && (
                          <p className="text-gray-400 text-sm mb-2">Definition: {item.definition}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          {Object.entries(item).filter(([key]) => !['id', 'name', 'description', 'definition'].includes(key))
                            .map(([key, value]) => `${key}: ${value}`).join(' | ')}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No {sectionTitle.toLowerCase()} data available</div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-black"
                  onClick={() => {/* Add new item logic */}}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First {sectionTitle}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CRUD Interface Note */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-400" />
              <div className="text-blue-300 text-sm">
                Full CRUD interface for {sectionTitle.toLowerCase()} management will be implemented here. 
                Users will be able to create, edit, update, and delete {sectionTitle.toLowerCase()} with proper forms and validation.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEvaluationsManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Evaluations</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new evaluation logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Evaluation
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Evaluations Yet</h3>
            <p className="text-gray-500 mb-4">Add exercise evaluations to track performance and effectiveness.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Evaluation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLessonsLearnedManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Lessons Learned</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new lesson logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <Lightbulb className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Lessons Learned Yet</h3>
            <p className="text-gray-500 mb-4">Document key lessons and insights from the exercise.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Lesson
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDeficienciesManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Deficiencies</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new deficiency logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deficiency
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Deficiencies Recorded</h3>
            <p className="text-gray-500 mb-4">Track areas that need improvement or fell short of expectations.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Deficiency
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderNearMissesManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Near Misses</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new near miss logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Near Miss
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Near Misses Reported</h3>
            <p className="text-gray-500 mb-4">Document incidents that almost occurred but were avoided.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Near Miss
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCommentsManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Comments</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new comment logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Comments Yet</h3>
            <p className="text-gray-500 mb-4">Add general observations and feedback about the exercise.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Comment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCorrectiveActionsManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Corrective Actions</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black"
            onClick={() => {/* Add new corrective action logic */}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Corrective Action
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Corrective Actions Yet</h3>
            <p className="text-gray-500 mb-4">Define actions to address identified issues and improvements.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Corrective Action
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Exercise Not Found</h3>
          <p className="text-gray-500 mb-4">The requested exercise could not be loaded.</p>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '#dashboard'}
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Exercise-Specific Sidebar */}
        <div className="w-80 bg-gray-900 border-r border-orange-500/20 h-screen sticky top-0">
          <div className="p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-orange-500 mb-4"
              onClick={() => window.location.href = '#dashboard'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">{exercise.exercise_name}</h2>
              <Badge className={getStatusColor(getExerciseStatus())}>
                {getExerciseStatus()}
              </Badge>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-1">
                {/* Top Level Menu Items */}
                {topLevelMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "secondary" : "ghost"}
                      className={`w-full justify-start text-left ${
                        activeSection === item.id
                          ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
                          : "text-gray-300 hover:text-orange-500 hover:bg-gray-800"
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Button>
                  );
                })}
                
                {/* Exercise Steps Collapsible Section */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left text-gray-300 hover:text-orange-500 hover:bg-gray-800 mb-1"
                    onClick={() => setExerciseStepsExpanded(!exerciseStepsExpanded)}
                  >
                    {exerciseStepsExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                    )}
                    <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">Exercise Steps</span>
                  </Button>
                  
                  {/* Exercise Steps Sub-menu Items */}
                  {exerciseStepsExpanded && (
                    <div className="ml-4 space-y-1 border-l border-gray-700 pl-2">
                      {exerciseStepsMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-start text-left text-sm ${
                              activeSection === item.id
                                ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
                                : "text-gray-400 hover:text-orange-500 hover:bg-gray-800"
                            }`}
                            onClick={() => setActiveSection(item.id)}
                          >
                            <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Improvement Collapsible Section */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left text-gray-300 hover:text-orange-500 hover:bg-gray-800 mb-1"
                    onClick={() => setImprovementExpanded(!improvementExpanded)}
                  >
                    {improvementExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                    )}
                    <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">Improvement</span>
                  </Button>
                  
                  {/* Improvement Sub-menu Items */}
                  {improvementExpanded && (
                    <div className="ml-4 space-y-1 border-l border-gray-700 pl-2">
                      {improvementMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-start text-left text-sm ${
                              activeSection === item.id
                                ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
                                : "text-gray-400 hover:text-orange-500 hover:bg-gray-800"
                            }`}
                            onClick={() => setActiveSection(item.id)}
                          >
                            <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ScopeModal 
        isOpen={scopeModalOpen}
        onClose={() => setScopeModalOpen(false)}
        onSave={handleScopeUpdate}
        initialData={editingScope}
        exerciseId={exerciseId}
      />
    </div>
  );
};

// Main App Component
function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [managingExerciseId, setManagingExerciseId] = useState(null);

  // Handle URL-based navigation for editing exercises
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the #
      
      // Check for parameters in hash format: #builder?exercise=<id> or #manage?exercise=<id>
      const queryStart = hash.indexOf('?');
      let hashBase = hash;
      let exerciseId = null;
      
      if (queryStart !== -1) {
        hashBase = hash.substring(0, queryStart);
        const queryString = hash.substring(queryStart + 1);
        const urlParams = new URLSearchParams(queryString);
        exerciseId = urlParams.get('exercise');
      }
      
      if (hashBase === 'manage' && exerciseId) {
        setActiveMenu('manage');
        setManagingExerciseId(exerciseId);
      } else if (hashBase === 'builder') {
        setActiveMenu('builder');
        setManagingExerciseId(null);
      } else if (hashBase && ['dashboard', 'exercises', 'msel', 'hira', 'participants'].includes(hashBase)) {
        setActiveMenu(hashBase);
        setManagingExerciseId(null);
      } else if (!hashBase) {
        setActiveMenu('dashboard');
        setManagingExerciseId(null);
      }
    };

    // Handle initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

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
      case 'manage':
        return <ExerciseManagementDashboard exerciseId={managingExerciseId} />;
      default:
        return <Dashboard />;
    }
  };

  // Don't show the main navigation and sidebar for the exercise management dashboard
  if (activeMenu === 'manage') {
    return (
      <div className="min-h-screen bg-black text-white">
        <BrowserRouter>
          {renderContent()}
        </BrowserRouter>
      </div>
    );
  }

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