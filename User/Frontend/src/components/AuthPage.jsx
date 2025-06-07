import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Chrome
} from 'lucide-react';

import {useNavigate} from "react-router-dom"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phoneNo:'', 
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const endpoint = isLogin ? 'login' : 'signup';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`http://localhost:80/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // alert(isLogin ? 'Login successful!' : 'Account created successfully!');
      if (isLogin)
        {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("isValid" , true) ; 
          // localStorage.setItem("password", formData.password); 
          navigate('/')
        }
        
      else
      {
         setIsLogin(true);
      }

    }
     catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Google authentication successful!');
    }, 1500);
  };

  const goBack = () => {
    navigate("/"); 
  };
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Left Side - Branding */}
      <div 
        className="relative flex-col items-center justify-center hidden p-12 overflow-hidden text-white lg:flex lg:w-1/2"
        style={{ 
          background: `linear-gradient(135deg, #FF4C29 0%, #FFD93D 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-32 h-32 bg-white rounded-full top-10 left-10"></div>
          <div className="absolute w-24 h-24 bg-white rounded-full bottom-20 right-20"></div>
          <div className="absolute w-16 h-16 bg-white rounded-full top-1/2 left-1/4"></div>
        </div>
        
        <div className="z-10 max-w-md text-center">
          <h1 className="mb-6 text-5xl font-bold">
            Luckey's <span className="text-white">Kitchen</span>
          </h1>
          <p className="mb-8 text-xl opacity-90">
            Delicious meals delivered fresh to your doorstep
          </p>
          <div className="flex flex-col space-y-4 text-lg">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Fresh ingredients daily</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>30-minute delivery guarantee</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>100+ satisfied customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex flex-col justify-center w-full px-8 lg:w-1/2 lg:px-12">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center mb-8 space-x-2 text-gray-600 transition-colors hover:text-gray-800 w-fit"
        >
          <ArrowLeft size={20} />
          <span>Back to Menu</span>
        </button>

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold" style={{ color: '#333333' }}>
              {isLogin ? 'Welcome Back!' : 'Join Luckey\'s Kitchen'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to your account to continue ordering' 
                : 'Create your account and start enjoying delicious meals'
              }
            </p>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="flex items-center justify-center w-full px-4 py-3 mb-6 space-x-3 transition-all duration-300 border-2 border-gray-200 rounded-lg hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome size={20} style={{ color: '#4285F4' }} />
            <span style={{ color: '#333333' }}>
              {isLogin ? 'Sign in' : 'Sign up'} with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name Fields (Signup only) */}
            {!isLogin && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.firstName 
                          ? 'border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-orange-200'
                      }`}
                      style={{ 
                        focusRingColor: errors.firstName ? undefined : '#FF4C29' 
                      }}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.lastName 
                          ? 'border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-orange-200'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-orange-200'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.phone 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:ring-orange-200'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-orange-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:ring-orange-200'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: '#FF4C29' }}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white transition-all duration-300 transform rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              style={{ backgroundColor: '#FF4C29' }}
            >
              {isLoading 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    email: '',
                    phoneNo: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    phone: ''
                  });
                  setErrors({});
                }}
                className="font-semibold transition-colors hover:underline"
                style={{ color: '#FF4C29' }}
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>

          {/* Terms (Signup only) */}
          {!isLogin && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <button className="underline hover:no-underline" style={{ color: '#FF4C29' }}>
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="underline hover:no-underline" style={{ color: '#FF4C29' }}>
                  Privacy Policy
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;