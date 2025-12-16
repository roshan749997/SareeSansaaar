import jwt from 'jsonwebtoken';
import { otpStore, hashOTP } from './sendOtp.js';
import User from '../models/User.js';

/**
 * Verify OTP and generate JWT token
 */
export async function verifyOtp(req, res) {
  try {
    console.log('[verifyOtp] Starting OTP verification');
    console.log('[verifyOtp] Request body:', { phone: req.body.phone, mobile: req.body.mobile, otp: '***' });
    
    // Accept both phone / mobile
    let phone = (req.body.phone || req.body.mobile || '').toString().trim();
    const otp = (req.body.otp || '').toString().trim();

    // Validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    phone = phone.replace(/\D/g, '');
    if (phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must be 10 digits',
      });
    }

    // Validate phone starts with 6-9 (Indian mobile number format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must start with 6, 7, 8, or 9',
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format',
      });
    }

    // Check stored OTP
    const storedData = otpStore.get(phone);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found',
      });
    }

    // Expiry check
    if (Date.now() > storedData.expiry) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'OTP expired',
      });
    }

    // OTP verify
    const hashedInput = hashOTP(otp);
    if (hashedInput !== storedData.hashedOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Valid OTP → remove from memory
    otpStore.delete(phone);

    console.log('[verifyOtp] Looking for user with phone:', phone);

    // Find user
    let user = await User.findOne({ phone });
    console.log('[verifyOtp] Initial findOne result:', user ? `Found user ${user._id}` : 'Not found');

    // If new user → create
    if (!user) {
      try {
        console.log('[verifyOtp] Creating new user with phone:', phone);
        user = await User.create({
          name: `User ${phone.slice(-4)}`,
          phone,
          provider: 'otp',
          // Explicitly don't set email - leave it undefined/null
          email: undefined,
        });
        console.log('[verifyOtp] New user created successfully:', { id: String(user._id), phone: user.phone });
      } catch (err) {
        console.error('[verifyOtp] User creation error:', {
          code: err.code,
          name: err.name,
          message: err.message,
          keyPattern: err.keyPattern,
          keyValue: err.keyValue,
        });

        // If user already exists due to race condition
        if (err.code === 11000) {
          const duplicateField = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'unknown';
          const duplicateValue = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown';
          console.log('[verifyOtp] Duplicate key error on field:', duplicateField, 'value:', duplicateValue);
          
          // If duplicate is on phone field, user definitely exists - find it
          if (duplicateField === 'phone') {
            console.log('[verifyOtp] Duplicate on phone - user exists, finding by phone...');
            user = await User.findOne({ phone });
            if (user) {
              console.log('[verifyOtp] Found existing user by phone:', { id: String(user._id), phone: user.phone });
            } else {
              // Try different phone formats
              user = await User.findOne({ phone: phone.toString() });
              if (!user) {
                user = await User.findOne({ phone: { $regex: phone.slice(-10) } });
              }
            }
          } 
          // If duplicate is on email field, ignore it - OTP login doesn't use email
          // Just find user by phone or create without email
          else if (duplicateField === 'email') {
            console.log('[verifyOtp] Duplicate on email - ignoring, OTP login doesn\'t need email');
            console.log('[verifyOtp] Finding user by phone...');
            
            // Find user by phone (email duplicate doesn't matter for OTP login)
            user = await User.findOne({ phone });
            
            if (!user) {
              // User doesn't exist, create without email using findOneAndUpdate
              console.log('[verifyOtp] Creating user without email using findOneAndUpdate...');
              try {
                user = await User.findOneAndUpdate(
                  { phone },
                  {
                    $setOnInsert: {
                      name: `User ${phone.slice(-4)}`,
                      phone,
                      provider: 'otp',
                      // Don't set email - leave it undefined
                    }
                  },
                  { upsert: true, new: true }
                );
                console.log('[verifyOtp] User created/found with findOneAndUpdate:', { id: String(user._id), phone: user.phone });
              } catch (upsertErr) {
                console.error('[verifyOtp] findOneAndUpdate failed:', upsertErr);
                // If upsert fails, try to find existing user
                user = await User.findOne({ phone: phone.toString() });
                if (!user) {
                  user = await User.findOne({ phone: { $regex: phone.slice(-10) } });
                }
              }
            }
          } 
          // For other duplicate fields (googleId, etc.)
          else {
            console.log('[verifyOtp] Duplicate on other field:', duplicateField);
            // Still try to find by phone
            user = await User.findOne({ phone });
            if (!user) {
              // Try findOneAndUpdate as last resort (without email)
              user = await User.findOneAndUpdate(
                { phone },
                {
                  $setOnInsert: {
                    name: `User ${phone.slice(-4)}`,
                    phone,
                    provider: 'otp',
                    // Don't set email
                  }
                },
                { upsert: true, new: true }
              );
            }
          }
          
          // Final check - if still no user, throw error
          if (!user) {
            console.error('[verifyOtp] All attempts failed to find or create user');
            throw new Error('Unable to create or retrieve user. Please try again or contact support.');
          }
        } else {
          throw err;
        }
      }
    }

    // Ensure user exists before proceeding
    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create or retrieve user',
      });
    }

    // Update provider if needed
    if (user.provider !== 'otp') {
      user.provider = 'otp';
      await user.save();
    }

    // JWT secret check
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error (JWT missing)',
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: String(user._id),
        phone: user.phone,
        email: user.email,
        isAdmin: !!user.isAdmin,
        type: 'otp_login',
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Cookie settings
    const isProd =
      process.env.NODE_ENV === 'production' ||
      (process.env.BACKEND_URL || '').startsWith('https://');

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: !!user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
